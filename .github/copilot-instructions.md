# Everburn Interactive Copilot Instructions

This repository follows the Everburn Interactive PRD and implements a Next.js App Router website for static deployment on GitHub Pages.

## Non-negotiable constraints
- TypeScript strict mode is required.
- No `any` types.
- Keep WebGL canvas mounted across route transitions and pause via frameloop where needed.
- Use dynamic imports with `ssr: false` for components that rely on Three.js, R3F, or browser APIs.
- Preserve performance budgets and mobile limits from the PRD.
- Run `npm run build` after each implementation phase.
- Keep security tooling and dependency scanning passing in CI.

## Hosting constraints
- Target is GitHub Pages static export.
- Avoid server-only Next features in production paths.
- Preserve `CNAME` in deployment output.
