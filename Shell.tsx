import Link from 'next/link';

export const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seepay.shop';
export const NETS: [string, string, string][] = [['MTN', 'MTN', '#FFCC00'], ['VODAFONE', 'Vodafone', '#E60000'], ['AIRTELTIGO', 'AirtelTigo', '#0057b8']];
export const stagger = (i: number) => ({ '--i': i } as React.CSSProperties);

export const Mark = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#FFC83D" /><path d="M5 8h22v6H5z" fill="#fff" /><path d="M5 8h7.33v6H5zM19.67 8H27v6h-7.33z" fill="#E4402F" /><circle cx="8.67" cy="14" r="3.67" fill="#E4402F" /><circle cx="16" cy="14" r="3.67" fill="#fff" /><circle cx="23.33" cy="14" r="3.67" fill="#E4402F" /><path d="M10.5 23l3.8 3.4 7.2-6.2" fill="none" stroke="#0E3B2C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const Check = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav><div className="wrap">
        <Link className="logo" href="/" aria-label="SeePay home"><Mark />SeePay</Link>
        <div className="links"><a href="/#how">How it works</a><a href="/#pricing">Pricing</a><Link href="/agent">Agents</Link><Link className="btn g" href="/register">Get my shop</Link></div>
      </div></nav>
      <main className="stage"><div className="awning" aria-hidden="true" /><div className="wrap">{children}</div></main>
      <footer><div className="wrap">© 2026 SeePay. Made in Ghana.</div></footer>
    </>
  );
}
