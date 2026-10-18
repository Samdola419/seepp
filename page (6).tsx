'use client';
import { useEffect, useState } from 'react';
import Shell, { Check, NETS, ROOT, stagger } from '../components/Shell';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 30);
type Status = 'idle' | 'checking' | 'ok' | 'taken' | 'bad';

export default function Register() {
  const [f, setF] = useState({ name: '', sub: '', wa: '', net: '', momo: '', ref: '' });
  const [edited, setEdited] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  useEffect(() => { const r = new URLSearchParams(location.search).get('ref'); if (r) set('ref', r.toUpperCase()); }, []);

  useEffect(() => {
    if (!f.sub) return setStatus('idle');
    setStatus('checking');
    const t = setTimeout(async () => {
      const r = await fetch(`/api/vendors/check?subdomain=${encodeURIComponent(f.sub)}`).then(r => r.json()).catch(() => null);
      setStatus(!r ? 'idle' : !r.valid ? 'bad' : r.available ? 'ok' : 'taken');
    }, 350);
    return () => clearTimeout(t);
  }, [f.sub]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const post = (url: string, body: object) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ ok: r.ok, ...(await r.json()) }));
      const reg = await post('/api/vendors/register', { businessName: f.name, subdomain: f.sub, whatsappNumber: f.wa, ownerMomoNumber: f.momo, ownerMomoNetwork: f.net, referralCode: f.ref });
      if (!reg.ok) throw new Error(reg.error);
      const act = await post('/api/vendors/activate', { vendorId: reg.vendorId });
      if (!act.ok) throw new Error(act.error);
      location.href = act.url;
    } catch (x: any) { setErr(x.message || 'Something went wrong. Try again.'); setBusy(false); }
  }

  const msg = { idle: '', checking: 'Checking…', ok: 'Available', taken: 'Taken. Try another name.', bad: 'Use 3 to 30 letters, numbers or hyphens.' }[status];

  return (
    <Shell>
      <div className="cols">
        <div className="side seq">
          <h1 style={stagger(0)}>Pick a name. Get a shop.</h1>
          <p className="sub" style={stagger(1)}>Your shop is live as soon as the setup fee clears.</p>
          <div className="sign" style={stagger(2)}><u key={f.sub} className="pop">{f.sub || 'yourshop'}</u>.{ROOT}</div>
          <ul className="facts" style={stagger(3)}>
            <li><Check />GH₵ 150 one-time setup</li><li><Check />No monthly fee</li><li><Check />Paid to your MoMo number</li>
          </ul>
        </div>
        <form className="card seq" onSubmit={submit} noValidate>
          <h2 style={stagger(0)}>Register your shop</h2>
          <div className="fld" style={stagger(1)}><label htmlFor="n">Business name</label>
            <input id="n" className="in" required maxLength={60} placeholder="Mama Jollof" value={f.name} onChange={e => { set('name', e.target.value); if (!edited) set('sub', slug(e.target.value)); }} /></div>
          <div className="fld" style={stagger(2)}><label htmlFor="s">Shop link</label>
            <div className="suf"><input id="s" className="in" required placeholder="mamajollof" autoCapitalize="none" value={f.sub} onChange={e => { setEdited(true); set('sub', slug(e.target.value)); }} /><span>.{ROOT}</span></div>
            <div className={`st ${status === 'ok' ? 'ok' : status === 'taken' || status === 'bad' ? 'no' : ''}`} aria-live="polite">{status === 'checking' && <i className="spin" />}{status === 'ok' && <Check className="i" />}{msg}</div></div>
          <div className="fld" style={stagger(3)}><label htmlFor="w">WhatsApp number</label>
            <input id="w" className="in" type="tel" inputMode="tel" required placeholder="024 123 4567" value={f.wa} onChange={e => set('wa', e.target.value)} />
            <small>Customers will message you here.</small></div>
          <div className="fld" style={stagger(4)}><span className="lab">MoMo network</span>
            <div className="pills" role="radiogroup" aria-label="MoMo network">
              {NETS.map(([v, l, c]) => <span key={v} style={{ display: 'contents', ['--c' as any]: c }}><input type="radio" name="net" id={`n-${v}`} checked={f.net === v} onChange={() => set('net', v)} /><label htmlFor={`n-${v}`} style={{ ['--c' as any]: c }}>{l}</label></span>)}
            </div></div>
          <div className="fld" style={stagger(5)}><label htmlFor="m">MoMo number</label>
            <input id="m" className="in" type="tel" inputMode="tel" required placeholder="024 123 4567" value={f.momo} onChange={e => set('momo', e.target.value)} />
            <small>Your order money goes here.</small></div>
          <div className="fld" style={stagger(6)}><label htmlFor="r">Agent referral code (optional)</label>
            <input id="r" className="in" placeholder="AGENT01" autoCapitalize="characters" value={f.ref} onChange={e => set('ref', e.target.value.toUpperCase())} /></div>
          {err && <div className="err" role="alert">{err}</div>}
          <button className="btn g" style={stagger(7)} disabled={busy || status === 'taken' || status === 'bad'}>{busy ? <><i className="spin" />Setting up</> : 'Register and pay GH₵ 150'}</button>
          <p className="fine" style={stagger(8)}>You will pay on Paystack with Mobile Money. Your shop goes live right after.</p>
        </form>
      </div>
    </Shell>
  );
}
