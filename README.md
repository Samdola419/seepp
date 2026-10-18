# SeePay website (static front-end, ready for Supabase integration)

## Files
- `index.html` — marketing homepage
- `register.html` — shop registration page (UI only; no fake saves)
- `agent.html` — agent information and registration page (UI only; no fake accounts or stats)
- `assets/seepay.css` — shared styling extracted from the supplied SeePay design
- `assets/app.js` — homepage interactions
- `vercel.json` — clean static deployment config

## Deploy on Vercel
This is a static HTML website. Put the *contents of this folder* in the root of a GitHub repository, then import that repository into Vercel. Use Framework Preset `Other`, leave the Build Command empty, and set the Output Directory to `.` if Vercel asks for one. Do not upload the ZIP as if it were a source folder.

## Current state
No form submits data, no browser demo records are created, and no fake agent accounts or commission totals are shown. Registration buttons are disabled until the Supabase database and secure backend are connected.

## Next step
Connect Supabase Auth and PostgreSQL through secure server-side endpoints before enabling registration. Never put a Supabase service-role key in browser code.
