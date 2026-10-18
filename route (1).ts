import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { ps } from '@/lib/paystack';
import { fail } from '@/lib/util';

export async function POST(req: Request) {
  const { vendorId } = await req.json().catch(() => ({}));
  const { data: v } = await db.from('vendors').select('id, subdomain, activation_fee_paid').eq('id', vendorId).maybeSingle();
  if (!v) return fail('Shop not found.', 404);
  if (v.activation_fee_paid) return NextResponse.json({ active: true });

  const origin = new URL(req.url).origin;
  const r = await ps('/transaction/initialize', {
    email: `owner+${v.id}@seepay.shop`, // Paystack needs an email; owners only give a phone number
    amount: 15000, currency: 'GHS', // GH₵ 150 in pesewas
    reference: `ACT_${v.id}_${Date.now()}`,
    callback_url: `${origin}/register/done?sub=${v.subdomain}`,
    metadata: { type: 'VENDOR_ACTIVATION', vendorId: v.id },
  });
  if (!r.status) return fail(r.message || 'Could not start payment.');
  return NextResponse.json({ url: r.data.authorization_url });
}
