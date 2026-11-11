import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Home,
  Wallet,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react'
import { getAnnoncesActives } from '../services/annoncesService'
import { VILLES, TYPES_BIEN } from '../utils/constants'
import AnnonceCard from '../components/AnnonceCard'
import { SkeletonGrid } from '../components/SkeletonCard'

export default function Accueil() {
  const navigate = useNavigate()
  const [recentes, setRecentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState({ ville: '', prixMax: '', type: '' })

  useEffect(() => {
    getAnnoncesActives({ max: 8 })
      .then(setRecentes)
      .catch(() => setRecentes([]))
      .finally(() => setLoading(false))
  }, [])

  function rechercher(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.ville) params.set('ville', q.ville)
    if (q.prixMax) params.set('prixMax', q.prixMax)
    if (q.type) params.set('type', q.type)
    navigate(`/annonces?${params.toString()}`)
  }

  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section className="relative isolate overflow-hidden bg-primary-950 text-white">
        {/* halos lumineux */}
        <div className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-48 right-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-secondary/15 blur-[120px]" />
        {/* grille fine */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)',
          }}
        />

        <div className="container-page pb-28 pt-16 sm:pb-36 sm:pt-24">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <BadgeCheck size={14} className="text-secondary-400" />
              Offres vérifiées · Sans frais pour les locataires
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-6xl">
              Votre logement au Maroc,{' '}
              <span className="relative inline-block text-secondary-400">
                en toute confiance
                <Swoosh className="absolute -bottom-4 left-0 h-3 w-full text-secondary/60 sm:-bottom-5" />
              </span>
              .
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
              Appartements, studios et chambres soigneusement vérifiés, pensés
              pour les étudiants et les nouveaux arrivants.
            </p>
          </div>

          {/* Recherche */}
          <form
            onSubmit={rechercher}
            className="mt-12 grid animate-fade-up gap-2 rounded-3xl bg-white p-2 text-primary-950 shadow-lift [animation-delay:120ms] sm:grid-cols-[1fr_1fr_1fr_auto] sm:rounded-full"
          >
            <Champ icon={MapPin} label="Ville">
              <select
                className="w-full bg-transparent text-sm font-medium outline-none"
                value={q.ville}
                onChange={(e) => setQ({ ...q, ville: e.target.value })}
              >
                <option value="">Toutes les villes</option>
                {VILLES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Champ>
            <Champ icon={Home} label="Type de bien" separator>
              <select
                className="w-full bg-transparent text-sm font-medium outline-none"
                value={q.type}
                onChange={(e) => setQ({ ...q, type: e.target.value })}
              >
                <option value="">Tous les types</option>
                {TYPES_BIEN.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Champ>
            <Champ icon={Wallet} label="Budget max" separator>
              <input
                type="number"
                min="0"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
                placeholder="MAD / mois"
                value={q.prixMax}
                onChange={(e) => setQ({ ...q, prixMax: e.target.value })}
              />
            </Champ>
            <button type="submit" className="btn-secondary !px-7 !py-4 sm:!py-0">
              <Search size={18} /> Rechercher
            </button>
          </form>
        </div>

        {/* courbe de transition vers l'ivoire */}
        <svg
          className="absolute inset-x-0 bottom-0 h-12 w-full text-ivory sm:h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 64h1440V40C1080 0 360 0 0 40z" fill="currentColor" />
        </svg>
      </section>

      {/* ───────── Chiffres ───────── */}
      <section className="container-page -mt-2">
        <div className="grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-4 sm:divide-x sm:divide-primary-100">
          <Stat valeur={recentes.length ? '100+' : '—'} label="Annonces publiées" />
          <Stat valeur={`${VILLES.length}+`} label="Villes couvertes" />
          <Stat valeur="100%" label="Offres vérifiées" />
          <Stat valeur="0 MAD" label="Frais locataire" />
        </div>
      </section>

      {/* ───────── Annonces récentes ───────── */}
      <section className="container-page py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Sélection</span>
            <h2 className="mt-3 text-3xl font-bold text-primary-950 sm:text-4xl">
              Annonces récentes
            </h2>
          </div>
          <Link
            to="/annonces"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
          >
            Voir toutes les annonces
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-200 transition-all group-hover:border-primary-900 group-hover:bg-primary-900 group-hover:text-white">
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : recentes.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentes.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-primary-200 bg-white/60 py-16 text-center">
            <p className="font-display text-lg font-semibold text-primary-950">
              Les premières annonces arrivent bientôt.
            </p>
            <p className="mt-1 text-sm text-primary-900/50">
              Notre équipe vérifie chaque logement avant publication.
            </p>
          </div>
        )}
      </section>

      {/* ───────── Comment ça marche ───────── */}
      <section className="container-page py-16">
        <div className="max-w-3xl">
          <span className="eyebrow">Simple & sûr</span>
          <h2 className="mt-3 text-3xl font-bold text-primary-950 sm:text-4xl">
            Trois étapes vers votre nouveau chez-vous.
          </h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-primary-100 bg-primary-100 sm:grid-cols-3">
          <Etape
            num="01"
            icon={Search}
            titre="Recherchez"
            texte="Filtrez par ville, budget et type de logement pour trouver ce qui vous correspond."
          />
          <Etape
            num="02"
            icon={ShieldCheck}
            titre="Comparez en confiance"
            texte="Chaque annonce est contrôlée par notre équipe avant d'être publiée."
          />
          <Etape
            num="03"
            icon={MessageCircle}
            titre="Contactez directement"
            texte="Échangez avec le propriétaire via WhatsApp, sans intermédiaire coûteux."
          />
        </div>
      </section>

      {/* ───────── CTA propriétaires ───────── */}
      <section className="container-page py-16">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-primary-950 px-6 py-14 text-white sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-primary-500/30 blur-[100px]" />
          <Swoosh className="pointer-events-none absolute -bottom-6 right-0 -z-10 w-[70%] text-secondary/25" />
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_auto]">
            <div>
              <span className="eyebrow !text-secondary-400">Propriétaires</span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Louez à des locataires sérieux.
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/60">
                Publiez gratuitement votre logement : nous le vérifions, le mettons
                en valeur et vous mettons en relation avec des étudiants et
                professionnels.
              </p>
            </div>
            <Link to="/contact" className="btn-secondary group !px-7 !py-3.5">
              Publier mon logement
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/** Arc doré inspiré du logo */
function Swoosh({ className }) {
  return (
    <svg viewBox="0 0 300 24" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M4 20C80 4 220 2 296 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function Champ({ icon: Icon, label, separator, children }) {
  return (
    <label
      className={
        'relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-primary-50/70 sm:rounded-full sm:px-5' +
        (separator
          ? ' sm:before:absolute sm:before:-left-1 sm:before:top-1/2 sm:before:h-8 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-primary-100'
          : '')
      }
    >
      <Icon size={18} className="shrink-0 text-secondary-600" />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary-900/45">
          {label}
        </span>
        {children}
      </span>
    </label>
  )
}

function Stat({ valeur, label }) {
  return (
    <div className="px-2 text-center sm:px-6">
      <div className="font-display text-3xl font-extrabold text-primary-950 sm:text-4xl">{valeur}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-primary-900/45">{label}</div>
    </div>
  )
}

function Etape({ num, icon: Icon, titre, texte }) {
  return (
    <div className="group bg-white p-8 transition-colors hover:bg-primary-50/40 sm:p-10">
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-950 text-secondary-400 transition-transform group-hover:-translate-y-0.5">
          <Icon size={22} />
        </span>
        <span className="font-display text-sm font-bold tracking-widest text-secondary-600">{num}</span>
      </div>
      <h3 className="mt-8 text-lg font-bold text-primary-950">{titre}</h3>
      <p className="mt-2 text-sm leading-relaxed text-primary-900/55">{texte}</p>
    </div>
  )
}
