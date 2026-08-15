// Régénère public/manifest.webmanifest à partir de wedding.config.ts,
// pour que la configuration reste centralisée dans un seul fichier.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const racine = path.join(__dirname, '..')

const { default: weddingConfig } = await import(path.join(racine, 'wedding.config.ts'))

const manifest = {
  name: weddingConfig.eventTitle,
  short_name: weddingConfig.shortName,
  description: weddingConfig.welcomeMessage,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: weddingConfig.backgroundColor,
  theme_color: weddingConfig.themeColor,
  lang: 'fr',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}

writeFileSync(path.join(racine, 'public', 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n')
console.log('Généré : public/manifest.webmanifest')
