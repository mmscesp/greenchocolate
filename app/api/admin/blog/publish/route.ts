import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { validateMutationOrigin } from '@/lib/security/origin';
import {
  ensureBlogContentDirectories,
  getSupportedBlogCategories,
  isValidCategoryPath,
  publishArticleArtifact,
} from '@/lib/blog-publish';

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

    const profile = await prisma.profile.findUnique({
      where: { authId: user.id },
      select: { role: true },
    });

    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
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

    await ensureBlogContentDirectories();

    const result = await publishArticleArtifact({
      ...parsed.data,
      category: parsed.data.category,
    });

    return NextResponse.json({
      success: true,
      path: result.path,
      mode: result.mode,
      commitSha: result.commitSha ?? null,
    });
  } catch (error) {
    console.error('Publish article endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
