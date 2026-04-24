/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "runtime-does-not-import-ui",
      severity: "error",
      from: {
        path: "^src/runtime/",
      },
      to: {
        path: "^src/(providers|ui)/",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
    {
      name: "providers-do-not-import-ui",
      severity: "error",
      from: {
        path: "^src/providers/",
      },
      to: {
        path: "^src/ui/",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
    {
      name: "ui-only-imports-runtime",
      severity: "error",
      from: {
        path: "^src/ui/",
      },
      to: {
        path: "^src/(providers|styles)/",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules|dist",
    },
    includeOnly: "^(src/runtime|src/providers|src/ui|src/styles)",
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
}
