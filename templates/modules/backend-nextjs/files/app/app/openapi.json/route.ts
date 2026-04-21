import { openApiDocument } from "@/src/core/openapi"

export function GET() {
  return Response.json(openApiDocument())
}
