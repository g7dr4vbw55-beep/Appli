import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import weddingConfig from '../../wedding.config'

export default function Affiche() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const url = `${window.location.origin}/`

  useEffect(() => {
    QRCode.toDataURL(url, { width: 800, margin: 1, color: { dark: '#1a1425', light: '#ffffff' } }).then(setQrDataUrl)
  }, [url])

  return (
    <div className="min-h-dvh bg-violet-950 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 max-w-md px-4 text-center print:hidden">
        <h1 className="text-xl font-bold text-amber-100">Affiche à imprimer (format A5)</h1>
        <p className="mt-2 text-sm text-violet-300">
          Imprimez cette page (Ctrl/Cmd + P) sur une feuille A5, une par table. Le QR code pointe automatiquement vers
          l'adresse de ce site : {url}
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-2xl bg-amber-400 px-6 py-3 text-base font-bold text-violet-950"
        >
          Imprimer
        </button>
      </div>

      <div className="affiche-a5 mx-auto flex aspect-[148/210] w-full max-w-[420px] flex-col items-center justify-between border border-violet-700 bg-white px-8 py-10 text-center text-violet-950 print:border-0 print:shadow-none">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-500">Partagez vos photos</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight">{weddingConfig.eventTitle}</h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          {qrDataUrl && <img src={qrDataUrl} alt="QR code vers l'album photo" className="h-56 w-56" />}
          <p className="max-w-[240px] text-base leading-snug text-violet-800">
            Scannez ce code avec l'appareil photo de votre téléphone pour ajouter vos photos de la soirée.
          </p>
        </div>

        <p className="text-sm text-violet-500">Aucune application à installer</p>
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
