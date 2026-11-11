import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-secondary">404</p>
      <h1 className="mt-4 text-3xl font-bold text-primary-950">Page introuvable</h1>
      <p className="mt-2 text-gray-500">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Retour à l'accueil
      </Link>
    </div>
  )
}
