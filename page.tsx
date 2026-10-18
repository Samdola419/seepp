'use client';
import { useEffect, useState } from 'react';
import Shell, { NETS, ROOT, stagger } from '../components/Shell';

type Shop = { business_name: string; subdomain: string; is_active: boolean };
type Dash = { name: string; code: string; balance: number; shops: Shop[] };

function useCount(to: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now(); let raf = 0;
    const f = (t: number) => { const k = Math.min(1, (t - t0) / 900); setN(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [to]);
  return n;
}

const post = (url: string, body: object) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ ok: r.ok, ...(await r.json()) }));

function Dashboard({ d, onExit }: { d: Dash; onExit: () => void }) {
  const bal = useCount(d.balance);
  const [copied, setCopied] = useState(false);
  const proto = ROOT.startsWith('localhost') ? 'http' : 'https';
  const link = `${proto}://${ROOT}/register?ref=${d.code}`;
  return (
    <div className="cols">
      <div className="side seq">
        <h1 style={stagger(0)}>Hi {d.name.split(' ')[0]}.</h1>
        <p className="sub" style={stagger(1)}>GH₵ 50 lands in your balance when a shop you brought in pays its setup fee.</p>
        <div className="ticket" style={{ ...stagger(2), marginTop: '1.6rem' }}>
          <div className="bal"><small>Your balance</small>GH₵ {bal}</div>
          <div className="code">{link}</div>
          <div className="row">
            <button className="btn" onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? <span className="pop">Copied</span> : 'Copy link'}</button>
            <a className="btn w" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`Get your shop online with SeePay. Register here: ${link}`)}`}>Share on WhatsApp</a>
          </div>
          <small>Your code: <b>{d.code}</b></small>
        </div>
      </div>
      <div className="card seq">
        <h2 style={stagger(0)}>Shops you referred</h2>
        {d.shops.length === 0
          ? <p className="muted" style={stagger(1)}>No shops yet. Share your link with a shop owner to get started.</p>
          : <ul className="list">{d.shops.map((s, i) => (
              <li key={s.subdomain} style={stagger(i)}><div><b>{s.business_name}</b><span>{s.subdomain}.{ROOT}</span></div>
                <span className={`bd ${s.is_active ? 'ok' : ''}`}>{s.is_active ? 'Live · +GH₵ 50' : 'Waiting for payment'}</span></li>))}</ul>}
        <button className="btn w" onClick={onExit}>Sign out</button>
      </div>
    </div>
  );
}

export default function Agent() {
  const [mode, setMode] = useState<'join' | 'open'>('join');
  const [f, setF] = useState({ name: '', net: '', momo: '', code: '' });
  const [dash, setDash] = useState<Dash | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  async function load(code: string, momo: string) {
    const r = await post('/api/agents/dashboard', { code, momoNumber: momo });
    if (!r.ok) throw new Error(r.error);
    sessionStorage.setItem('sp-agent', JSON.stringify({ code, momo })); setDash(r);
  }
  useEffect(() => { try { const s = JSON.parse(sessionStorage.getItem('sp-agent') || 'null'); if (s) load(s.code, s.momo).catch(() => {}); } catch {} }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (mode === 'join') {
        const r = await post('/api/agents/register', { fullName: f.name, momoNumber: f.momo, momoNetwork: f.net });
        if (!r.ok) throw new Error(r.error);
        await load(r.code, f.momo);
      } else await load(f.code, f.momo);
    } catch (x: any) { setErr(x.message || 'Something went wrong. Try again.'); }
    setBusy(false);
  }

  return (
    <Shell>
      {dash ? <Dashboard d={dash} onExit={() => { sessionStorage.removeItem('sp-agent'); setDash(null); }} /> : (
        <div className="cols">
          <div className="side seq">
            <h1 style={stagger(0)}>Know a shop that needs a website? Get paid.</h1>
            <p className="sub" style={stagger(1)}>Get your referral code. When a shop you brought in pays its setup fee, GH₵ 50 is added to your balance.</p>
          </div>
          <form className="card seq" onSubmit={submit} noValidate>
            <div className="tabs" style={stagger(0)} role="tablist">
              <button type="button" role="tab" aria-selected={mode === 'join'} className={mode === 'join' ? 'on' : ''} onClick={() => { setMode('join'); setErr(''); }}>Become an agent</button>
              <button type="button" role="tab" aria-selected={mode === 'open'} className={mode === 'open' ? 'on' : ''} onClick={() => { setMode('open'); setErr(''); }}>Open my dashboard</button>
            </div>
            {mode === 'join' ? <>
              <div className="fld" style={stagger(1)}><label htmlFor="a">Full name</label><input id="a" className="in" required value={f.name} onChange={e => set('name', e.target.value)} placeholder="Ama Mensah" /></div>
              <div className="fld" style={stagger(2)}><span className="lab">MoMo network</span>
                <div className="pills" role="radiogroup" aria-label="MoMo network">{NETS.map(([v, l, c]) => <span key={v} style={{ display: 'contents' }}><input type="radio" name="net" id={`a-${v}`} checked={f.net === v} onChange={() => set('net', v)} /><label htmlFor={`a-${v}`} style={{ ['--c' as any]: c }}>{l}</label></span>)}</div></div>
            </> : <div className="fld" style={stagger(1)}><label htmlFor="c">Referral code</label><input id="c" className="in" autoCapitalize="characters" required value={f.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="AMA123" /></div>}
            <div className="fld" style={stagger(3)}><label htmlFor="mm">MoMo number</label><input id="mm" className="in" type="tel" inputMode="tel" required value={f.momo} onChange={e => set('momo', e.target.value)} placeholder="024 123 4567" /><small>{mode === 'join' ? 'Your earnings are paid here.' : 'The number you signed up with.'}</small></div>
            {err && <div className="err" role="alert">{err}</div>}
            <button className="btn g" style={stagger(4)} disabled={busy}>{busy ? <><i className="spin" />One moment</> : mode === 'join' ? 'Get my referral code' : 'Open dashboard'}</button>
          </form>
        </div>
      )}
    </Shell>
  );
}
