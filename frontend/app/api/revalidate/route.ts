import { NextRequest, NextResponse } from 'next/server';
import { cacheInvalidate, cacheInvalidateAll, cacheKeys } from '@/lib/cache';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key) {
    cacheInvalidate(key);
    return NextResponse.json({ revalidated: key });
  }

  cacheInvalidateAll();
  return NextResponse.json({ revalidated: 'all' });
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ keys: cacheKeys() });
}
