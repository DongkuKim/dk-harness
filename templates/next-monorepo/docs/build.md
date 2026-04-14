# Build And Test

## Local Commands

Run all commands from the repository root.

```bash
just install
pnpm dev
just lint
just typecheck
just test
just ux
just supply-chain
just ci
```

## What Each Lane Covers

- `just lint`: `apps/web` lint plus dependency layer checks for `packages/ui`
- `just typecheck`: TypeScript checking for `apps/web`
- `just test`: Vitest for `apps/web`
- `just ux`: Playwright, axe, and Lighthouse for the Next.js app
- `just supply-chain`: gitleaks, osv-scanner, and `pnpm audit`

## CI

GitHub Actions uses four jobs in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- `fast`: install, `just lint`, `just typecheck`
- `test`: install, `just test`
- `ux`: install browser dependencies, `just ux`
- `supply-chain`: secrets and vulnerability scanning
