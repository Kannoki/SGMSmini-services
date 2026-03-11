## Host App (Micro Frontend Shell)

This Next.js app acts as the shell host for the micro frontend demo. It provides:

- A shared navigation bar that links to the three micro apps: `Portfolio`, `Product`, and `Contact`
- A root `/` route that redirects to `/portfolio`
- Reverse proxy rules (via `rewrites`) to delegate each section to the corresponding micro app

### Development

Run this app on port `3000`:

```bash
npm install
npm run dev -- --port 3000
```

