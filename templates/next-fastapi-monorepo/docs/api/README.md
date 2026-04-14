# API Contract

Current FastAPI endpoints:

- `GET /`: returns JSON `{"message": "Hello from FastAPI"}`
- `GET /health`: returns JSON `{"status": "ok"}`

When changing endpoints, record:

- method and route
- request shape
- response shape
- status codes
- compatibility notes for callers
