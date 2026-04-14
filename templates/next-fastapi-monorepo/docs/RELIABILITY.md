# Reliability

## Local Commands

Run from the repository root:

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

## Lane Responsibilities

- `just lint`: web lint, shared UI layer checks, Ruff, deptry, and import-linter
- `just knowledge-base`: knowledge-base structure, links, plan artifacts, and generated doc checks
- `just typecheck`: Next.js typecheck plus `basedpyright`
- `just test`: Vitest plus `pytest`
- `just ux`: Playwright, axe, and Lighthouse for the web app
- `just supply-chain`: gitleaks, osv-scanner, `pnpm audit`, and `pip-audit`

## CI

GitHub Actions includes a dedicated `knowledge-base` job in addition to the build and test lanes.

## Doc Gardening

A scheduled doc-gardening workflow refreshes generated knowledge-base artifacts and opens a pull request when the repository documentation needs mechanical cleanup.
