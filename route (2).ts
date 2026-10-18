import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { subOk } from '@/lib/util';

export async function GET(req: Request) {
  const sub = (new URL(req.url).searchParams.get('subdomain') || '').toLowerCase();
  if (!subOk(sub)) return NextResponse.json({ available: false, valid: false, active: false });
  const { data } = await db.from('vendors').select('is_active').eq('subdomain', sub).maybeSingle();
  return NextResponse.json({ available: !data, valid: true, active: !!data?.is_active });
}
