// Local Supabase Storage protocol fixture. Never receives store credentials.
import { createServer } from "node:http";

const files = new Map();
createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1:55440").pathname;
  if (pathname === "/health") { response.end("ok"); return; }
  const publicPrefix = "/storage/v1/object/public/product-images/";
  const uploadPrefix = "/storage/v1/object/product-images/";
  if (request.method === "GET" && pathname.startsWith(publicPrefix)) {
    const file = files.get(pathname.slice(publicPrefix.length));
    if (!file) { response.writeHead(404).end(); return; }
    response.writeHead(200, { "Content-Type": file.type, "Cache-Control": "public, max-age=60" }).end(file.bytes);
    return;
  }
  if (request.headers.apikey !== "local-test-storage-key") { response.writeHead(403).end(); return; }
  if (request.method === "POST" && pathname.startsWith(uploadPrefix)) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const key = pathname.slice(uploadPrefix.length);
    // AVIF requests deliberately fail to exercise save recovery.
    if (request.headers["content-type"] === "image/avif") {
      response.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "Test storage unavailable" }));
      return;
    }
    files.set(key, { bytes: Buffer.concat(chunks), type: request.headers["content-type"] });
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ Key: `product-images/${key}` }));
    return;
  }
  if (request.method === "DELETE" && pathname === "/storage/v1/object/product-images") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    for (const key of body.prefixes ?? []) files.delete(key);
    response.writeHead(200, { "Content-Type": "application/json" }).end("[]");
    return;
  }
  response.writeHead(404).end();
}).listen(55440, "127.0.0.1");
