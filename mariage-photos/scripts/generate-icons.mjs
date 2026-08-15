// Génère les icônes PWA (PNG) sans dépendance externe : encodeur PNG minimal
// + dessin d'un cœur via une courbe implicite, dans les couleurs du mariage.
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const FOND = hexVersRgb('#1e0d22')
const COEUR = hexVersRgb('#ff6f5c')

function hexVersRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function dessinerIcone(taille, { padding = 0.18 } = {}) {
  const pixels = Buffer.alloc(taille * taille * 4)

  for (let y = 0; y < taille; y++) {
    for (let x = 0; x < taille; x++) {
      const i = (y * taille + x) * 4
      // Coordonnées normalisées : le cœur (formule implicite) occupe environ
      // x∈[-1,1], y∈[-1.1,1] ; on cadre sur son centre réel (~0,-0.05)
      const echelle = 1.15 + padding
      const nx = ((x + 0.5) / taille - 0.5) * 2 * echelle
      const ny = -((y + 0.5) / taille - 0.5) * 2 * echelle - 0.05

      const dansCoeur = estDansCoeur(nx, ny)

      const [r, g, b] = dansCoeur ? COEUR : FOND
      pixels[i] = r
      pixels[i + 1] = g
      pixels[i + 2] = b
      pixels[i + 3] = 255
    }
  }

  return pixels
}

// Courbe classique du cœur : (x² + y² - 1)³ - x² y³ <= 0
function estDansCoeur(x, y) {
  const v = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3)
  return v <= 0
}

function encoderPNG(taille, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(taille, 0)
  ihdrData.writeUInt32BE(taille, 4)
  ihdrData[8] = 8 // profondeur 8 bits
  ihdrData[9] = 6 // RGBA
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = creerChunk('IHDR', ihdrData)

  // Chaque ligne précédée d'un octet de filtre (0 = aucun filtre)
  const brut = Buffer.alloc(taille * (taille * 4 + 1))
  for (let y = 0; y < taille; y++) {
    const ligneDebut = y * (taille * 4 + 1)
    brut[ligneDebut] = 0
    pixels.copy(brut, ligneDebut + 1, y * taille * 4, (y + 1) * taille * 4)
  }
  const idatData = deflateSync(brut, { level: 9 })
  const idat = creerChunk('IDAT', idatData)

  const iend = creerChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

function creerChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const longueur = Buffer.alloc(4)
  longueur.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([longueur, typeBuf, data, crc])
}

const TABLE_CRC = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = TABLE_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

const tailles = [
  { nom: 'icon-32.png', taille: 32, padding: 0.15 },
  { nom: 'icon-180.png', taille: 180, padding: 0.2 },
  { nom: 'icon-192.png', taille: 192, padding: 0.2 },
  { nom: 'icon-512.png', taille: 512, padding: 0.2 },
  { nom: 'icon-512-maskable.png', taille: 512, padding: 0.42 },
]

for (const { nom, taille, padding } of tailles) {
  const pixels = dessinerIcone(taille, { padding })
  const png = encoderPNG(taille, pixels)
  writeFileSync(path.join(outDir, nom), png)
  console.log(`Généré : public/icons/${nom}`)
}
