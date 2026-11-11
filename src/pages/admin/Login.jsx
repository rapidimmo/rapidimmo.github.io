import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'

// Traduction des codes d'erreur Firebase Auth les plus courants
function messageErreur(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email ou mot de passe incorrect.'
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.'
    case 'auth/invalid-email':
      return 'Adresse email invalide.'
    default:
      return 'Connexion impossible. Réessayez.'
  }
}

export default function Login() {
  const { isAuthenticated, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erreur, setErreur] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const from = location.state?.from?.pathname || '/admin'

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function onSubmit({ email, password }) {
    setErreur(null)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (e) {
      setErreur(messageErreur(e?.code))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center" aria-label="RapidImmo — accueil">
          <Logo className="h-16" />
        </Link>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-primary-950">Espace administrateur</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connectez-vous pour gérer les annonces.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            {erreur && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={18} /> {erreur}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  className="input pl-9"
                  placeholder="admin@rapidimmo.ma"
                  {...register('email', { required: 'Email requis' })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  className="input pl-9"
                  placeholder="••••••••"
                  {...register('password', { required: 'Mot de passe requis' })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-primary">← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}
