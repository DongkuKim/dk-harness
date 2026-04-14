# Architecture

## Repository Shape

- `apps/web`: main Next.js app
- `packages/ui`: shared UI package used by the app
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

## Frontend Layers

`apps/web` enforces directional imports through `dependency-cruiser`:

- `app` can import `components`, `hooks`, and `lib`
- `components` must not import `app`
- `hooks` may only import `lib`
- `lib` stays leaf-like and must not import higher layers

The rules live in [`apps/web/dependency-cruiser.cjs`](../apps/web/dependency-cruiser.cjs).

## Shared UI Layers

`packages/ui` also has an internal dependency check:

- `src/types` is the lowest layer
- `src/config` may depend on `src/types`
- `src/repo` may depend on `src/config` and `src/types`
- `src/service` may depend on `src/repo`, `src/config`, `src/types`, and `src/providers`
- `src/runtime` may depend on `src/service`, `src/repo`, `src/config`, and `src/types`
- `src/ui` is the top layer and may depend on lower layers plus `src/providers`
- `src/providers` is the only explicit cross-cutting boundary
- `src/utils` is outside the domain stack and exists only to support `src/providers`

In short, the business-domain chain is:

- `Types -> Config -> Repo -> Service -> Runtime -> UI`

Everything cross-cutting enters through:

- `Providers`

The rules live in [`packages/ui/dependency-cruiser.cjs`](../packages/ui/dependency-cruiser.cjs).
