# Architecture

## Repository Shape

- `apps/web`: main Next.js app
- `apps/axum`: Rust backend service
- `packages/ui`: shared UI package
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

## Frontend Layers

`apps/web` enforces:

- `app -> components -> hooks -> lib`
- `components` must not import `app`
- `hooks` may depend only on `lib`
- `lib` stays leaf-like

`packages/ui` uses its own directional stack:

- `src/types`
- `src/config`
- `src/repo`
- `src/service`
- `src/runtime`
- `src/ui`

Imports may only flow from right to left across that list.

Cross-cutting concerns are not allowed to jump into the stack directly.
They must enter through:

- `src/providers`

Provider helpers live in:

- `src/utils`

`src/providers` may support `src/service` and `src/ui`, but lower domain layers may not bypass the stack.

## Rust Layers

The Axum service is split into three layers:

- `api`: HTTP routing and handlers
- `core`: configuration and service wiring
- `domain`: business-level values and pure logic

Allowed direction is `api -> core -> domain`.
Lower layers must not import higher ones.

The exported entrypoints are declared in [`apps/axum/src/lib.rs`](../apps/axum/src/lib.rs).
The lightweight enforcement script lives in [`scripts/check-rust-layers.mjs`](../scripts/check-rust-layers.mjs).
