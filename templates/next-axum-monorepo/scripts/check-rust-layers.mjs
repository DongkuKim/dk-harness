import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const layers = ["api", "core", "domain"]
const layerRank = new Map(layers.map((layer, index) => [layer, index]))

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(scriptDir, "../apps/axum/src")
const violations = []

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const nextPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walk(nextPath)
      continue
    }

    if (!entry.name.endsWith(".rs")) {
      continue
    }

    const relativePath = path.relative(srcDir, nextPath)
    const [ownerLayer] = relativePath.split(path.sep)

    if (!layerRank.has(ownerLayer)) {
      continue
    }

    const source = stripComments(readFileSync(nextPath, "utf8"))
    const matches = source.matchAll(/\bcrate::(api|core|domain)\b/g)

    for (const [, targetLayer] of matches) {
      if (layerRank.get(targetLayer) < layerRank.get(ownerLayer)) {
        violations.push(
          `${relativePath}: ${ownerLayer} must not depend on higher layer ${targetLayer}`,
        )
      }
    }
  }
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
}

walk(srcDir)

if (violations.length > 0) {
  console.error("Rust layer check failed:")

  for (const violation of violations) {
    console.error(`- ${violation}`)
  }

  process.exit(1)
}

console.log("Rust layer check passed.")
