import { useCallback, useState } from 'react'
import PorteAcces from '../components/PorteAcces'
import Entete from '../components/Entete'
import BoutonAjoutPhotos from '../components/BoutonAjoutPhotos'
import FileEnvoi from '../components/FileEnvoi'
import Galerie from '../components/Galerie'
import PhotoPleinEcran from '../components/PhotoPleinEcran'
import { useUploadQueue } from '../lib/useUploadQueue'
import type { PhotoAvecUrl } from '../lib/types'

export default function Accueil() {
  return <PorteAcces>{(prenom) => <ContenuGalerie prenom={prenom} />}</PorteAcces>
}

function ContenuGalerie({ prenom }: { prenom: string }) {
  const [photosRecentes, setPhotosRecentes] = useState<PhotoAvecUrl[]>([])
  const [photoOuverte, setPhotoOuverte] = useState<PhotoAvecUrl | null>(null)

  const gererPhotoEnvoyee = useCallback((photo: PhotoAvecUrl) => {
    setPhotosRecentes((prev) => [photo, ...prev])
  }, [])

  const { elements, ajouterFichiers, relancer, retirer } = useUploadQueue(prenom, gererPhotoEnvoyee)

  return (
    <div className="min-h-dvh bg-violet-950 pb-10">
      <Entete prenom={prenom} />

      <div className="mx-auto max-w-2xl px-4 py-4">
        <BoutonAjoutPhotos onFichiers={ajouterFichiers} />
      </div>

      <FileEnvoi elements={elements} onRelancer={relancer} onRetirer={retirer} />

      <Galerie photosAjoutees={photosRecentes} onPhotoClic={setPhotoOuverte} />

      {photoOuverte && (
        <PhotoPleinEcran photo={photoOuverte} prenom={prenom} onFermer={() => setPhotoOuverte(null)} />
      )}
    </div>
  )
}
