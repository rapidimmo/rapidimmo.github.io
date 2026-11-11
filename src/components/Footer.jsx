import { Link } from 'react-router-dom'
import { Mail, Facebook, Instagram, MessageCircle } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const annee = new Date().getFullYear()
  return (
    <footer className="relative mt-12 border-t border-primary-100/70 bg-white">
      {/* filet doré signature */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-secondary to-transparent" />

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-12" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-900/60">
            Des logements vérifiés au Maroc, en toute confiance. Pour étudiants
            et nouveaux arrivants.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-950">Navigation</h4>
          <ul className="space-y-2.5 text-sm text-primary-900/60">
            <li><Link to="/" className="transition-colors hover:text-primary-950">Accueil</Link></li>
            <li><Link to="/annonces" className="transition-colors hover:text-primary-950">Annonces</Link></li>
            <li><Link to="/a-propos" className="transition-colors hover:text-primary-950">À propos</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-primary-950">Publier une annonce</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-950">Contact</h4>
          <ul className="space-y-2.5 text-sm text-primary-900/60">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-secondary-600" /> contact@rapidimmo.ma
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-secondary-600" /> WhatsApp support
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-950">Suivez-nous</h4>
          <div className="flex gap-2.5">
            {[
              { icon: Facebook, label: 'Facebook' },
              { icon: Instagram, label: 'Instagram' },
              { icon: MessageCircle, label: 'WhatsApp' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-100 text-primary-900/70 transition-all hover:border-primary-900 hover:bg-primary-900 hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-100/70">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-900/45 sm:flex-row">
          <p>© {annee} RapidImmo. Tous droits réservés.</p>
          <Link to="/admin/login" className="transition-colors hover:text-primary-950">Espace admin</Link>
        </div>
      </div>
    </footer>
  )
}
