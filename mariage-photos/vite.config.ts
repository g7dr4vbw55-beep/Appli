import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import weddingConfig from './wedding.config.ts'

function echapperHtml(texte: string): string {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Reprend le titre, la description et la couleur de thème depuis
 * wedding.config.ts. Sans cela, index.html gardait des valeurs en dur qui
 * se désynchronisaient dès que la configuration changeait.
 */
function htmlDepuisConfig(): Plugin {
  return {
    name: 'html-depuis-wedding-config',
    transformIndexHtml(html) {
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${echapperHtml(weddingConfig.eventTitle)}</title>`)
        .replace(
          /(<meta name="description" content=")[^"]*(")/,
          `$1${echapperHtml(weddingConfig.welcomeMessage)}$2`,
        )
        .replace(/(<meta name="theme-color" content=")[^"]*(")/, `$1${weddingConfig.themeColor}$2`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), htmlDepuisConfig()],
})
