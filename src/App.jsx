import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages publiques
import Accueil from './pages/Accueil'
import Annonces from './pages/Annonces'
import AnnonceDetail from './pages/AnnonceDetail'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Pages admin
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import GestionAnnonces from './pages/admin/GestionAnnonces'
import FormulaireAnnonce from './pages/admin/FormulaireAnnonce'
import Messages from './pages/admin/Messages'

// HashRouter : URLs avec # → compatible GitHub Pages (pas de 404 au refresh).
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Module public */}
          <Route element={<Layout />}>
            <Route path="/" element={<Accueil />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/annonces/:id" element={<AnnonceDetail />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Connexion admin (publique) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Module admin (protégé) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="annonces" element={<GestionAnnonces />} />
            <Route path="annonces/nouvelle" element={<FormulaireAnnonce />} />
            <Route path="annonces/:id/modifier" element={<FormulaireAnnonce />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
