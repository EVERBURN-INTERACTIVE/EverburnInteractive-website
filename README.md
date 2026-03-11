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

## Security baseline

- Dependency versions are pinned exactly in `package.json`.
- CI runs `npm audit --audit-level=high` before deployment.
- Dependabot is enabled for weekly npm security updates.

## Deployment

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml` and publishes the `out/` folder to GitHub Pages.

The `CNAME` file is preserved automatically during CI deployment.
