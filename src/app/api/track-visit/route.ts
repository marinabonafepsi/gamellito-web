import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// POST /api/track-visit - one event per browser session (any page, logged in or not)
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  await trackEvent('visita', { path: typeof body?.path === 'string' ? body.path : null });
  return NextResponse.json({ ok: true });
}
