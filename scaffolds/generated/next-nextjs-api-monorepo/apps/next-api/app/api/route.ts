import { appMetadata } from "@/src/core/config"
import { rootPayload } from "@/src/domain/health"

export async function GET() {
  return Response.json(rootPayload(appMetadata.title))
}
