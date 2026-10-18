import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { fail, phone } from '@/lib/util';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const momo = phone(b.momoNumber);
  const code = String(b.code || '').trim().toUpperCase();
  if (!momo || !code) return fail('Enter your referral code and MoMo number.');
  const { data: a } = await db.from('agents').select('id, full_name, referral_code, balance_earned')
    .eq('referral_code', code).eq('momo_number', momo).maybeSingle();
  if (!a) return fail('We could not find an agent with that code and number.', 404);
  const { data: shops } = await db.from('vendors').select('business_name, subdomain, is_active, created_at')
    .eq('agent_id', a.id).order('created_at', { ascending: false });
  return NextResponse.json({ name: a.full_name, code: a.referral_code, balance: Number(a.balance_earned), shops: shops ?? [] });
}
