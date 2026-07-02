/**
 * ngrok-tunnel.mjs
 * Starts an ngrok HTTP tunnel pointing at the Vite dev server (port 8080).
 *
 * Usage:
 *   NGROK_AUTHTOKEN=<your_token> node ngrok-tunnel.mjs
 *   -- OR --
 *   Add NGROK_AUTHTOKEN to a .env file and run: npm run tunnel
 */

import ngrok from "@ngrok/ngrok";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env manually (no extra deps needed) ──────────────────────────────
const envPath = resolve(__dirname, ".env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

// ── Resolve auth token ─────────────────────────────────────────────────────
const authtoken = process.env.NGROK_AUTHTOKEN;
if (!authtoken) {
  console.error(
    "\x1b[31m[ngrok] ERROR: NGROK_AUTHTOKEN is not set.\x1b[0m\n" +
      "  1. Get your token at https://dashboard.ngrok.com/get-started/your-authtoken\n" +
      '  2. Add it to a .env file:  NGROK_AUTHTOKEN=<token>\n' +
      "  3. Re-run: npm run tunnel\n"
  );
  process.exit(1);
}

const PORT = parseInt(process.env.VITE_PORT ?? "8080", 10);

// ── Start tunnel ───────────────────────────────────────────────────────────
console.log(`\x1b[36m[ngrok] Opening tunnel → http://localhost:${PORT} …\x1b[0m`);

const listener = await ngrok.forward({
  addr: PORT,
  authtoken,
});

const url = listener.url();
console.log(`\x1b[32m[ngrok] ✔ Tunnel live at: ${url}\x1b[0m`);
console.log(`\x1b[90m[ngrok] Press Ctrl+C to close the tunnel.\x1b[0m`);

// Keep the process alive & clean up on exit
process.on("SIGINT", async () => {
  console.log("\n\x1b[33m[ngrok] Closing tunnel…\x1b[0m");
  await ngrok.disconnect();
  process.exit(0);
});
