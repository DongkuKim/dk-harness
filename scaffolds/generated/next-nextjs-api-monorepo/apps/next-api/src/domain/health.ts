export function rootPayload(appTitle: string) {
  return {
    message: `Hello from ${appTitle}`,
  }
}

export function healthPayload() {
  return {
    status: "ok",
  }
}
