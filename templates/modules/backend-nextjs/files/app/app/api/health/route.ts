import { healthPayload } from "@/src/domain/health"

export async function GET() {
  return Response.json(healthPayload())
}
