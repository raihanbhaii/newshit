import { Hono } from "hono";
import { Cache } from "../src/cache.js";
import {
  getHome,
  getCategory,
  search,
  getAnime,
  extractEpisodeHls,
} from "../src/hindidubbed.js";

const HOME_TTL = 3_600;
const SEARCH_TTL = 1_800;
const INFO_TTL = 86_400;

export const hindidubbedRoutes = new Hono();

hindidubbedRoutes.get("/home", async (c) => {
  try {
    const key = "hdb:home";
    const cached = await Cache.get(key);
    if (cached) return c.json(JSON.parse(cached));

    const data = await getHome();
    await Cache.set(key, JSON.stringify(data), HOME_TTL);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch home data", details: error.message }, 500);
  }
});

hindidubbedRoutes.get("/category/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const key = `hdb:cat:${name}`;
    const cached = await Cache.get(key);
    if (cached) return c.json(JSON.parse(cached));

    const data = await getCategory(name);
    await Cache.set(key, JSON.stringify(data), INFO_TTL);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch category", details: error.message }, 500);
  }
});

hindidubbedRoutes.get("/search/:title", async (c) => {
  try {
    const title = c.req.param("title");
    if (!title) return c.json({ error: "Missing title parameter" }, 400);

    const key = `hdb:search:${title}`;
    const cached = await Cache.get(key);
    if (cached) return c.json(JSON.parse(cached));

    const data = await search(title);
    await Cache.set(key, JSON.stringify(data), SEARCH_TTL);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Search failed", details: error.message }, 500);
  }
});

hindidubbedRoutes.get("/anime/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const key = `hdb:anime:${slug}`;
    const cached = await Cache.get(key);

    if (cached) {
      const data = JSON.parse(cached);
      const looksValid = Array.isArray(data?.episodes) && data.episodes.length > 0;
      if (looksValid) return c.json(data);
    }

    const data = await getAnime(slug);
    await Cache.set(key, JSON.stringify(data), INFO_TTL);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch anime info", details: error.message }, 500);
  }
});

hindidubbedRoutes.get("/episode", async (c) => {
  try {
    const url = c.req.query("url");
    if (!url) return c.json({ error: "Missing url parameter" }, 400);

    const data = await extractEpisodeHls(url);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to extract episode", details: error.message }, 500);
  }
});

hindidubbedRoutes.get("/episode/hls", async (c) => {
  try {
    const url = c.req.query("url");
    if (!url) return c.json({ error: "Missing url parameter" }, 400);

    const serverName = c.req.query("server")?.toLowerCase();
    if (serverName?.includes("abyss")) {
      return c.json({ error: "Servabyss extraction is intentionally disabled" }, 400);
    }

    const data = await extractEpisodeHls(url);
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to extract HLS", details: error.message }, 500);
  }
});
