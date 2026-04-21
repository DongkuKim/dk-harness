# Architecture

## Repository Shape

- `apps/next-api`: a Next.js API backend service
- `apps/web`: the main Next.js application
- `packages/ui`: the shared UI package used by runnable apps
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

## Web App Layers

`apps/web` uses `dependency-cruiser` to enforce:

- `app`
- `components`
- `hooks`
- `lib`

The important constraints are:

- `components` must not import `app`
- `hooks` may only import `lib`
- `lib` stays leaf-like

## Shared UI Domain Stack

`packages/ui` follows the business-domain stack:

- `Types`
- `Config`
- `Repo`
- `Service`
- `Runtime`
- `UI`

Cross-cutting concerns must enter through:

- `src/providers`

Provider-only support code lives in:

- `src/utils`

The stack is mechanically enforced by `packages/ui/dependency-cruiser.cjs`.

## Next.js API Service Layers

Each Next.js API service uses a directional backend split enforced by `dependency-cruiser`:

- `app/api`
- `src/core`
- `src/domain`

Lower layers must not import higher ones.
- applies to `apps/next-api`
