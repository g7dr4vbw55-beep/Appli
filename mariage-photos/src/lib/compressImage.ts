import imageCompression from 'browser-image-compression'

const TAILLE_MAX_MO = 0.5 // ~500 Ko
const DIMENSION_MAX_PX = 1600

export interface ResultatCompression {
  fichier: File
  largeur: number
  hauteur: number
}

/**
 * Redimensionne et compresse une photo côté navigateur avant envoi :
 * ~500 Ko et 1600px sur le plus grand côté, pour tenir dans le stockage
 * gratuit et rester rapide sur un réseau 4G faible.
 */
export async function compresserPhoto(fichierOriginal: File): Promise<ResultatCompression> {
  const fichierCompresse = await imageCompression(fichierOriginal, {
    maxSizeMB: TAILLE_MAX_MO,
    maxWidthOrHeight: DIMENSION_MAX_PX,
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: 'image/jpeg',
  })

  const dimensions = await lireDimensions(fichierCompresse)

  // browser-image-compression garde parfois le nom d'origine avec une autre extension : on force .jpg
  const nomFichier = renommerEnJpg(fichierOriginal.name)
  const fichierFinal = new File([fichierCompresse], nomFichier, { type: 'image/jpeg' })

  return { fichier: fichierFinal, largeur: dimensions.largeur, hauteur: dimensions.hauteur }
}

function renommerEnJpg(nomOriginal: string): string {
  const sansExtension = nomOriginal.replace(/\.[^.]+$/, '')
  return `${sansExtension || 'photo'}.jpg`
}

function lireDimensions(fichier: File): Promise<{ largeur: number; hauteur: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(fichier)
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ largeur: image.naturalWidth, hauteur: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Impossible de lire l'image"))
    }
    image.src = url
  })
}
