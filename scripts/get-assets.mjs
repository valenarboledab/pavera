// Descarga la película del footer y las fotos de las dunas si todavía no están.
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
const host = 'https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/prompt-assets/';
const files = [
  ['marble-desert/desert.mp4', 'public/reyard/desert.mp4'],
  ['marble-desert/desert-poster.jpg', 'public/reyard/desert-poster.jpg'],
  ['dune-card/dunes.jpg', 'public/images/dunes.jpg'],
  ['dune-card/dunes-front.webp', 'public/images/dunes-front.webp'],
];
mkdirSync('public/reyard', {recursive: true});
mkdirSync('public/images', {recursive: true});
for (const [f, out] of files) {
  if (existsSync(out)) continue;
  console.log(`Descargando ${f}…`);
  const r = await fetch(host + f);
  if (!r.ok) { console.error(`No se pudo descargar ${f} (${r.status}).`); process.exitCode = 1; continue; }
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
}
