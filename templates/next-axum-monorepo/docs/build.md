# Build And Test

## Local Commands

Run all commands from the repository root unless noted otherwise.

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

Run the Rust service directly when needed:

```bash
cd apps/axum
cargo run
```

## What Each Lane Covers

- `just lint`: `apps/web` lint, `packages/ui` layer checks, Rust layer check, `cargo fmt`, `clippy`, and `cargo udeps`
- `just typecheck`: Next.js typecheck plus `cargo check --all-targets`
- `just test`: Vitest plus `cargo nextest run`
- `just ux`: Playwright, axe, and Lighthouse for the Next.js app
- `just supply-chain`: gitleaks, osv-scanner, `pnpm audit`, `cargo deny`, and `cargo audit`

## CI

GitHub Actions uses four jobs in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- `fast`: installs toolchains, then runs `just lint` and `just typecheck`
- `test`: runs `just test`
- `ux`: installs browser dependencies, then runs `just ux`
- `supply-chain`: runs secrets and dependency scanning for both Node and Rust
