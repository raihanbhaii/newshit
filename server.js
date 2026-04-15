import { Hono } from "hono";
import { Cache } from "./src/cache.js";
import { hindidubbedRoutes } from "./routes/hindidubbed.js";

const app = new Hono();

app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
});

app.get("/", (c) =>
  c.json({
    name: "AnimeHindiDubbed API",
    version: "1.0.0",
    source: "https://animehindidubbed.in",
    routes: {
      home:         "GET /home",
      category:     "GET /category/:name",
      search:       "GET /search/:title",
      animeInfo:    "GET /anime/:slug",
      episodeEmbed: "GET /episode?url=<embed_url>",
      episodeHls:   "GET /episode/hls?url=<embed_url>&server=filemoon",
    },
    categories:[
      "action","action-adventure","adventure","comedy","drama",
      "fantasy","horror","mystery","love-romantic","school",
      "slice-of-life","hindi-anime-movies","cartoon-shows",
      "netflix","crunchiroll","amazon-prime",
    ],
    note: "Servabyss HLS extraction is intentionally disabled.",
  })
);

app.route("/", hindidubbedRoutes);

// Export the Hono app instance so the Vercel handler can use it
export default app;
