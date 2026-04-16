import * as cheerio from "cheerio";

const BASE_URL = "https://animehindidubbed.in";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const DEFAULT_CORS_HEADERS = {
  Referer: BASE_URL,
  Origin: BASE_URL,
  "User-Agent": UA,
};

// REMOVED retries. We must succeed or fail in 4 seconds to beat Vercel's 10s limit.
async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,*/*;q=0.8",
        Referer: BASE_URL,
      },
      signal: AbortSignal.timeout(4000), // strictly 4 seconds
    });
    
    if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
      return res;
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    throw new Error(`Fetch failed: ${e.message}`);
  }
}

async function fetchText(url, referer) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Referer: referer || BASE_URL,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(4000), // strictly 4 seconds
  });
  return res.text();
}

// ... KEEP THE REST OF YOUR src/hindidubbed.js EXACTLY THE SAME FROM HERE DOWN ...
// (extractM3u8FromText, getHome, getCategory, search, getAnime, extractEpisodeHls)
