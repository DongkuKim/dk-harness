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
      name: "app-api-only-imports-core-and-domain",
      severity: "error",
      from: {
        path: "^app/api/",
      },
      to: {
        path: "^(?!(app/api/|src/core/|src/domain/)).+",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
    {
      name: "core-does-not-import-app",
      severity: "error",
      from: {
        path: "^src/core/",
      },
      to: {
        path: "^(app/|(?!(src/core/|src/domain/)).+)",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
    {
      name: "domain-is-leaf-like",
      severity: "error",
      from: {
        path: "^src/domain/",
      },
      to: {
        path: "^(app/|src/core/|(?!(src/domain/)).+)",
        dependencyTypesNot: ["npm", "npm-dev", "core"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules|\\.next",
    },
    exclude: {
      path: "^(next-env\\.d\\.ts|\\.next)",
    },
    includeOnly: "^(app|src)",
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
}
