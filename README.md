# HypeSeek_Core

HypeSeek — Trade culture before charts.

This repository currently contains the **Next.js** marketing site / landing page for HypeSeek (App Router + Tailwind + Framer Motion).

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Env

Copy `.env.example` → `.env.local` and fill in values as needed.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

(Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.)
