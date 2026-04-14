# Architecture

## Repository Shape

- `apps/web`: main Next.js app
- `apps/api`: FastAPI backend service
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

## FastAPI Layers

The API package uses import-linter to keep the following layers directional:

- `app.api`
- `app.core`
- `app.domain`

Allowed direction is top to bottom only.
That means `app.domain` must not import `app.core` or `app.api`, and `app.core` must not import `app.api`.

The contract is declared in [`apps/api/pyproject.toml`](../apps/api/pyproject.toml).
