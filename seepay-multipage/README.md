# SeePay multi-page prototype

This folder keeps the original SeePay landing page as `index.html`, with shop registration and the agent portal on their own pages. All three pages use the same stylesheet and brand system.

## Files
- `index.html` — original SeePay marketing page, with buttons linking to the dedicated pages.
- `register.html` — separate shop registration page.
- `agent.html` — separate agent portal and demo dashboard.
- `assets/seepay.css` — shared original design system and multi-page refinements.
- `assets/app.js` — demo form interactions and local browser storage.

## Preview
For a quick check, open `index.html` in a browser. Some browsers isolate `file://` storage by page, so for the best cross-page demo experience run a local static server (for example VS Code Live Server) or deploy the folder to a web host.

## Important
This is a front-end prototype. Registration and agent profiles are demo-only, not secure accounts. It does not create live subdomains, save to Supabase, accept setup payments, or verify commissions. Those require a deployed backend.

## Deploying
These are static HTML files and can be deployed as a static site on Vercel. Keep `index.html` at the project root and include the entire `assets` folder.
