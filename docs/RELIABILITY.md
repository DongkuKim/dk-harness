# Reliability

This repo treats reliability as a small, explicit command surface that stays aligned across local runs, GitHub Actions, and the packed npm artifact.

## Local Command Surface

Run from the repository root unless noted otherwise. The committed [`.mise.toml`](../.mise.toml) is the source of truth for the pinned Node, pnpm, and Python toolchain:

```bash
mise install
just self-check
just supply-chain
just ci
npm run docs:check
npm run release:check
```

- `just self-check`: runs `npm run repo:self-check` to compile the Python CLI, verify a direct local `dk-harness list`, and run the packed release smoke test.
- `just supply-chain`: runs `npm run repo:supply-chain` for gitleaks, osv-scanner, and the root `npm audit`.
- `just ci`: runs both root repo lanes.
- `npm run docs:check`: validates required docs, relative markdown links, template metadata, and documented `just` targets.
- `npm run release:check`: packs the npm tarball, verifies required entries, and scaffolds every registered template from the packed artifact.

Template-level `just lint`, `just typecheck`, `just test`, and `just ux` commands live inside each template and are validated by the template workflows and scaffold evaluation.

## Workflow Coverage

- [`.github/workflows/repo-ci.yml`](../.github/workflows/repo-ci.yml): root repo `self-check` and `supply-chain` lanes
- [`.github/workflows/templates-ci.yml`](../.github/workflows/templates-ci.yml): validates templates in place and narrows the matrix to changed templates unless shared paths changed or the workflow was dispatched manually
- [`.github/workflows/docs-ci.yml`](../.github/workflows/docs-ci.yml): runs the docs integrity checks for root and template markdown
- [`.github/workflows/scaffold-eval.yml`](../.github/workflows/scaffold-eval.yml): scaffolds each template from the packaged CLI and runs the generated repo checks
- [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml): manual publish path that reruns the root self-check before `npm publish`

## Template CI Shape

- `prepare`: computes the affected template matrix from path filters and shared-file invalidation
- `fast`: runs `just lint` and `just typecheck`
- `test`: runs `just test`
- `ux`: installs Playwright browser dependencies and runs `just ux`
- Python and Rust setup are lane- and template-specific, so workflow matrix metadata and template commands need to move together when tool requirements change

## Release And Scaffold Verification

- [`scripts/release-pack-check.mjs`](../scripts/release-pack-check.mjs) is the release gate behind `npm run release:check`
- the tarball must include the CLI, `README.md`, `LICENSE`, `templates/registry.json`, and a template CI workflow file
- the release gate smoke-tests `dk-harness list` from the packed tarball and scaffolds every template into a temporary directory
- [`.github/workflows/scaffold-eval.yml`](../.github/workflows/scaffold-eval.yml) complements the tarball check by running the generated repos' own `just lint`, `just typecheck`, and `just test` commands
- [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) is intentionally manual; use the default dry run first, then rerun with `dry_run: false` when ready to publish

## Operating Expectations

- Favor fast, deterministic checks that can run locally and in CI.
- Keep repo commands, workflow lanes, and release checks aligned with what an agent would actually run.
- When a template adds a required runtime or tool, update the template docs, workflow matrix metadata, and scaffold evaluation together.
- When a repo-level change should invalidate every template, update the shared-path filters in [`.github/workflows/templates-ci.yml`](../.github/workflows/templates-ci.yml).
- Treat broken scaffold generation, tarball drift, and docs drift as product regressions, not cleanup.
