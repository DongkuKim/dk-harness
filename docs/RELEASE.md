# Release

The release flow is intentionally small and explicit.

## Source Of Truth

- `package.json` defines the published package name, binary, and release script.
- `bin/dk-harness` is the CLI that gets published.
- `templates/` and `templates/registry.json` are copied into the npm tarball.

## Release Check

- `npm run release:check` runs `scripts/release-pack-check.mjs`.
- The script packs the npm tarball, inspects required entries, and smoke-tests the installed CLI.
- The smoke test verifies `dk-harness list` and scaffolds every template from the packed tarball.
- `npm run repo:self-check` wraps the release check with Python CLI compilation and a direct local `dk-harness list` call.

## Scaffold Evaluation

- `.github/workflows/scaffold-eval.yml` exercises the packaged CLI on every PR and push to `main`.
- Each job scaffolds a fresh repo from the packed tarball, then runs the generated repo's own `just lint`, `just typecheck`, and `just test` commands.
- When scaffold evaluation fails, the logs point at the generated repo path rather than only at the source template tree.

## Release Expectations

- Template edits should not break the package layout.
- A template that cannot be listed or scaffolded is a release-blocking regression.
- If the tarball shape changes, update the release check and the docs together.
- `.github/workflows/repo-ci.yml` runs `repo / self-check` so release-confidence checks are visible separately from template matrix results.
