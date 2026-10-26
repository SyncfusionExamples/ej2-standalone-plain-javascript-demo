// Static server for Azure Linux App Service (Node). Serves the Vite build from
// dist/ under BASE_PATH, so it works behind a Google Load Balancer that
// forwards the path unchanged.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_PATH = "/ej2-standalone-plain-javascript-demo";
const DIST = resolve(fileURLToPath(new URL("./dist", import.meta.url)));
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  // Health probe for App Service / load balancer
  if (path === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("ok");
    return;
  }

  if (path === "/" || path === BASE_PATH) {
    res.writeHead(301, { Location: `${BASE_PATH}/${url.search}` }).end();
    return;
  }

  if (!path.startsWith(`${BASE_PATH}/`)) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    return;
  }

  let rel = normalize(path.slice(BASE_PATH.length)).replace(/^([/\\])+/, "");
  let file = join(DIST, rel);
  if (file !== DIST && !file.startsWith(DIST + sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  if (!rel || rel.endsWith("/") || !(await isFile(file))) {
    // Missing asset requests (with extension) 404; other routes fall back to index.html
    if (rel && extname(rel)) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }
    file = join(DIST, "index.html");
  }

  try {
    const body = await readFile(file);
    const ext = extname(file);
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": file.includes(`${sep}assets${sep}`)
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Server error");
  }
}).listen(PORT, () => console.log(`Listening on ${PORT}, base ${BASE_PATH}/`));
