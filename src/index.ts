import { Hono } from "hono";
import type { Context } from "hono";
import { fromHono, OpenAPIRoute, contentJson } from "chanfana";
import { z } from "zod";

import { render } from "./lib/render";
import layout from "./templates/layout.html";
import greeting from "./templates/greeting.html";

export interface Env {
  // Bound in wrangler.jsonc. Wired and typed; no queries yet.
  DB: D1Database;
}

type AppContext = Context<{ Bindings: Env }>;

const app = new Hono<{ Bindings: Env }>();

/* ---------------------------------------------------------------- page --- */

app.get("/", (c) => c.html(render(layout, { title: "htmx 4 + Hono" })));

/* ----------------------------------------------------- hypermedia layer --- */
// /htmx/* speaks HTML fragments: parse a urlencoded form, return a block.

app.post("/htmx/greet", async (c) => {
  const body = await c.req.parseBody();
  const name = String(body["name"] ?? "").trim() || "world";

  return c.html(
    render(greeting, {
      name,
      time: new Date().toISOString().slice(11, 19) + " UTC",
    }),
  );
});

/* --------------------------------------------------------- machine API --- */
// /api/* speaks validated JSON, with docs generated from the same schema.

class GreetEndpoint extends OpenAPIRoute {
  schema = {
    tags: ["greet"],
    summary: "Greet a name",
    request: {
      body: contentJson(
        z.object({
          name: z.string().min(1).max(64),
        }),
      ),
    },
    responses: {
      "200": {
        description: "The greeting",
        ...contentJson(z.object({ message: z.string() })),
      },
    },
  };

  async handle(_c: AppContext) {
    const { body } = await this.getValidatedData<typeof this.schema>();
    return { message: `Hello, ${body.name}!` };
  }
}

const openapi = fromHono(app, { docs_url: "/api" });
openapi.post("/api/greet", GreetEndpoint);

export default app;
