# Reliability

## Local Commands

Run from the repository root. The committed `mise.toml` pins the local toolchain, so `mise install` should come first on a fresh machine:

```bash
mise install
just install
pnpm dev
just lint
just typecheck
just test
just ux
just supply-chain
just ci
```

Run a Next.js API app directly when needed:

```bash
pnpm --filter next-api dev
```

## Lane Responsibilities

- `just lint`: Biome, dependency-cruiser, and knip for `apps/web`; dependency-cruiser layer checks for `packages/ui`; Biome, dependency-cruiser, and knip for `apps/next-api`
- `just typecheck`: `tsc --noEmit` for `apps/web`; `tsc --noEmit` for `apps/next-api`
- `just test`: Vitest smoke coverage for `apps/web`; Vitest route coverage for `apps/next-api`
- `just ux`: Playwright, axe, and Lighthouse against the running Next.js app
- `just supply-chain`: gitleaks, osv-scanner, and `pnpm audit`

## CI

GitHub Actions uses the generated lanes defined in `.github/workflows/ci.yml`.

## Doc Gardening

Doc gardening is a repeated manual task tracked in `docs/exec-plans/repeated-work.md`.
