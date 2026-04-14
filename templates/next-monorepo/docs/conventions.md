# Conventions

## UI Work

- Prefer changes in `apps/web` unless the change is clearly shared
- Treat `packages/ui` as generated shared UI
- Add primitives with `pnpm dlx shadcn@latest add <component> -c apps/web`
- Put shared rendering components in `packages/ui/src/ui`
- Put runtime helpers in `packages/ui/src/runtime`
- Put auth, connectors, telemetry, and feature-flag adapters in `packages/ui/src/providers`
- Keep low-level helpers for providers in `packages/ui/src/utils`

## Imports

- Prefer package boundaries over deep cross-package relative imports
- Keep app code aligned with the layer rules in `docs/architecture.md`
- Prefer `@workspace/ui/ui/*` for shared UI imports and `@workspace/ui/runtime/*` for shared runtime helpers
- Do not route cross-cutting concerns through runtime or repo code; use `@workspace/ui/providers/*`

## Verification Habit

- During iteration, run the smallest relevant lane
- Before handing work off, rerun every lane touched by the change
