import { appMetadata } from "./config"

export function openApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: `${appMetadata.title} API`,
      version: appMetadata.version,
      description:
        "Swagger-enabled OpenAPI document for the Next.js API scaffold.",
    },
    servers: [
      {
        url: "/",
        description: "Current deployment",
      },
    ],
    tags: [
      {
        name: "system",
        description: "System and health endpoints",
      },
    ],
    paths: {
      "/api": {
        get: {
          operationId: "readRoot",
          summary: "Read the root API payload",
          tags: ["system"],
          responses: {
            "200": {
              description: "Starter payload",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["message"],
                    properties: {
                      message: {
                        type: "string",
                        example: `Hello from ${appMetadata.title}`,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          operationId: "healthcheck",
          summary: "Read the health status",
          tags: ["system"],
          responses: {
            "200": {
              description: "Health payload",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["status"],
                    properties: {
                      status: {
                        type: "string",
                        example: "ok",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}
