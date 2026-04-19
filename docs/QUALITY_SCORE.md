# Quality Score

Use this rubric when reviewing changes to the root repo, template catalog, or scaffold CLI.

## High Quality Means

- `templates/` and `templates/registry.json` stay the source of truth for scaffolds
- the catalog stays small and intentional
- docs match the actual command surface, workflow files, and release checks
- repo-local commands are explicit and fast enough to run during normal work
- release, docs, and CI checks reinforce each other without restating the same rule in too many places
- packaging and scaffold verification fail before broken templates reach publish

## Red Flags

- docs or automation restating the same rule in multiple places without a clear audience difference
- template changes that are not reflected in registry metadata, packaging checks, or workflow coverage
- generated output being edited directly instead of changing the source template or asset first
- stale local commands or broken relative doc links
- adding one-off templates or repo conventions without a clear ownership boundary
