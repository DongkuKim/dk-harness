# Architecture

## Repository Shape

- `packages/ui-kit`: a publishable Next.js UI kit package
- `packages/ui`: the shared UI package used by runnable apps
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

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

## Publishable UI Kit Packages

Each `package-nextjs` module emits a package under `packages/<id>` with:

- `src/ui` for exported rendering primitives
- `src/runtime` for framework-safe helpers
- `src/providers` for explicit client providers
- `src/styles/globals.css` for Tailwind v4 and shadcn tokens

These packages are designed to publish from their package directory after the package name is changed to an owned registry scope.
- applies to `packages/ui-kit`

## No Backend By Default

This scaffold does not include a separate API server or database by default.
