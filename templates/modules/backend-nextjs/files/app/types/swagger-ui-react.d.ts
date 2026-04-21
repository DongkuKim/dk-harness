declare module "swagger-ui-react" {
  import type { ComponentType } from "react"

  export type DocExpansion = "list" | "full" | "none"

  export interface SwaggerUIProps {
    url?: string
    docExpansion?: DocExpansion
    defaultModelsExpandDepth?: number
    displayRequestDuration?: boolean
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>
  export default SwaggerUI
}

declare module "swagger-ui-react/swagger-ui.css"
