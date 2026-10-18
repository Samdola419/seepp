import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { BANK, fail, phone } from '@/lib/util';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.fullName || '').trim();
  const momo = phone(b.momoNumber);
  const net = String(b.momoNetwork || '').toUpperCase();
  if (name.length < 2) return fail('Enter your full name.');
  if (!momo) return fail('Enter a 10-digit MoMo number, like 024 123 4567.');
  if (!BANK[net]) return fail('Choose your MoMo network.');

  const stem = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5).padEnd(3, 'X');
  for (let i = 0; i < 5; i++) {
    const code = stem + Math.floor(100 + Math.random() * 900);
    const { error } = await db.from('agents').insert({ full_name: name, momo_number: momo, momo_network: net, referral_code: code });
    if (!error) return NextResponse.json({ code });
    if (error.message.includes('momo_number')) return fail('That MoMo number already has an agent account. Open your dashboard instead.', 409);
  }
  return fail('Could not create your code. Try again.', 500);
}
