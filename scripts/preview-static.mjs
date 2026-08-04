/**
 * Serves `out/` the way the host will.
 *
 * `next start` cannot run an `output: "export"` build, and serving the folder
 * with something that silently rewrites everything to index.html would hide
 * exactly the class of bug worth catching here — a route that resolves in
 * development and 404s on Apache. So this does what reg.ru's Apache does and
 * nothing more: look for the file, then for `index.html` inside the directory,
 * then fall over to 404.html.
 *
 *   npm run preview [-- --port 3001]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "out");
const portArg = process.argv.indexOf("--port");
const PORT = portArg > -1 ? Number(process.argv[portArg + 1]) : 3001;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const readIfFile = async (p) => {
  try {
    if (!(await stat(p)).isFile()) return null;
    return await readFile(p);
  } catch {
    return null;
  }
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  /* Refuse to walk out of the export with ../ */
  const rel = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const target = path.join(ROOT, rel);

  /* Apache's DirectoryIndex order: the exact file, then index.html inside it. */
  let body = await readIfFile(target);
  let file = target;

  if (body === null) {
    file = path.join(target, "index.html");
    body = await readIfFile(file);
  }

  if (body === null) {
    file = path.join(ROOT, "404.html");
    body = await readIfFile(file);
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(body ?? "404");
    console.log(`404 ${url.pathname}`);
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`Serving ./out as Apache would on http://localhost:${PORT}`);
});
