import { handle } from "hono/vercel";
import app from "../server.js";

// This translates Hono's responses into Vercel's serverless environment
export default handle(app);
