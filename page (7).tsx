'use client';
import { useEffect, useState } from 'react';
import Shell, { Check, ROOT } from '../../components/Shell';

export default function Done() {
  const [sub, setSub] = useState('');
  const [live, setLive] = useState(false);
  const [late, setLate] = useState(false);

  useEffect(() => {
    const s = new URLSearchParams(location.search).get('sub') || '';
    setSub(s); if (!s) return;
    const t0 = Date.now();
    const id = setInterval(async () => {
      const r = await fetch(`/api/vendors/check?subdomain=${s}`).then(r => r.json()).catch(() => null);
      if (r?.active) { setLive(true); clearInterval(id); }
      else if (Date.now() - t0 > 60000) { setLate(true); clearInterval(id); }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const proto = ROOT.startsWith('localhost') ? 'http' : 'https';
  return (
    <Shell>
      <div className="card done" style={{ maxWidth: 520, margin: '0 auto' }} aria-live="polite">
        {live ? <>
          <div className="ring"><Check /></div>
          <h2>Your shop is live.</h2>
          <div className="code">{sub}.{ROOT}</div>
          <a className="btn g" href={`${proto}://${sub}.${ROOT}`}>Open my shop</a>
        </> : late ? <>
          <h2>Still confirming your payment.</h2>
          <p className="muted">If you paid, your shop will go live in a few minutes. Refresh this page to check again.</p>
        </> : <>
          <i className="spin" style={{ width: 40, height: 40 }} />
          <h2>Confirming your payment</h2>
          <p className="muted">This takes a few seconds.</p>
        </>}
      </div>
    </Shell>
  );
}
