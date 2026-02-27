import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { validateMutationOrigin } from '@/lib/security/origin';
import {
  createPublishContentHash,
  ensureBlogContentDirectories,
  getSupportedBlogCategories,
  isValidCategoryPath,
  publishArticleArtifact,
} from '@/lib/blog-publish';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';

function getStringFromJsonValue(value: unknown, key: string): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'string' ? candidate : null;
}

const publishSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(5).max(180),
  excerpt: z.string().min(20).max(350),
  category: z.string().min(1),
  content: z.string().min(120),
  tags: z.array(z.string().min(1)).max(15).default([]),
  authorName: z.string().min(2).max(120),
  authorBio: z.string().max(320).optional(),
  heroImage: z.string().url().optional(),
  heroImageAlt: z.string().max(180).optional(),
  citySlug: z.string().min(1).optional(),
  cityName: z.string().min(1).optional(),
  readTime: z.number().int().min(1).max(120).optional(),
  featuredOrder: z.number().int().min(0).max(200).optional(),
  metaTitle: z.string().max(180).optional(),
  metaDescription: z.string().max(320).optional(),
  publishedAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  const isAllowedOrigin = await validateMutationOrigin();
  if (!isAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let auditActorId = 'anonymous';
  let auditSlug = 'unknown';

  try {
    const payload = await request.json();
    const parsed = publishSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    auditActorId = user.id;

    const profile = await prisma.profile.findUnique({
      where: { authId: user.id },
      select: { role: true },
    });

    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!isValidCategoryPath(parsed.data.category)) {
      return NextResponse.json(
        {
          error: 'Unsupported category',
          supportedCategories: getSupportedBlogCategories(),
        },
        { status: 400 }
      );
    }

    const publishInput = {
      ...parsed.data,
      category: parsed.data.category,
    };
    auditSlug = publishInput.slug;
    const contentHash = createPublishContentHash(publishInput);
    const headerIdempotencyKey = request.headers.get('x-idempotency-key')?.trim() ?? '';
    const requestIdempotencyKey = headerIdempotencyKey || `blog-publish:${parsed.data.slug}:${contentHash}`;
    const scopedIdempotencyKey = `${user.id}:BLOG_PUBLISH:${requestIdempotencyKey}`;

    const existingSuccess = await prisma.auditLog.findFirst({
      where: {
        tableName: 'BlogPublish',
        operation: 'PUBLISH_SUCCESS',
        changeHash: scopedIdempotencyKey,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingSuccess) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        idempotencyKey: requestIdempotencyKey,
        scopedIdempotencyKey,
        contentHash,
        path: getStringFromJsonValue(existingSuccess.changeData, 'path'),
        mode: getStringFromJsonValue(existingSuccess.changeData, 'mode'),
        commitSha: getStringFromJsonValue(existingSuccess.changeData, 'commitSha'),
      });
    }

    await logAdminAuditEvent({
      tableName: 'BlogPublish',
      operation: 'PUBLISH_ATTEMPT',
      changedBy: user.id,
      recordId: parsed.data.slug,
        changeData: {
          slug: parsed.data.slug,
          category: parsed.data.category,
          idempotencyKey: requestIdempotencyKey,
          scopedIdempotencyKey,
          contentHash,
        },
      });

    await ensureBlogContentDirectories();

    const result = await publishArticleArtifact(publishInput);

    await prisma.auditLog.create({
      data: {
        tableName: 'BlogPublish',
        operation: 'PUBLISH_SUCCESS',
        changedBy: user.id,
        recordId: parsed.data.slug,
        changeData: {
          slug: parsed.data.slug,
          category: parsed.data.category,
          path: result.path,
          mode: result.mode,
          commitSha: result.commitSha ?? null,
          rollback: result.rollback,
          idempotencyKey: requestIdempotencyKey,
          scopedIdempotencyKey,
          contentHash,
        },
        changeHash: scopedIdempotencyKey,
      },
    });

    return NextResponse.json({
      success: true,
      idempotent: false,
      idempotencyKey: requestIdempotencyKey,
      scopedIdempotencyKey,
      contentHash,
      path: result.path,
      mode: result.mode,
      commitSha: result.commitSha ?? null,
      rollback: result.rollback,
    });
  } catch (error) {
    try {
      await logAdminAuditEvent({
        tableName: 'BlogPublish',
        operation: 'PUBLISH_FAILED',
        changedBy: auditActorId,
        recordId: auditSlug,
        changeData: {
          slug: auditSlug,
          error: error instanceof Error ? error.message : 'unknown_error',
        },
      });
    } catch {
      // non-blocking audit
    }
    console.error('Publish article endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
