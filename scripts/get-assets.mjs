// Descarga la película del footer a public/reyard/ si todavía no está.
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
const base = 'https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/prompt-assets/marble-desert/';
mkdirSync('public/reyard', {recursive: true});
for (const f of ['desert.mp4', 'desert-poster.jpg']) {
  const out = `public/reyard/${f}`;
  if (existsSync(out)) continue;
  console.log(`Descargando ${f}…`);
  const r = await fetch(base + f);
  if (!r.ok) { console.error(`No se pudo descargar ${f} (${r.status}).`); process.exitCode = 1; continue; }
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
}
