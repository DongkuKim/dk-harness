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

Run the API directly when needed:

```bash
pnpm --filter api dev
```

## What Each Lane Covers

- `just lint`: `apps/web` lint, `packages/ui` layer checks, and FastAPI lint/import-layer checks
- `just typecheck`: Next.js typecheck plus `basedpyright`
- `just test`: Vitest plus `pytest`
- `just ux`: Playwright, axe, and Lighthouse for the Next.js app
- `just supply-chain`: gitleaks, osv-scanner, `pnpm audit`, and `pip-audit`

## CI

GitHub Actions uses four jobs in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- `fast`: installs Node, Python, and uv, then runs `just lint` and `just typecheck`
- `test`: installs dependencies, then runs `just test`
- `ux`: installs browser dependencies, then runs `just ux`
- `supply-chain`: runs secrets and dependency scanning for both Node and Python
