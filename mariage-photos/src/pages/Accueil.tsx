import { useCallback, useState } from 'react'
import PorteAcces from '../components/PorteAcces'
import Entete from '../components/Entete'
import BoutonAjoutPhotos from '../components/BoutonAjoutPhotos'
import FileEnvoi from '../components/FileEnvoi'
import Galerie from '../components/Galerie'
import Defis from '../components/Defis'
import PresentationJeu from '../components/PresentationJeu'
import PhotoPleinEcran from '../components/PhotoPleinEcran'
import { useUploadQueue } from '../lib/useUploadQueue'
import { getDefisAccomplis } from '../lib/localPrefs'
import { defisTries } from '../../defis.config'
import type { PhotoAvecUrl } from '../lib/types'

type Onglet = 'album' | 'defis'

export default function Accueil() {
  return <PorteAcces>{(prenom) => <ContenuGalerie prenom={prenom} />}</PorteAcces>
}

function ContenuGalerie({ prenom }: { prenom: string }) {
  const [onglet, setOnglet] = useState<Onglet>('album')
  const [photosRecentes, setPhotosRecentes] = useState<PhotoAvecUrl[]>([])
  const [photoOuverte, setPhotoOuverte] = useState<PhotoAvecUrl | null>(null)
  const [filtreDefi, setFiltreDefi] = useState<string | null>(null)
  // Non mémorisé volontairement : la présentation réapparaît à chaque
  // ouverture de la page, pour qu'aucun invité ne passe à côté du jeu.
  const [presentationVisible, setPresentationVisible] = useState(true)
  // Incrémenté après chaque envoi réussi pour que l'onglet Défis relise les
  // défis accomplis, qui vivent dans le stockage local.
  const [versionAccomplis, setVersionAccomplis] = useState(0)

  const gererPhotoEnvoyee = useCallback((photo: PhotoAvecUrl) => {
    setPhotosRecentes((prev) => [photo, ...prev])
    setVersionAccomplis((v) => v + 1)
  }, [])

  const { elements, ajouterFichiers, relancer, retirer } = useUploadQueue(prenom, gererPhotoEnvoyee)

  const nombreAccomplis = getDefisAccomplis().filter((id) => defisTries.some((d) => d.id === id)).length
  void versionAccomplis // force le recalcul du compteur affiché sur l'onglet

  return (
    <div className="min-h-dvh pb-10">
      <Entete prenom={prenom} onAide={() => setPresentationVisible(true)} />

      <Onglets
        actif={onglet}
        onChanger={setOnglet}
        nombreAccomplis={nombreAccomplis}
        totalDefis={defisTries.length}
      />

      {onglet === 'album' ? (
        <>
          <div className="mx-auto max-w-2xl px-4 pb-5 pt-4">
            <BoutonAjoutPhotos onFichiers={(f) => ajouterFichiers(f)} />
          </div>

          <FileEnvoi elements={elements} onRelancer={relancer} onRetirer={retirer} />

          <Galerie
            photosAjoutees={photosRecentes}
            onPhotoClic={setPhotoOuverte}
            filtreDefi={filtreDefi}
            onChangerFiltre={setFiltreDefi}
          />
        </>
      ) : (
        <>
          <FileEnvoi elements={elements} onRelancer={relancer} onRetirer={retirer} />

          <div className="pt-4">
            <Defis
              versionAccomplis={versionAccomplis}
              onFichiers={(fichiers, defi) => ajouterFichiers(fichiers, defi)}
              onVoirPhotos={(defi) => {
                setFiltreDefi(defi.id)
                setOnglet('album')
              }}
            />
          </div>
        </>
      )}

      {photoOuverte && (
        <PhotoPleinEcran photo={photoOuverte} prenom={prenom} onFermer={() => setPhotoOuverte(null)} />
      )}

      {presentationVisible && <PresentationJeu onFermer={() => setPresentationVisible(false)} />}
    </div>
  )
}

function Onglets({
  actif,
  onChanger,
  nombreAccomplis,
  totalDefis,
}: {
  actif: Onglet
  onChanger: (o: Onglet) => void
  nombreAccomplis: number
  totalDefis: number
}) {
  return (
    <div className="sticky top-[3.75rem] z-10 bg-prune-950/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl gap-2 rounded-full bg-prune-850/80 p-1.5">
        <BoutonOnglet actif={actif === 'album'} onClick={() => onChanger('album')}>
          Album
        </BoutonOnglet>
        <BoutonOnglet actif={actif === 'defis'} onClick={() => onChanger('defis')}>
          Défis
          <span
            className={[
              'ml-2 rounded-full px-2 py-0.5 text-xs font-bold',
              actif === 'defis' ? 'bg-prune-950/25 text-prune-950' : 'bg-prune-800 text-rosee-300',
            ].join(' ')}
          >
            {nombreAccomplis}/{totalDefis}
          </span>
        </BoutonOnglet>
      </div>
    </div>
  )
}

function BoutonOnglet({
  actif,
  onClick,
  children,
}: {
  actif: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-1 items-center justify-center rounded-full py-3 text-base font-bold transition-colors',
        actif ? 'bg-corail-500 text-prune-950' : 'text-mauve-300 active:bg-prune-800',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
