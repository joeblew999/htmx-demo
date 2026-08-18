# htmx 4 Streaming Demo

A [Hono](https://hono.dev) app on Cloudflare Workers, built against
[htmx v4.0.0-beta6](https://github.com/bigskysoftware/htmx/releases/tag/v4.0.0-beta6).

## Why Hono on Cloudflare Workers

htmx 4's `hx-multipart` extension keeps **one HTTP response open** while the server writes
new parts as events happen. Server-push therefore needs no persistent per-client channel —
no WebSockets, no Durable Objects. Workers support the Web Streams API natively and Hono
exposes it through `c.stream()`, so a plain stateless Worker holding a response open is the
whole mechanism.

## Quick start

```bash
mise install
mise run setup
mise run dev      # http://localhost:8787
```

`mise tasks` lists everything else. [`mise.toml`](mise.toml) is the source of truth for
tooling — what's pinned, what each task does, and why. Read it before changing the
toolchain; the non-obvious constraints are documented inline there.

## Status

Built and working:

- `GET /` — page shell, htmx 4 + daisyUI 5, scriptless
- `POST /htmx/greet` — hypermedia fragment, `hx-swap="morph"`
- `POST /api/greet` — Chanfana + Zod validation, OpenAPI docs at `/api`
- D1 binding wired and typed (no queries yet)

Not built yet — the streaming demo this repo is named for:

| Pattern                 | Mechanism                               |
| ----------------------- | --------------------------------------- |
| Server-push updates     | `multipart/mixed`                       |
| Parallel target updates | `multipart/parallel`                    |
| Per-part targeting      | part-level `HX-Retarget` / `HX-Trigger` |
| Live region refresh     | `hx-live`                               |

Before the first deploy: `mise run d1-create`, then paste the id into
[`wrangler.jsonc`](wrangler.jsonc).

## Resources

- [htmx docs](https://htmx.org/docs/) · [extensions](https://github.com/bigskysoftware/htmx-extensions)
- [Hono](https://hono.dev/docs/) · [Cloudflare Workers](https://developers.cloudflare.com/workers/)

htmx 4 authoring guidance is vendored into `.github/skills/` by `mise run setup`.
