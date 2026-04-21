# Next.js + Next.js API Monorepo Scaffold

This scaffold ships a README-aligned harness for `apps/web`, `apps/next-api`.

The scaffold root `mise.toml` is the source of truth for the local toolchain; run `mise install` before `just install` if you are not already inside a mise-managed shell.

## Harness Commands

Run all top-level checks from the scaffold root:

```bash
just install
just lint
just typecheck
just test
just ux
just supply-chain
just ci
```

`packages/ui` is still generated and updated through `shadcn` commands, but its internal layer boundaries are checked as part of the harness.

## What Each Lane Covers

- `just lint`: Biome, dependency-cruiser, and knip for `apps/web`; dependency-cruiser layer checks for `packages/ui`; Biome, dependency-cruiser, and knip for `apps/next-api`
- `just typecheck`: `tsc --noEmit` for `apps/web`; `tsc --noEmit` for `apps/next-api`
- `just test`: Vitest smoke coverage for `apps/web`; Vitest route coverage for `apps/next-api`
- `just ux`: Playwright, axe, and Lighthouse against the running Next.js app
- `just supply-chain`: gitleaks, osv-scanner, and `pnpm audit`

## Apps

- `apps/web`: Next.js app
- `apps/next-api`: Next.js API backend service

## Adding Components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places generated UI components in `packages/ui/src/ui`.

## Using Components

Import shared components from the `ui` package.

```tsx
import { Button } from "@workspace/ui/ui/button"
```

## Running The Next.js API Backends

Start `apps/next-api` from the monorepo root:

```bash
pnpm --filter next-api dev
```

Or run it directly from the app directory:

```bash
cd apps/next-api
pnpm dev
```

Swagger UI is available at `/swagger`, and the raw OpenAPI document is served from `/openapi.json` on the app's configured port.
