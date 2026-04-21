import { GET as healthGET } from "@/app/api/health/route"
import { GET as rootGET } from "@/app/api/route"
import { GET as openApiGET } from "@/app/openapi.json/route"
import { appMetadata } from "@/src/core/config"
import { healthPayload } from "@/src/domain/health"

describe("backend-nextjs routes", () => {
  it("returns the root starter payload", async () => {
    const response = await rootGET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      message: `Hello from ${appMetadata.title}`,
    })
  })

  it("returns the health payload", async () => {
    const response = await healthGET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ status: "ok" })
  })

  it("keeps the health domain helper stable", () => {
    expect(healthPayload()).toEqual({ status: "ok" })
  })

  it("returns the OpenAPI document", async () => {
    const response = await openApiGET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      openapi: "3.1.0",
      info: {
        title: `${appMetadata.title} API`,
      },
      paths: {
        "/api": {
          get: {
            operationId: "readRoot",
          },
        },
        "/api/health": {
          get: {
            operationId: "healthcheck",
          },
        },
      },
    })
  })
})
