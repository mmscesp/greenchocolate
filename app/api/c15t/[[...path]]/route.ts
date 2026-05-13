import { NextResponse, type NextRequest } from 'next/server';

async function handleC15t(request: NextRequest) {
  if (process.env.C15T_SELF_HOSTED_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'c15t self-hosted endpoint is not enabled' },
      { status: 404 }
    );
  }

  const { c15t } = await import('@/lib/c15t');
  return c15t.handler(request);
}

export function DELETE(request: NextRequest) {
  return handleC15t(request);
}

export function GET(request: NextRequest) {
  return handleC15t(request);
}

export function PATCH(request: NextRequest) {
  return handleC15t(request);
}

export function POST(request: NextRequest) {
  return handleC15t(request);
}

export function PUT(request: NextRequest) {
  return handleC15t(request);
}
