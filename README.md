# Everburn Interactive Website

This repository hosts the Everburn Interactive website implementation using Next.js App Router with static export for GitHub Pages.

## Stack

- Next.js 16
- React 19
- TypeScript 5 (strict)
- Three.js + React Three Fiber + Drei
- GSAP
- Tailwind CSS 4

## Local development

1. Install dependencies:

```bash
npm ci
```

2. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000 and edit files in `src/`. Changes hot-reload automatically.

3. Run quality checks before committing:

```bash
npm run lint
npm run build
```

4. Preview the exact static output (same format GitHub Pages uses):

```bash
npm run build
npx serve out -l 4173
```

Then open http://localhost:4173.

The static output is generated in `out/`.

## Supabase auth setup

This site uses Supabase Auth with Google OAuth and a browser publishable key so the repository can stay public.

1. Create a Supabase project.
2. In Supabase, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. This creates the `profiles` table and RLS policies.
3. In Google Cloud Console, create an OAuth Client ID for a web app. In **Authorized redirect URIs**, paste the Supabase callback URL from your Supabase Google provider page. It looks like:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. In Supabase, open **Authentication > Sign In / Providers > Google**, enable Google, then paste the Google **Client ID** and **Client Secret** there.
5. In Supabase, open **Authentication > URL Configuration**. Set **Site URL** to your live site, not localhost:

```text
https://everburninteractive.com
```

If **Site URL** is still `http://localhost:3000`, Google sign-in will always send users back to localhost after auth, even on the live site.

6. In the same Supabase URL Configuration page, add these **Redirect URLs**:

```text
http://localhost:3000/**
https://everburninteractive.com/**
https://everburninteractive.com/auth/callback/
```

The live site signs users in through `/auth/callback/`, so that URL must be allowlisted in Supabase.

7. For local development, create `.env.local` from `.env.example` and paste the public Supabase values from **Supabase > Project Settings > API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

After editing `.env.local`, restart `npm run dev`.

8. For GitHub Pages deployment, add the same public values in **GitHub repository > Settings > Secrets and variables > Actions**.

Recommended: create these repository **Variables**:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` should be `https://everburninteractive.com` for production deploys. CI falls back to that value if the variable is missing.

Supported alternative: create one `DBVARS` entry (repository **Variable** or **Secret**) and paste the same `.env.local` contents into it. Names are case-sensitive:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

CI verifies both keys exist before `npm run build`. A failed deploy log usually means `DBVARS` used the wrong key names (for example `next_public_Supabaseurl` instead of `NEXT_PUBLIC_SUPABASE_URL`).

Never commit Supabase service-role keys, Google OAuth client secrets, or any other private credentials.

## Security baseline

- Dependency versions are pinned exactly in `package.json`.
- CI runs `npm audit --audit-level=high` before deployment.
- Dependabot is enabled for weekly npm security updates.
- Supabase user data is protected by Row Level Security policies in `supabase/schema.sql`.

## Deployment

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml` and publishes the `out/` folder to GitHub Pages.

The `CNAME` file is preserved automatically during CI deployment.
