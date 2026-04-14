import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const mode = process.argv[2] ?? "check"
const writeMode = mode === "write"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const config = {
  allowedReferenceFiles: ["design-system-reference-llms.txt", "uv-llms.txt"],
  requiredFiles: [
    "AGENTS.md",
    "ARCHITECTURE.md",
    "docs/DESIGN.md",
    "docs/FRONTEND.md",
    "docs/PLANS.md",
    "docs/PRODUCT_SENSE.md",
    "docs/QUALITY_SCORE.md",
    "docs/RELIABILITY.md",
    "docs/SECURITY.md",
    "docs/design-docs/index.md",
    "docs/design-docs/core-beliefs.md",
    "docs/exec-plans/tech-debt-tracker.md",
    "docs/generated/db-schema.md",
    "docs/product-specs/index.md",
    "docs/product-specs/new-user-onboarding.md",
    "docs/references/design-system-reference-llms.txt",
    "docs/references/uv-llms.txt",
  ],
  requiredDirs: [
    "docs/design-docs",
    "docs/exec-plans/active",
    "docs/exec-plans/completed",
    "docs/generated",
    "docs/product-specs",
    "docs/references",
  ],
}

const legacyFiles = [
  "docs/build.md",
  "docs/architecture.md",
  "docs/conventions.md",
  "docs/api/README.md",
]

const requiredAgentLinks = [
  "ARCHITECTURE.md",
  "docs/DESIGN.md",
  "docs/FRONTEND.md",
  "docs/PLANS.md",
  "docs/PRODUCT_SENSE.md",
  "docs/QUALITY_SCORE.md",
  "docs/RELIABILITY.md",
  "docs/SECURITY.md",
]

const requiredPlanSections = [
  "## Status",
  "## Scope",
  "## Steps",
  "## Progress Log",
  "## Decision Log",
]

const errors = []

for (const relativePath of config.requiredDirs) {
  const fullPath = path.join(rootDir, relativePath)
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    errors.push(`Missing required directory: ${relativePath}`)
  }
}

for (const relativePath of config.requiredFiles) {
  const fullPath = path.join(rootDir, relativePath)
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    errors.push(`Missing required file: ${relativePath}`)
  }
}

for (const relativePath of legacyFiles) {
  if (fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`Legacy knowledge-base file should be removed: ${relativePath}`)
  }
}

const agentsPath = path.join(rootDir, "AGENTS.md")
if (fs.existsSync(agentsPath)) {
  const agentsContent = fs.readFileSync(agentsPath, "utf8")
  const lineCount = agentsContent.trimEnd().split("\n").length
  if (lineCount > 100) {
    errors.push(`AGENTS.md should stay under 100 lines, found ${lineCount}`)
  }

  for (const linkTarget of requiredAgentLinks) {
    if (!agentsContent.includes(`(${linkTarget})`)) {
      errors.push(`AGENTS.md should link to ${linkTarget}`)
    }
  }
}

const plansPath = path.join(rootDir, "docs/PLANS.md")
if (fs.existsSync(plansPath)) {
  const plansContent = fs.readFileSync(plansPath, "utf8").toLowerCase()
  for (const phrase of [
    "first-class artifacts",
    "docs/exec-plans/active/",
    "docs/exec-plans/completed/",
    "tech-debt-tracker.md",
    "progress log",
    "decision log",
  ]) {
    if (!plansContent.includes(phrase)) {
      errors.push(`docs/PLANS.md should mention "${phrase}"`)
    }
  }
}

for (const directoryName of ["active", "completed"]) {
  const directoryPath = path.join(rootDir, "docs/exec-plans", directoryName)
  for (const entry of listMarkdownFiles(directoryPath)) {
    const content = fs.readFileSync(path.join(directoryPath, entry), "utf8")
    if (!content.startsWith("# ")) {
      errors.push(`Plan file should start with an H1 title: docs/exec-plans/${directoryName}/${entry}`)
    }
    for (const section of requiredPlanSections) {
      if (!content.includes(section)) {
        errors.push(`Plan file is missing ${section}: docs/exec-plans/${directoryName}/${entry}`)
      }
    }
  }
}

const referenceDir = path.join(rootDir, "docs/references")
if (fs.existsSync(referenceDir)) {
  const actualReferenceFiles = fs
    .readdirSync(referenceDir)
    .filter((entry) => entry.endsWith(".txt"))
    .sort()
  const expectedReferenceFiles = [...config.allowedReferenceFiles].sort()
  if (JSON.stringify(actualReferenceFiles) !== JSON.stringify(expectedReferenceFiles)) {
    errors.push(
      `docs/references should contain only ${expectedReferenceFiles.join(", ")}; found ${actualReferenceFiles.join(", ") || "(none)"}`,
    )
  }
}

syncGeneratedFile(
  "docs/design-docs/index.md",
  renderIndexFile({
    title: "Design Docs Index",
    directory: "docs/design-docs",
    emptyMessage: "Add new design notes here when the frontend or developer experience changes materially.",
  }),
)

syncGeneratedFile(
  "docs/product-specs/index.md",
  renderIndexFile({
    title: "Product Specs Index",
    directory: "docs/product-specs",
    emptyMessage: "Add product-specific specs here when the starter grows beyond the baseline onboarding flow.",
  }),
)

syncGeneratedFile("docs/generated/db-schema.md", renderDbSchemaSnapshot())

for (const relativePath of collectMarkdownFiles(rootDir)) {
  validateLocalLinks(relativePath)
}

if (errors.length > 0) {
  console.error("Knowledge-base check failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Knowledge-base ${writeMode ? "refresh" : "check"} passed.`)

function syncGeneratedFile(relativePath, expectedContent) {
  const fullPath = path.join(rootDir, relativePath)
  const currentContent = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null
  if (currentContent === expectedContent) {
    return
  }

  if (writeMode) {
    fs.writeFileSync(fullPath, expectedContent)
    return
  }

  errors.push(`Generated file is out of date: ${relativePath}`)
}

function renderIndexFile({ title, directory, emptyMessage }) {
  const directoryPath = path.join(rootDir, directory)
  const entries = listMarkdownFiles(directoryPath)
    .map((entry) => ({
      file: entry,
      title: extractTitle(path.join(directoryPath, entry)),
    }))
    .sort((left, right) => left.file.localeCompare(right.file))

  const lines = [`# ${title}`, ""]

  if (entries.length === 0) {
    lines.push(emptyMessage)
  } else {
    for (const entry of entries) {
      lines.push(`- [${entry.title}](./${entry.file})`)
    }
    lines.push("")
    lines.push(emptyMessage)
  }

  return `${lines.join("\n")}\n`
}

function renderDbSchemaSnapshot() {
  const schemaFiles = collectDatabaseHints(rootDir)
  if (schemaFiles.length === 0) {
    return [
      "# DB Schema",
      "",
      "This template does not ship with a database by default.",
      "",
      "If persistence is added later, generate and store a current schema snapshot here.",
      "",
    ].join("\n")
  }

  return [
    "# DB Schema",
    "",
    "Detected database-related files:",
    "",
    ...schemaFiles.map((file) => `- \`${file}\``),
    "",
    "Refresh this snapshot whenever the persistence model changes.",
    "",
  ].join("\n")
}

function collectDatabaseHints(directoryPath) {
  const results = []

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", "dist", "build", ".venv"].includes(entry.name)) {
      continue
    }

    const fullPath = path.join(directoryPath, entry.name)
    const relativePath = path.relative(rootDir, fullPath)

    if (entry.isDirectory()) {
      results.push(...collectDatabaseHints(fullPath))
      continue
    }

    if (
      entry.name === "schema.prisma" ||
      entry.name.startsWith("drizzle.config.") ||
      entry.name === "alembic.ini" ||
      relativePath.includes("/migrations/") ||
      relativePath.endsWith(".sql")
    ) {
      results.push(relativePath)
    }
  }

  return results.sort()
}

function validateLocalLinks(relativePath) {
  const fullPath = path.join(rootDir, relativePath)
  const content = fs.readFileSync(fullPath, "utf8")
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g

  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1]
    if (
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("#")
    ) {
      continue
    }

    const sanitizedTarget = rawTarget.split("#")[0]
    const resolvedTarget = path.resolve(path.dirname(fullPath), sanitizedTarget)
    if (!fs.existsSync(resolvedTarget)) {
      errors.push(`Broken local link in ${relativePath}: ${rawTarget}`)
    }
  }
}

function extractTitle(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : path.basename(filePath, ".md")
}

function listMarkdownFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  return fs
    .readdirSync(directoryPath)
    .filter((entry) => entry.endsWith(".md") && entry !== "index.md")
    .sort()
}

function collectMarkdownFiles(directoryPath) {
  const files = []

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", "dist", "build", ".venv"].includes(entry.name)) {
      continue
    }

    const fullPath = path.join(directoryPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath))
      continue
    }

    if (entry.name.endsWith(".md")) {
      files.push(path.relative(rootDir, fullPath))
    }
  }

  return files.sort()
}
