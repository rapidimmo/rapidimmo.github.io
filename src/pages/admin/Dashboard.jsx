import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  EyeOff,
  MapPin,
  Inbox,
  PlusCircle,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import { getAllAnnonces } from '../../services/annoncesService'
import { getMessages } from '../../services/messagesService'
import { formatPrix, timeAgo } from '../../utils/helpers'
import { typeLabel } from '../../utils/constants'
import Badge from '../../components/Badge'

export default function Dashboard() {
  const [annonces, setAnnonces] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    Promise.all([getAllAnnonces(), getMessages()])
      .then(([a, m]) => {
        setAnnonces(a)
        setMessages(m)
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('[dashboard]', e)
        setErreur(
          e?.code === 'permission-denied'
            ? 'Accès Firestore refusé : vérifiez que les règles de sécurité sont publiées.'
            : 'Impossible de charger les données.'
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const actives = annonces.filter((a) => a.statut === 'active').length
  const inactives = annonces.filter((a) => a.statut !== 'active').length
  const villes = new Set(annonces.map((a) => a.ville)).size
  const nonLus = messages.filter((m) => !m.lu && !m.archive).length

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Administration</span>
          <h1 className="mt-2 text-3xl font-bold text-primary-950">Tableau de bord</h1>
        </div>
        <Link to="/admin/annonces/nouvelle" className="btn-secondary hidden sm:inline-flex">
          <PlusCircle size={18} /> Nouvelle annonce
        </Link>
      </div>

      {erreur && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" /> {erreur}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Building2} highlight valeur={annonces.length} label="Annonces au total" loading={loading} />
        <StatCard icon={CheckCircle2} valeur={actives} label="Annonces actives" loading={loading} />
        <StatCard icon={EyeOff} valeur={inactives} label="Inactives / archivées" loading={loading} />
        <StatCard icon={MapPin} valeur={villes} label="Villes couvertes" loading={loading} />
      </div>

      {/* Messages non lus */}
      {nonLus > 0 && (
        <Link
          to="/admin/messages"
          className="group mt-5 flex items-center justify-between rounded-2xl border border-secondary-200 bg-secondary-50 px-5 py-4 text-secondary-700 transition-colors hover:bg-secondary-100"
        >
          <span className="flex items-center gap-3 font-medium">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary-950">
              <Inbox size={17} />
            </span>
            {nonLus} nouveau{nonLus > 1 ? 'x' : ''} message{nonLus > 1 ? 's' : ''} propriétaire
          </span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* Dernières annonces */}
      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-primary-100/70 px-6 py-5">
          <h2 className="text-lg font-bold text-primary-950">Dernières annonces</h2>
          <Link
            to="/admin/annonces"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 hover:text-primary-600"
          >
            Tout gérer <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-primary-900/40">Chargement…</div>
        ) : annonces.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-primary-900/50">Aucune annonce pour l'instant.</p>
            <Link to="/admin/annonces/nouvelle" className="btn-primary mt-4">
              <PlusCircle size={17} /> Créer la première
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-primary-100/70">
            {annonces.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link
                  to={`/admin/annonces/${a.id}/modifier`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-primary-50/50"
                >
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-primary-50">
                    {(a.photoprincipale || a.photos?.[0]) && (
                      <img src={a.photoprincipale || a.photos[0]} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold text-primary-950">{a.titre}</p>
                    <p className="text-xs text-primary-900/45">
                      {typeLabel(a.type)} · {a.ville} · {formatPrix(a.prix)} · {timeAgo(a.dateMiseAJour || a.datePublication)}
                    </p>
                  </div>
                  <Badge variant={a.statut === 'active' ? 'green' : 'gray'}>
                    {a.statut === 'active' ? 'Active' : a.statut === 'archivee' ? 'Archivée' : 'Inactive'}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, valeur, label, loading, highlight }) {
  return (
    <div
      className={
        highlight
          ? 'relative isolate overflow-hidden rounded-2xl bg-primary-950 p-6 text-white shadow-lift'
          : 'card p-6'
      }
    >
      {highlight && (
        <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-primary-500/40 blur-3xl" />
      )}
      <div className="flex items-center justify-between">
        <span
          className={
            'flex h-10 w-10 items-center justify-center rounded-xl ' +
            (highlight ? 'bg-white/10 text-secondary-400' : 'bg-primary-50 text-primary-700')
          }
        >
          <Icon size={20} />
        </span>
      </div>
      <div className={'mt-5 font-display text-3xl font-extrabold ' + (highlight ? '' : 'text-primary-950')}>
        {loading ? '—' : valeur}
      </div>
      <div className={'mt-1 text-xs font-medium uppercase tracking-wider ' + (highlight ? 'text-white/50' : 'text-primary-900/45')}>
        {label}
      </div>
    </div>
  )
}
