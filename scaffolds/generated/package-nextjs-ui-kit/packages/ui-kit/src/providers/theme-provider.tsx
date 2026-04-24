"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type * as React from "react"

function ThemeProvider({
  attribute = "class",
  disableTransitionOnChange = true,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute={attribute}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    />
  )
}

export { ThemeProvider, useTheme }
