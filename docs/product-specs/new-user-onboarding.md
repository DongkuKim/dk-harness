# New User Onboarding

## Goal

A new user should be able to discover the supported starters, scaffold the right one with a single command, and trust that the generated repo matches the committed template catalog.

## Primary User

- an agent or developer who wants a supported starter instead of assembling a harness from scratch
- someone choosing between a web-only Next.js repo and full-stack Next.js plus Python or Rust repos
- someone who wants the same template flow to work from the local repo and from the published npm package

## Current Product Surface

The current product is a small template catalog plus a scaffold CLI:

- `dk-harness list` prints every supported template with its description, stack, runtime, lane, local template path, and standalone repo target
- `dk-harness new <template> [destination]` copies the selected template into a new directory
- `dk-harness <template> [destination]` is shorthand for `new`
- `dk-harness export <template> <destination>` copies a template for syncing a standalone downstream repo

The source of truth for what users can scaffold is [`templates/registry.json`](../../templates/registry.json), and the CLI copies directly from [`templates/`](../../templates/).

## Happy Path

1. The user runs `dk-harness list` and sees the three supported starters:
   - `next-monorepo`
   - `next-fastapi-monorepo`
   - `next-axum-monorepo`
2. The user chooses a template based on stack, runtime, and lane metadata shown in the list output.
3. The user scaffolds a repo with one command:
   - local repo: `./bin/dk-harness new next-monorepo my-app`
   - npm package: `npm exec --package . -- dk-harness new next-monorepo my-app`
   - published package: `npx dk-harness@latest next-monorepo my-app`
4. The CLI copies the template directory into the destination and optionally initializes git with `--init-git`.
5. The generated repo contains the committed template files, including its own workflow and `just` command surface.

## Current Implementation Details

- Template selection is non-interactive. Users must choose one of the registry names exactly.
- If no destination is provided for `new`, the destination defaults to the template name.
- The CLI refuses to write into a non-empty directory unless `--force` is provided.
- Copying ignores generated and machine-local directories such as `.git`, `node_modules`, `.next`, `.venv`, `dist`, and `target`.
- Unknown template names fail with an error that lists the known template names.
- Registry entries are validated before commands run, including required fields and allowed metadata values.

## Trust And Verification

The onboarding experience is backed by repo-level checks rather than by narrative alone:

- `npm run repo:self-check` compiles the Python CLI, runs `./bin/dk-harness list`, and then runs the release packaging verification
- `npm run release:check` packs the npm tarball, verifies required package contents, runs the packaged CLI, and scaffolds every registered template
- `npm run scaffold:eval` scaffolds a fresh repo from the packed tarball and runs the generated repo's own `just lint`, `just typecheck`, and `just test` commands

## Non-Goals In The Current Implementation

- no interactive template wizard
- no post-scaffold questionnaire or setup assistant
- no template parameterization beyond destination, `--force`, and `--init-git`
- no generated customization layer separate from the committed template contents
