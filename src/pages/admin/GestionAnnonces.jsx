import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  PlusCircle,
  Search,
} from 'lucide-react'
import {
  getAllAnnonces,
  changerStatut,
  supprimerAnnonce,
} from '../../services/annoncesService'
import { supprimerPhoto } from '../../services/storageService'
import { formatPrix, timeAgo } from '../../utils/helpers'
import { typeLabel, VILLES, STATUTS } from '../../utils/constants'
import Badge from '../../components/Badge'

export default function GestionAnnonces() {
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null) // id en cours d'action
  const [f, setF] = useState({ recherche: '', ville: '', statut: '' })

  useEffect(() => {
    charger()
  }, [])

  async function charger() {
    setLoading(true)
    try {
      setAnnonces(await getAllAnnonces())
    } finally {
      setLoading(false)
    }
  }

  const resultats = useMemo(() => {
    return annonces.filter((a) => {
      if (f.ville && a.ville !== f.ville) return false
      if (f.statut && a.statut !== f.statut) return false
      if (f.recherche) {
        const q = f.recherche.toLowerCase()
        if (
          !a.titre?.toLowerCase().includes(q) &&
          !a.description?.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [annonces, f])

  async function toggleStatut(a) {
    setBusy(a.id)
    const nouveau = a.statut === 'active' ? 'inactive' : 'active'
    try {
      await changerStatut(a.id, nouveau)
      setAnnonces((prev) =>
        prev.map((x) => (x.id === a.id ? { ...x, statut: nouveau } : x))
      )
    } finally {
      setBusy(null)
    }
  }

  async function supprimer(a) {
    if (
      !window.confirm(
        `Supprimer définitivement l'annonce « ${a.titre} » ? Cette action est irréversible.`
      )
    )
      return
    setBusy(a.id)
    try {
      // Supprime aussi les photos du Storage (best-effort)
      await Promise.all((a.photos || []).map((url) => supprimerPhoto(url)))
      await supprimerAnnonce(a.id)
      setAnnonces((prev) => prev.filter((x) => x.id !== a.id))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">Gestion des annonces</h1>
          <p className="text-gray-500">{annonces.length} annonce(s) au total</p>
        </div>
        <Link to="/admin/annonces/nouvelle" className="btn-primary">
          <PlusCircle size={18} /> Nouvelle
        </Link>
      </div>

      {/* Filtres admin */}
      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Rechercher un titre…"
            value={f.recherche}
            onChange={(e) => setF({ ...f, recherche: e.target.value })}
          />
        </div>
        <select
          className="input"
          value={f.ville}
          onChange={(e) => setF({ ...f, ville: e.target.value })}
        >
          <option value="">Toutes les villes</option>
          {VILLES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select
          className="input"
          value={f.statut}
          onChange={(e) => setF({ ...f, statut: e.target.value })}
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Tableau / cartes */}
      {loading ? (
        <div className="card p-10 text-center text-gray-400">Chargement…</div>
      ) : resultats.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Aucune annonce ne correspond.
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="border-b border-primary-100/70 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Annonce</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">MàJ</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/70">
              {resultats.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary-950 line-clamp-1">{a.titre}</div>
                    <div className="text-xs text-gray-400">{typeLabel(a.type)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.ville}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrix(a.prix)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.statut === 'active' ? 'green' : 'gray'}>
                      {a.statut === 'active' ? 'Active' : a.statut === 'archivee' ? 'Archivée' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {timeAgo(a.dateMiseAJour || a.datePublication)}
                  </td>
                  <td className="px-4 py-3">
                    <Actions a={a} busy={busy} onToggle={toggleStatut} onDelete={supprimer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-primary-100/70 md:hidden">
            {resultats.map((a) => (
              <li key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-primary-950 line-clamp-1">{a.titre}</div>
                    <div className="text-xs text-gray-400">
                      {typeLabel(a.type)} · {a.ville} · {formatPrix(a.prix)}
                    </div>
                  </div>
                  <Badge variant={a.statut === 'active' ? 'green' : 'gray'}>
                    {a.statut === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="mt-3">
                  <Actions a={a} busy={busy} onToggle={toggleStatut} onDelete={supprimer} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Actions({ a, busy, onToggle, onDelete }) {
  const disabled = busy === a.id
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={`/admin/annonces/${a.id}/modifier`}
        className="rounded-xl p-2 text-gray-500 hover:bg-primary-50 hover:text-primary"
        title="Modifier"
      >
        <Pencil size={16} />
      </Link>
      <button
        onClick={() => onToggle(a)}
        disabled={disabled}
        className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        title={a.statut === 'active' ? 'Désactiver' : 'Activer'}
      >
        {a.statut === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        onClick={() => onDelete(a)}
        disabled={disabled}
        className="rounded-xl p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
