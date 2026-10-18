import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SeePay – Your shop, online by lunchtime', description: 'Get your own shop link, take orders and get paid by Mobile Money.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;700&family=Hanken+Grotesk:wght@400;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0B2E21" />
      </head>
      <body>{children}</body>
    </html>
  );
}
