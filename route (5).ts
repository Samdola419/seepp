import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!).update(raw).digest('hex');
  if (sig !== req.headers.get('x-paystack-signature')) return new NextResponse('bad signature', { status: 401 });

  const body = JSON.parse(raw);
  if (body.event !== 'charge.success') return NextResponse.json({ received: true });
  const { reference, amount, metadata } = body.data;

  if (metadata?.type === 'VENDOR_ACTIVATION' && amount >= 15000) {
    // Only the first successful webhook flips the flag, so retries never double-pay the agent.
    const { data: v } = await db.from('vendors')
      .update({ is_active: true, activation_fee_paid: true })
      .eq('id', metadata.vendorId).eq('activation_fee_paid', false)
      .select('agent_id').maybeSingle();
    if (v?.agent_id) await db.rpc('credit_agent', { p_agent: v.agent_id, p_amount: 50 });
  } else {
    await db.from('orders').update({ payment_status: 'SUCCESS' }).eq('paystack_reference', reference);
  }
  return NextResponse.json({ received: true });
}
