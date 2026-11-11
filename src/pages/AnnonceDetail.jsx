import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  MapPin,
  Maximize,
  BedDouble,
  Building,
  Wallet,
  Users,
  GraduationCap,
  CalendarCheck,
  Share2,
  Check,
  ArrowLeft,
  ShieldCheck,
  Languages,
} from 'lucide-react'
import {
  getAnnonce,
  getAnnoncesSimilaires,
} from '../services/annoncesService'
import { formatPrix, formatDate, timeAgo, estNouvelle } from '../utils/helpers'
import { typeLabel, genreLabel } from '../utils/constants'
import PhotoCarousel from '../components/PhotoCarousel'
import EquipementIcon from '../components/EquipementIcon'
import WhatsAppButton from '../components/WhatsAppButton'
import Badge from '../components/Badge'
import AnnonceCard from '../components/AnnonceCard'

export default function AnnonceDetail() {
  const { id } = useParams()
  const [annonce, setAnnonce] = useState(null)
  const [similaires, setSimilaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    window.scrollTo(0, 0)
    getAnnonce(id)
      .then((data) => {
        if (!data) {
          setNotFound(true)
          return
        }
        setAnnonce(data)
        getAnnoncesSimilaires(data.ville, data.id)
          .then(setSimilaires)
          .catch(() => setSimilaires([]))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  function partager() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: annonce?.titre, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopie(true)
        setTimeout(() => setCopie(false), 2000)
      })
    }
  }

  if (loading) {
    return (
      <div className="container-page py-12">
        <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-primary-50 lg:w-2/3" />
        <div className="mt-6 h-8 w-1/2 animate-pulse rounded-full bg-primary-100/70" />
        <div className="mt-3 h-4 w-1/3 animate-pulse rounded-full bg-primary-50" />
      </div>
    )
  }

  if (notFound || !annonce) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="eyebrow">Introuvable</span>
        <h1 className="mt-3 text-3xl font-bold text-primary-950">Annonce introuvable</h1>
        <p className="mt-3 text-primary-900/55">
          Cette annonce n'existe plus ou a été retirée.
        </p>
        <Link to="/annonces" className="btn-primary mt-8">
          Retour aux annonces
        </Link>
      </div>
    )
  }

  const p = annonce.proprietaire || {}

  return (
    <div className="container-page py-8 sm:py-10">
      <Link
        to="/annonces"
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-900/55 transition-colors hover:text-primary-950"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-100 bg-white transition-all group-hover:border-primary-900 group-hover:bg-primary-900 group-hover:text-white">
          <ArrowLeft size={15} />
        </span>
        Retour aux annonces
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_370px]">
        {/* ───────── Colonne principale ───────── */}
        <div className="min-w-0">
          <PhotoCarousel photos={annonce.photos} titre={annonce.titre} />

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{typeLabel(annonce.type)}</Badge>
              {estNouvelle(annonce.datePublication) && <Badge variant="new">Nouveau</Badge>}
              {annonce.meuble && <Badge variant="gray">Meublé</Badge>}
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-secondary-700">
                <ShieldCheck size={13} /> Vérifiée par RapidImmo
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-primary-950 sm:text-4xl">
              {annonce.titre}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-primary-900/55">
              <MapPin size={16} className="text-secondary-600" />
              {annonce.quartier ? `${annonce.quartier}, ` : ''}
              {annonce.ville}
            </p>
          </header>

          {/* Caractéristiques */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-primary-100 bg-primary-100 sm:grid-cols-4">
            <Carac icon={Maximize} label="Surface" valeur={annonce.surface ? `${annonce.surface} m²` : '—'} />
            <Carac icon={BedDouble} label="Pièces" valeur={annonce.nbPieces || '—'} />
            <Carac icon={Building} label="Étage" valeur={annonce.etage ?? '—'} />
            <Carac icon={Wallet} label="Caution" valeur={annonce.caution ? formatPrix(annonce.caution) : 'Aucune'} />
          </div>

          <Section titre="Description">
            <p className="whitespace-pre-line leading-relaxed text-primary-900/70">
              {annonce.description || 'Aucune description fournie.'}
            </p>
          </Section>

          {annonce.equipements?.length > 0 && (
            <Section titre="Équipements">
              <div className="flex flex-wrap gap-2">
                {annonce.equipements.map((e) => (
                  <EquipementIcon key={e} value={e} />
                ))}
              </div>
            </Section>
          )}

          <Section titre="Conditions du propriétaire">
            <div className="grid gap-3 sm:grid-cols-2">
              <Pref icon={Users} texte={`Genre accepté : ${genreLabel(annonce.genreAccepte)}`} />
              {annonce.etudiantsAcceptes && <Pref icon={GraduationCap} texte="Étudiants acceptés" />}
              <Pref
                icon={CalendarCheck}
                texte={
                  annonce.disponibiliteImmediate
                    ? 'Disponible immédiatement'
                    : annonce.dateDisponibilite
                    ? `Disponible le ${formatDate(annonce.dateDisponibilite)}`
                    : 'Disponibilité à confirmer'
                }
              />
            </div>
          </Section>
        </div>

        {/* ───────── Carte prix + contact ───────── */}
        <aside>
          <div className="sticky top-24 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-primary-100/70">
            <div className="relative isolate overflow-hidden bg-primary-950 px-6 py-6 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-primary-500/40 blur-3xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-400">Loyer mensuel</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold">{formatPrix(annonce.prix)}</span>
                <span className="text-sm text-white/50">/ mois</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-100 font-display text-lg font-bold text-secondary-700">
                  {(p.nom || 'P').charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-primary-900/45">Propriétaire</p>
                  <p className="truncate font-semibold text-primary-950">{p.nom || 'Propriétaire'}</p>
                </div>
              </div>
              {p.langues?.length > 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-primary-900/55">
                  <Languages size={14} className="text-secondary-600" />
                  {p.langues.join(', ')}
                </p>
              )}

              <div className="mt-6">
                <WhatsAppButton numero={p.whatsapp} titreAnnonce={annonce.titre} />
              </div>

              <button onClick={partager} className="btn-outline mt-3 w-full">
                {copie ? <Check size={16} /> : <Share2 size={16} />}
                {copie ? 'Lien copié !' : 'Partager'}
              </button>

              <p className="mt-5 border-t border-primary-100/70 pt-4 text-center text-xs text-primary-900/40">
                Publiée {timeAgo(annonce.datePublication)}
                {annonce.dateMiseAJour && ` · Mise à jour ${timeAgo(annonce.dateMiseAJour)}`}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Annonces similaires */}
      {similaires.length > 0 && (
        <section className="mt-20">
          <span className="eyebrow">À découvrir</span>
          <h2 className="mb-8 mt-3 text-2xl font-bold text-primary-950 sm:text-3xl">
            Autres logements à {annonce.ville}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Section({ titre, children }) {
  return (
    <section className="mt-10 border-t border-primary-100/70 pt-8">
      <h2 className="mb-4 text-xl font-bold text-primary-950">{titre}</h2>
      {children}
    </section>
  )
}

function Carac({ icon: Icon, label, valeur }) {
  return (
    <div className="flex flex-col gap-2 bg-white p-5">
      <Icon size={20} className="text-secondary-600" />
      <div>
        <div className="font-display text-lg font-bold text-primary-950">{valeur}</div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-primary-900/45">{label}</div>
      </div>
    </div>
  )
}

function Pref({ icon: Icon, texte }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-900/75">
      <Icon size={17} className="shrink-0 text-secondary-600" />
      {texte}
    </div>
  )
}
