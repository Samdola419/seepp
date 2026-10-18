import { NextResponse } from 'next/server';
export const RESERVED = new Set(['www','app','api','admin','agent','register','dashboard','mail','support','store','seepay','help','login']);
export const subOk = (s: string) => /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(s) && !RESERVED.has(s);
// Paystack Ghana mobile money codes. Confirm with: GET https://api.paystack.co/bank?currency=GHS&type=mobile_money
export const BANK: Record<string, string> = { MTN: 'MTN', VODAFONE: 'VOD', AIRTELTIGO: 'ATL' };
export function phone(v: unknown) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('233')) d = '0' + d.slice(3);
  return /^0\d{9}$/.test(d) ? d : null;
}
export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
