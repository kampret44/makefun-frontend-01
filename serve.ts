import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const documentRoot = fileURLToPath(new URL('./app/', import.meta.url));
const flag = process.argv.indexOf('--port');
const candidate = flag < 0 ? 8080 : Number(process.argv[flag + 1]);
const port = Number.isInteger(candidate) && candidate > 0 && candidate < 65536 ? candidate : 8080;
const types: Record<string,string> = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.ico':'image/x-icon', '.woff2':'font/woff2' };
createServer((req,res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = resolve(documentRoot, '.' + pathname);
    if (!file.startsWith(resolve(documentRoot) + sep)) { res.writeHead(403).end('Forbidden'); return; }
    const info = statSync(file);
    if (!info.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream', 'Content-Length':info.size, 'Cache-Control':'no-store' });
    createReadStream(file).pipe(res);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Fieldwork is ready at http://localhost:${port}`));
