import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const presetsRoot = path.join(repoRoot, "scaffolds", "presets");
const generatedRoot = path.join(repoRoot, "scaffolds", "generated");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(" ")}`,
        result.stdout?.trim() ? `stdout:\n${result.stdout.trim()}` : null,
        result.stderr?.trim() ? `stderr:\n${result.stderr.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }

  return result;
}

function loadPresets() {
  return readdirSync(presetsRoot)
    .filter((entry) => entry.endsWith(".json"))
    .sort()
    .map((entry) => {
      const presetPath = path.join(presetsRoot, entry);
      statSync(presetPath);
      return JSON.parse(readFileSync(presetPath, "utf8"));
    });
}

function buildComposeArgs(destination, modules) {
  return [
    "new",
    destination,
    ...modules.flatMap((moduleSpec) => ["--module", moduleSpec]),
    "--force",
  ];
}

function composePreset(destinationRoot, preset) {
  const destination = path.join(destinationRoot, preset.name);
  run("./bin/dk-harness", buildComposeArgs(destination, preset.modules));
  return destination;
}

function assertPathExists(absolutePath, label) {
  try {
    statSync(absolutePath);
  } catch {
    throw new Error(`Missing ${label}: ${absolutePath}`);
  }
}

function assertBackendOnlyScaffold(smokePath, appId, label) {
  assertPathExists(path.join(smokePath, "apps", appId), label);

  try {
    statSync(path.join(smokePath, "apps", "web"));
    throw new Error("Backend-only smoke scaffold unexpectedly generated apps/web");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const workflowContents = readFileSync(path.join(smokePath, ".github", "workflows", "ci.yml"), "utf8");
  if (workflowContents.includes("\n  ux:\n")) {
    throw new Error("Backend-only smoke scaffold should not generate a UX CI job.");
  }
}

function runBackendOnlySmoke(tempRoot) {
  const fastapiSmokePath = path.join(tempRoot, "backend-only-fastapi");
  run("./bin/dk-harness", [
    "new",
    fastapiSmokePath,
    "--module",
    "core-monorepo",
    "--module",
    "backend-fastapi:fast-api",
    "--force",
  ]);
  assertBackendOnlyScaffold(fastapiSmokePath, "fast-api", "backend-only FastAPI app");

  const nextjsSmokePath = path.join(tempRoot, "backend-only-nextjs");
  run("./bin/dk-harness", [
    "new",
    nextjsSmokePath,
    "--module",
    "core-monorepo",
    "--module",
    "backend-nextjs:next-api",
    "--force",
  ]);
  assertBackendOnlyScaffold(nextjsSmokePath, "next-api", "backend-only Next.js API app");
}

function main() {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const presets = loadPresets();
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "dk-harness-scaffolds-"));

  try {
    for (const preset of presets) {
      const generatedPath = composePreset(tempRoot, preset);
      if (mode === "write") {
        const destination = path.join(generatedRoot, preset.name);
        rmSync(destination, { recursive: true, force: true });
        cpSync(generatedPath, destination, { recursive: true });
        continue;
      }

      const committedPath = path.join(generatedRoot, preset.name);
      assertPathExists(committedPath, `generated scaffold for ${preset.name}`);
      run("diff", ["-rq", generatedPath, committedPath]);
    }

    runBackendOnlySmoke(tempRoot);
    console.log(`fixtures:${mode} passed`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
