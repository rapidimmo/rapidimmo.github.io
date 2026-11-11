import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Inbox,
  LogOut,
  Home,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import { cn } from '../../utils/helpers'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/annonces', label: 'Annonces', icon: Building2 },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    cn(
      'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-950 text-white shadow-soft before:absolute before:-left-4 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-secondary'
        : 'text-primary-900/60 hover:bg-primary-50 hover:text-primary-950'
    )

  const SidebarContent = (
    <>
      <div className="px-2 pb-6 pt-3">
        <Logo className="h-12" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary-600">
          Espace administration
        </p>
      </div>

      <Link
        to="/admin/annonces/nouvelle"
        onClick={() => setOpen(false)}
        className="btn-secondary mb-6 w-full !py-2.5"
      >
        <PlusCircle size={18} /> Nouvelle annonce
      </Link>

      <nav className="space-y-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            <n.icon size={18} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-primary-100/70 pt-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-700">
            {(user?.email || 'A').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-primary-900/45">Connecté</p>
            <p className="truncate text-xs font-medium text-primary-950">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-primary-900/60 hover:bg-primary-50 hover:text-primary-950"
        >
          <Home size={18} /> Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-ivory">
      {/* Topbar mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-primary-100/70 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="flex items-center gap-2 text-sm font-semibold text-primary-900/60">
          <Logo className="h-9" /> Admin
        </span>
        <button onClick={() => setOpen(true)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-primary-100/70 bg-white p-5 lg:flex">
          {SidebarContent}
        </aside>

        {/* Sidebar mobile (drawer) */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-5">
              <button
                onClick={() => setOpen(false)}
                className="mb-2 self-end text-gray-500"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
              {SidebarContent}
            </aside>
          </div>
        )}

        {/* Contenu */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
