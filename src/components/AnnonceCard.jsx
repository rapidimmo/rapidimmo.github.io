import { Link } from 'react-router-dom'
import { MapPin, Maximize, BedDouble, Sofa, ArrowUpRight } from 'lucide-react'
import Badge from './Badge'
import { formatPrix, estNouvelle } from '../utils/helpers'
import { typeLabel } from '../utils/constants'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#E3E9F7"/><text x="50%" y="50%" fill="#93A9DE" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle">RapidImmo</text></svg>`
  )

export default function AnnonceCard({ annonce }) {
  const photo = annonce.photoprincipale || annonce.photos?.[0] || PLACEHOLDER
  const nouvelle = estNouvelle(annonce.datePublication)

  return (
    <Link
      to={`/annonces/${annonce.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-primary-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-50">
        <img
          src={photo}
          alt={annonce.titre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-950/25 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant="glass">{typeLabel(annonce.type)}</Badge>
          {nouvelle && <Badge variant="new">Nouveau</Badge>}
        </div>
        <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-primary-950 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-primary-900/45">
          <MapPin size={12} className="shrink-0 text-secondary-600" />
          <span className="line-clamp-1">
            {annonce.quartier ? `${annonce.quartier}, ` : ''}
            {annonce.ville}
          </span>
        </p>
        <h3 className="mt-1.5 line-clamp-1 font-display text-base font-bold text-primary-950">
          {annonce.titre}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-primary-900/55">
          {annonce.surface ? (
            <span className="flex items-center gap-1.5">
              <Maximize size={13} /> {annonce.surface} m²
            </span>
          ) : null}
          {annonce.nbPieces ? (
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} /> {annonce.nbPieces} pièce{annonce.nbPieces > 1 ? 's' : ''}
            </span>
          ) : null}
          {annonce.meuble ? (
            <span className="flex items-center gap-1.5">
              <Sofa size={13} /> Meublé
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-1 border-t border-primary-100/70 pt-4">
            <span className="font-display text-xl font-extrabold text-primary-950">
              {formatPrix(annonce.prix)}
            </span>
            <span className="text-xs text-primary-900/45">/ mois</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
