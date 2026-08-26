import { useState } from 'react'
import PorteAcces from '../components/PorteAcces'
import Entete from '../components/Entete'
import Remerciements from '../components/Remerciements'
import Videos from '../components/Videos'

/**
 * Une fois le mariage passé et les photos récupérées, l'application n'est
 * plus un outil de collecte mais un souvenir à revoir : les onglets Album et
 * Défis ont été retirés de l'espace invités.
 *
 * Les photos ne sont pas supprimées pour autant : elles restent dans
 * Supabase, et la page d'administration donne toujours accès à la grille
 * complète et au téléchargement de l'archive.
 */
type Onglet = 'videos' | 'merci'

export default function Accueil() {
  return <PorteAcces>{(prenom) => <ContenuSouvenirs prenom={prenom} />}</PorteAcces>
}

function ContenuSouvenirs({ prenom }: { prenom: string }) {
  const [onglet, setOnglet] = useState<Onglet>('videos')

  return (
    <div className="min-h-dvh pb-10">
      <Entete prenom={prenom} />

      <Onglets actif={onglet} onChanger={setOnglet} />

      {onglet === 'videos' && <Videos prenom={prenom} />}
      {onglet === 'merci' && <Remerciements />}
    </div>
  )
}

function Onglets({ actif, onChanger }: { actif: Onglet; onChanger: (o: Onglet) => void }) {
  return (
    <div className="sticky top-[3.75rem] z-10 bg-prune-950/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl gap-2 rounded-full bg-prune-850/80 p-1.5">
        <BoutonOnglet actif={actif === 'videos'} onClick={() => onChanger('videos')}>
          Vidéos
        </BoutonOnglet>
        <BoutonOnglet actif={actif === 'merci'} onClick={() => onChanger('merci')}>
          Merci
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
