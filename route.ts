import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { ps } from '@/lib/paystack';
import { BANK, fail, phone, subOk } from '@/lib/util';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.businessName || '').trim();
  const sub = String(b.subdomain || '').toLowerCase().trim();
  const wa = phone(b.whatsappNumber), momo = phone(b.ownerMomoNumber);
  const net = String(b.ownerMomoNetwork || '').toUpperCase();

  if (name.length < 2 || name.length > 60) return fail('Enter your business name.');
  if (!subOk(sub)) return fail('Shop link must be 3 to 30 letters, numbers or hyphens.');
  if (!wa) return fail('Enter a 10-digit WhatsApp number, like 024 123 4567.');
  if (!momo) return fail('Enter a 10-digit MoMo number, like 024 123 4567.');
  if (!BANK[net]) return fail('Choose your MoMo network.');

  let agentId: string | null = null;
  if (b.referralCode) {
    const { data } = await db.from('agents').select('id').eq('referral_code', String(b.referralCode).trim().toUpperCase()).maybeSingle();
    agentId = data?.id ?? null;
  }

  const { data: vendor, error } = await db.from('vendors').insert({
    business_name: name, subdomain: sub, whatsapp_number: wa,
    owner_momo_number: momo, owner_momo_network: net, agent_id: agentId,
  }).select('id').single();
  if (error) return error.code === '23505' ? fail('That shop link is taken. Try another.', 409) : fail('Could not register. Try again.', 500);

  // Create the Paystack subaccount now so a wrong MoMo number is caught before the owner pays.
  const sa = await ps('/subaccount', {
    business_name: name, settlement_bank: BANK[net], account_number: momo, percentage_charge: 0,
  });
  if (!sa.status) {
    await db.from('vendors').delete().eq('id', vendor.id);
    return fail(`Paystack could not verify that MoMo number: ${sa.message}`);
  }
  await db.from('vendors').update({ paystack_subaccount_code: sa.data.subaccount_code }).eq('id', vendor.id);
  return NextResponse.json({ vendorId: vendor.id });
}
