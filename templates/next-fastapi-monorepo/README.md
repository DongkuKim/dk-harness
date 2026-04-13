# Next.js + FastAPI monorepo template

This is a Next.js monorepo template with a FastAPI app managed by `uv`.

## Apps

- `apps/web`: Next.js app
- `apps/api`: FastAPI app

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Running the backend

Start the FastAPI app from the monorepo root:

```bash
pnpm --filter api dev
```

Or run it directly from the Python app:

```bash
cd apps/api
uv run fastapi dev app/main.py
```
