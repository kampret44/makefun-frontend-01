import { cpSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const sourceDirectory = fileURLToPath(new URL('.', import.meta.url));
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(destination, { recursive: true });
for (const folder of ['app', 'screenshots']) {
  const target = join(destination, folder);
  if (target === join(sourceDirectory, folder)) throw new Error('Output must be separate from source');
  rmSync(target, { recursive: true, force: true });
  cpSync(join(sourceDirectory, folder), target, { recursive: true });
}
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 3, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216
});
writeFileSync(join(destination, 'dossier.json'), dossier);
console.log('Static app, three screenshots and dossier written to ' + destination);
