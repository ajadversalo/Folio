require("dotenv").config({ path: [".env.local", ".env"], quiet: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const { migrate, getBook, getReaderState, saveReaderState } = require("./db");

const root = __dirname;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 100000) reject(new Error("Request body is too large"));
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function validState(value) {
  return value && Number.isInteger(value.currentPage) && value.currentPage >= 0 &&
    ["paper", "night", "mist"].includes(value.theme) &&
    Number.isInteger(value.fontSize) && value.fontSize >= 14 && value.fontSize <= 22 &&
    typeof value.pageSound === "boolean" && Array.isArray(value.expandedGroups) &&
    value.expandedGroups.every(item => typeof item === "string") &&
    Array.isArray(value.bookmarks) && value.bookmarks.every(Number.isInteger);
}

async function handleRequest(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/api/book") {
    if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
    try {
      const book = await getBook();
      return book ? json(res, 200, { book }) : json(res, 404, { error: "Book content has not been imported" });
    } catch (error) {
      console.error("Book request failed:", error);
      return json(res, 500, { error: "Unable to load book content" });
    }
  }
  const stateMatch = urlPath.match(/^\/api\/state\/([a-zA-Z0-9_-]{16,64})$/);
  if (stateMatch) {
    try {
      if (req.method === "GET") return json(res, 200, { state: await getReaderState(stateMatch[1]) });
      if (req.method === "PUT") {
        const state = await readJson(req);
        if (!validState(state)) return json(res, 400, { error: "Invalid reader state" });
        return json(res, 200, { state: await saveReaderState(stateMatch[1], state) });
      }
      return json(res, 405, { error: "Method not allowed" });
    } catch (error) {
      console.error("Reader state request failed:", error);
      return json(res, error.message === "Invalid JSON" ? 400 : 500, { error: "Unable to persist reader state" });
    }
  }
  if (urlPath.startsWith("/api/")) return json(res, 404, { error: "Not found" });
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const file = path.resolve(root, relative);
  if (!(file === root || file.startsWith(`${root}${path.sep}`)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("Not found"); return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}

migrate().then(() => {
  http.createServer((req, res) => void handleRequest(req, res)).listen(process.env.PORT || 4173, () => {
    console.log(`Folio is ready at http://localhost:${process.env.PORT || 4173}`);
    console.log(`Database: ${process.env.TURSO_DATABASE_URL ? "Turso" : "local folio.db"}`);
  });
}).catch(error => {
  console.error("Database initialization failed:", error);
  process.exitCode = 1;
});
