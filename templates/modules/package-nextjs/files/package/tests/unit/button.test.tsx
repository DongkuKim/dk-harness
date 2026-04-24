import { render, screen } from "@testing-library/react"

import { Button } from "../../src/index.js"

describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Save changes</Button>)

    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled()
  })
})
