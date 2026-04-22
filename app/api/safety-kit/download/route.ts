import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { type NextRequest } from 'next/server';
import { normalizeSafetyKitLocale, type SafetyKitLocale } from '@/lib/safety-kit';

const pdfFileNames: Record<SafetyKitLocale, string> = {
  en: 'spain-safety-kit-en.pdf',
  es: 'spain-safety-kit-es.pdf',
  fr: 'spain-safety-kit-fr.pdf',
  de: 'spain-safety-kit-de.pdf',
};

export async function GET(request: NextRequest): Promise<Response> {
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'en';
  const locale = normalizeSafetyKitLocale(localeParam);
  const fileName = pdfFileNames[locale];
  const filePath = path.join(process.cwd(), 'public', 'material', fileName);

  try {
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Safety Kit PDF not found', { status: 404 });
  }
}

