import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import weddingConfig from '../../wedding.config'

/**
 * Repère les adresses de déploiement Vercel, du type
 * "projet-a1b2c3d4e-compte.vercel.app". Elles changent à chaque
 * redéploiement et sont souvent protégées par une authentification : un
 * QR code qui pointe dessus ne fonctionnera pas pour les invités.
 */
function estUrlDeDeploiement(url: string): boolean {
  return /-[a-z0-9]{8,}-[^.]+\.vercel\.app/i.test(url)
}

export default function Affiche() {
  const [urlSaisie, setUrlSaisie] = useState(() => window.location.origin)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const urlFinale = normaliserUrl(urlSaisie)
  const avertissement = estUrlDeDeploiement(urlFinale)

  useEffect(() => {
    if (!urlFinale) {
      setQrDataUrl(null)
      return
    }
    QRCode.toDataURL(urlFinale, {
      width: 800,
      margin: 1,
      color: { dark: '#150a18', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [urlFinale])

  return (
    <div className="min-h-dvh bg-prune-950 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 max-w-md px-4 print:hidden">
        <h1 className="text-center text-xl font-bold text-creme">Affiche à imprimer (format A5)</h1>

        <label htmlFor="url-affiche" className="mt-5 block text-sm font-semibold text-mauve-300">
          Adresse encodée dans le QR code
        </label>
        <input
          id="url-affiche"
          value={urlSaisie}
          onChange={(e) => setUrlSaisie(e.target.value)}
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="mt-2 w-full rounded-xl border-2 border-prune-600 bg-prune-950/60 px-4 py-3 text-base text-creme outline-none focus:border-corail-400"
        />

        {avertissement ? (
          <p className="mt-3 rounded-xl border border-or-300/60 bg-or-300/10 px-3 py-2 text-sm text-creme">
            Cette adresse est celle d'un déploiement précis : elle change à chaque mise à jour et peut demander une
            connexion Vercel à vos invités. Remplacez-la par l'adresse de production de votre projet, celle sans code
            au milieu (rubrique <span className="font-semibold">Domains</span> dans Vercel).
          </p>
        ) : (
          <p className="mt-3 text-sm text-mauve-300">
            Vérifiez cette adresse avant d'imprimer : c'est elle que vos invités ouvriront en scannant le code.
          </p>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 w-full rounded-2xl bg-corail-500 px-6 py-3 text-base font-bold text-prune-950"
        >
          Imprimer
        </button>
      </div>

      <div className="affiche-a5 mx-auto flex aspect-[148/210] w-full max-w-[420px] flex-col items-center justify-between border border-prune-600 bg-white px-8 py-10 text-center text-prune-950 print:border-0 print:shadow-none">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-mauve-500">Partagez vos photos</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight">{weddingConfig.eventTitle}</h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR code vers l'album photo" className="h-56 w-56" />
          ) : (
            <p className="flex h-56 w-56 items-center justify-center text-sm text-mauve-500">
              Saisissez une adresse pour générer le QR code.
            </p>
          )}
          <p className="max-w-[240px] text-base leading-snug text-prune-800">
            Scannez ce code avec l'appareil photo de votre téléphone pour ajouter vos photos de la soirée.
          </p>
        </div>

        <div>
          {/* L'adresse est imprimée sous le code : un invité dont l'appareil
              photo ne lit pas les QR codes peut la saisir à la main. */}
          <p className="break-all text-xs text-mauve-500">{urlFinale.replace(/^https?:\/\//, '')}</p>
          <p className="mt-1 text-sm text-mauve-500">Aucune application à installer</p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A5 portrait; margin: 0; }
          html, body { background: white; }
          .affiche-a5 { width: 148mm; height: 210mm; max-width: none; aspect-ratio: auto; }
        }
      `}</style>
    </div>
  )
}

function normaliserUrl(saisie: string): string {
  const propre = saisie.trim().replace(/\/+$/, '')
  if (!propre) return ''
  return /^https?:\/\//i.test(propre) ? propre : `https://${propre}`
}
