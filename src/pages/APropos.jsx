import { Link } from 'react-router-dom'
import { ShieldCheck, HeartHandshake, Accessibility, Languages } from 'lucide-react'

export default function APropos() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-primary-950 text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary-500/30 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-80 w-80 rounded-full bg-secondary/15 blur-[110px]" />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
          <span className="eyebrow !text-secondary-400">À propos</span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Notre mission : loger en confiance.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/65">
            RapidImmo est né d'un constat simple : trouver un logement au Maroc
            quand on est étudiant ou nouvel arrivant relève trop souvent du
            parcours du combattant. Barrière linguistique, méfiance, absence de
            réseau… Nous jouons le rôle d'intermédiaire de confiance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold text-primary-950">Nos valeurs</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Valeur
            icon={ShieldCheck}
            titre="Transparence"
            texte="Des annonces vérifiées, des informations claires, aucun frais caché pour les chercheurs de logement."
          />
          <Valeur
            icon={HeartHandshake}
            titre="Inclusion"
            texte="Nous accueillons particulièrement les étudiants et ressortissants subsahariens, souvent mal desservis par le marché classique."
          />
          <Valeur
            icon={Accessibility}
            titre="Accessibilité"
            texte="Une plateforme simple, mobile-first, pensée pour tous les niveaux d'aisance numérique."
          />
          <Valeur
            icon={Languages}
            titre="Proximité"
            texte="Une interface en français, langue commune, et un contact direct avec les propriétaires."
          />
        </div>

        <div className="mt-14 rounded-3xl border border-primary-100 bg-white p-10 text-center shadow-soft">
          <h3 className="text-xl font-bold text-primary-950">
            Vous cherchez un logement ?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-gray-600">
            Parcourez nos annonces vérifiées et contactez directement les
            propriétaires.
          </p>
          <Link to="/annonces" className="btn-primary mt-5">
            Voir les annonces
          </Link>
        </div>
      </section>
    </div>
  )
}

function Valeur({ icon: Icon, titre, texte }) {
  return (
    <div className="card p-7">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-950 text-secondary-400">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 font-semibold text-primary-950">{titre}</h3>
      <p className="mt-2 text-sm text-gray-500">{texte}</p>
    </div>
  )
}
