"use client"

import dynamic from "next/dynamic"
import type { ReactElement } from "react"
import type { SwaggerUIProps } from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const SwaggerUI = dynamic<SwaggerUIProps>(
  () => import("swagger-ui-react").then((module) => module.default),
  {
    ssr: false,
  },
)

export default function SwaggerUi(): ReactElement {
  return (
    <main className="min-h-svh bg-white">
      <SwaggerUI
        defaultModelsExpandDepth={-1}
        displayRequestDuration
        docExpansion="list"
        url="/openapi.json"
      />
    </main>
  )
}
