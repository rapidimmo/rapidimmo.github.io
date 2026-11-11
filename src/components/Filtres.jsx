import { Search, SlidersHorizontal, X } from 'lucide-react'
import { VILLES, TYPES_BIEN, GENRES, TRI_OPTIONS } from '../utils/constants'

// Compte les filtres actifs (hors recherche texte et tri)
export function compterFiltresActifs(filtres) {
  return (
    (filtres.ville ? 1 : 0) +
    (filtres.type ? 1 : 0) +
    (filtres.genre ? 1 : 0) +
    (filtres.meuble ? 1 : 0) +
    (filtres.prixMin !== '' ? 1 : 0) +
    (filtres.prixMax !== '' ? 1 : 0) +
    (filtres.dispoImmediate ? 1 : 0)
  )
}

// Contenu du panneau de filtres (réutilisé desktop + overlay mobile)
export function FiltresPanneau({ filtres, updateFiltre, resetFiltres }) {
  const actifs = compterFiltresActifs(filtres)
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Recherche</label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="input pl-9"
            placeholder="Titre, quartier, mot-clé…"
            value={filtres.recherche}
            onChange={(e) => updateFiltre({ recherche: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Ville</label>
          <select
            className="input"
            value={filtres.ville}
            onChange={(e) => updateFiltre({ ville: e.target.value })}
          >
            <option value="">Toutes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Type</label>
          <select
            className="input"
            value={filtres.type}
            onChange={(e) => updateFiltre({ type: e.target.value })}
          >
            <option value="">Tous</option>
            {TYPES_BIEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Budget (MAD / mois)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            className="input"
            placeholder="Min"
            value={filtres.prixMin}
            onChange={(e) => updateFiltre({ prixMin: e.target.value })}
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min="0"
            className="input"
            placeholder="Max"
            value={filtres.prixMax}
            onChange={(e) => updateFiltre({ prixMax: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Meublé</label>
          <select
            className="input"
            value={filtres.meuble}
            onChange={(e) => updateFiltre({ meuble: e.target.value })}
          >
            <option value="">Indifférent</option>
            <option value="oui">Meublé</option>
            <option value="non">Non meublé</option>
          </select>
        </div>
        <div>
          <label className="label">Genre accepté</label>
          <select
            className="input"
            value={filtres.genre}
            onChange={(e) => updateFiltre({ genre: e.target.value })}
          >
            <option value="">Indifférent</option>
            {GENRES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          checked={filtres.dispoImmediate}
          onChange={(e) => updateFiltre({ dispoImmediate: e.target.checked })}
        />
        Disponible immédiatement
      </label>

      {actifs > 0 && (
        <button
          onClick={resetFiltres}
          className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
        >
          <X size={14} /> Réinitialiser les filtres
        </button>
      )}
    </div>
  )
}

// Barre supérieure : résultats + tri + bouton filtres (mobile)
export function FiltresToolbar({ filtres, updateFiltre, total, onOpenMobile }) {
  const actifs = compterFiltresActifs(filtres)
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-primary-950">{total}</span> logement
        {total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <select
          className="input !w-auto py-1.5 text-sm"
          value={filtres.tri}
          onChange={(e) => updateFiltre({ tri: e.target.value })}
        >
          {TRI_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button onClick={onOpenMobile} className="btn-outline !py-1.5 lg:hidden">
          <SlidersHorizontal size={16} />
          Filtres
          {actifs > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-white">
              {actifs}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// Overlay mobile
export function FiltresMobile({
  open,
  onClose,
  filtres,
  updateFiltre,
  resetFiltres,
  total,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-primary-950">Filtres</h3>
          <button onClick={onClose} aria-label="Fermer">
            <X size={22} className="text-gray-500" />
          </button>
        </div>
        <FiltresPanneau
          filtres={filtres}
          updateFiltre={updateFiltre}
          resetFiltres={resetFiltres}
        />
        <button onClick={onClose} className="btn-primary mt-5 w-full">
          Voir les {total} résultats
        </button>
      </div>
    </div>
  )
}
