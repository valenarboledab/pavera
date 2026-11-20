# Pavera Pavimentos

Sitio en Vite + React 19 + TypeScript + Tailwind CSS v4, con el footer "Marble Desert".

## Cómo correrlo

1. Instala Node.js (versión 20 o superior) desde https://nodejs.org
2. Abre una terminal en esta carpeta y ejecuta:

   ```bash
   npm install
   npm run dev
   ```

   La primera vez, `npm run dev` descarga el video del desierto a `public/reyard/`.
   Abre la dirección que aparece (normalmente http://localhost:5173).

3. Para publicarlo: `npm run build` y sube la carpeta `dist/` (o conecta la carpeta a Vercel o Netlify).

## Dónde se cambian las cosas

- Textos, servicios, proyectos y precios: `src/sections/Pavera/content.ts`
- Textos del footer (marca, columnas, redes): `src/sections/Reyard/content.ts`
- Los demás archivos de `src/sections/Reyard/` son los del prompt, sin cambios.
