import { useState } from 'react'
import { Download, Share, SquarePlus, X } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { cn } from '../utils/helpers'

/** Bouton « Installer l'app » — invisible si l'app est déjà installée ou non installable. */
export default function InstallButton({ className, onDone }) {
  const { mode, installer } = useInstallPrompt()
  const [aideIOS, setAideIOS] = useState(false)

  if (!mode) return null

  async function onClick() {
    if (mode === 'ios') setAideIOS(true)
    else await installer()
    onDone?.()
  }

  return (
    <>
      <button type="button" onClick={onClick} className={cn('btn-outline', className)}>
        <Download size={16} /> Installer l'app
      </button>

      {aideIOS && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-primary-950/50 p-4 backdrop-blur-sm sm:items-center" onClick={() => setAideIOS(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-primary-950">Installer RapidImmo</h3>
              <button onClick={() => setAideIOS(false)} aria-label="Fermer" className="text-primary-900/50">
                <X size={20} />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-primary-900/75">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"><Share size={16} /></span>
                Touchez le bouton <strong>Partager</strong> de Safari
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"><SquarePlus size={16} /></span>
                Choisissez <strong>« Sur l'écran d'accueil »</strong>
              </li>
            </ol>
            <button onClick={() => setAideIOS(false)} className="btn-primary mt-6 w-full">Compris</button>
          </div>
        </div>
      )}
    </>
  )
}
