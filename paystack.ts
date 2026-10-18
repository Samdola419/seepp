export async function ps(path: string, body: unknown) {
  const r = await fetch(`https://api.paystack.co${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}
