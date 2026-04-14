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

## API Work

- Keep route handlers in `app.api`
- Keep configuration in `app.core`
- Keep domain logic in `app.domain`
- Prefer moving reusable logic out of route files quickly

## Verification Habit

- Run the smallest relevant lane while iterating
- Rerun all affected lanes before handoff
