import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '../utils/helpers'
import Logo from './Logo'
import InstallButton from './InstallButton'

const LIENS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/annonces', label: 'Annonces' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Propriétaires' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    cn(
      'relative px-3 py-2 text-sm font-medium transition-colors',
      'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-secondary after:transition-transform after:duration-300',
      isActive
        ? 'text-primary-950 after:scale-x-100'
        : 'text-primary-900/60 hover:text-primary-950 after:scale-x-0 hover:after:scale-x-100'
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled || open
          ? 'border-b border-primary-100/70 bg-white/85 shadow-[0_1px_0_rgba(3,12,43,0.02)] backdrop-blur-xl'
          : 'border-b border-transparent bg-ivory/60 backdrop-blur'
      )}
    >
      <nav className="container-page flex h-[72px] items-center sm:h-20 justify-between">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)} aria-label="RapidImmo — accueil">
          <Logo className="h-11 sm:h-14" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {LIENS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <InstallButton className="ml-4 !px-4 !py-2.5 text-sm" />
          <Link to="/annonces" className="btn-primary group ml-2 !py-2.5 text-sm">
            Trouver un logement
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary-900 hover:bg-primary-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-primary-100/70 bg-white md:hidden">
          <div className="container-page space-y-1 py-4">
            {LIENS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-950'
                      : 'text-primary-900/70 hover:bg-primary-50/60'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/annonces"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full !py-3"
            >
              Trouver un logement <ArrowRight size={16} />
            </Link>
            <InstallButton className="mt-2 w-full !py-3" onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}
