import { notFound } from 'next/navigation';
import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Store({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = await params;
  const { data: v } = await db.from('vendors').select('id, business_name, is_active').eq('subdomain', sub).maybeSingle();
  if (!v) notFound();
  const { data: items } = v.is_active ? await db.from('products').select('id, name, description, price').eq('vendor_id', v.id).eq('is_available', true) : { data: [] };
  return (
    <main className="store">
      <h1>{v.business_name}</h1>
      {!v.is_active && <p className="muted">This shop is opening soon.</p>}
      {v.is_active && !items?.length && <p className="muted">No products yet. Check back soon.</p>}
      <ul className="plist">{items?.map(p => <li key={p.id}><div><b>{p.name}</b><span>{p.description}</span></div><em>GH₵ {Number(p.price).toFixed(2)}</em></li>)}</ul>
    </main>
  );
}
