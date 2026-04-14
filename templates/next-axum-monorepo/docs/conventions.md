# Conventions

## UI Work

- Prefer app-specific work in `apps/web`
- Put shared primitives in `packages/ui`
- Add UI primitives with `pnpm dlx shadcn@latest add <component> -c apps/web`
- Put shared components in `packages/ui/src/ui`
- Put shared runtime helpers in `packages/ui/src/runtime`
- Keep `packages/ui` aligned with `types -> config -> repo -> service -> runtime -> ui`
- Put auth, connectors, telemetry, and feature-flag adapters in `packages/ui/src/providers`
- Keep provider-only helpers in `packages/ui/src/utils`

## Rust Work

- Keep `apps/axum/src/main.rs` focused on bootstrapping
- Add HTTP handlers and routers under `apps/axum/src/api`
- Put pure logic and return values under `apps/axum/src/domain`
- Keep configuration and wiring under `apps/axum/src/core`

## Verification Habit

- Run the smallest relevant lane while iterating
- Rerun all affected lanes before handoff
