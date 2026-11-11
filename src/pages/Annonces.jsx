import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useAnnonces } from '../hooks/useAnnonces'
import {
  FiltresPanneau,
  FiltresToolbar,
  FiltresMobile,
} from '../components/Filtres'
import AnnonceCard from '../components/AnnonceCard'
import { SkeletonGrid } from '../components/SkeletonCard'

export default function Annonces() {
  const { resultats, loading, error, filtres, updateFiltre, resetFiltres, total } =
    useAnnonces()
  const [searchParams] = useSearchParams()
  const [openMobile, setOpenMobile] = useState(false)

  // Amorce les filtres depuis les query params (recherche depuis l'accueil)
  useEffect(() => {
    const patch = {}
    if (searchParams.get('ville')) patch.ville = searchParams.get('ville')
    if (searchParams.get('type')) patch.type = searchParams.get('type')
    if (searchParams.get('prixMax')) patch.prixMax = searchParams.get('prixMax')
    if (Object.keys(patch).length) updateFiltre(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10">
        <span className="eyebrow">Logements vérifiés</span>
        <h1 className="mt-3 text-3xl font-bold text-primary-950 sm:text-4xl">
          Trouvez votre prochain chez-vous.
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Panneau filtres desktop */}
        <aside className="hidden lg:block">
          <div className="card sticky top-20 p-5">
            <h3 className="mb-4 font-semibold text-primary-950">Filtres</h3>
            <FiltresPanneau
              filtres={filtres}
              updateFiltre={updateFiltre}
              resetFiltres={resetFiltres}
            />
          </div>
        </aside>

        {/* Résultats */}
        <section>
          <FiltresToolbar
            filtres={filtres}
            updateFiltre={updateFiltre}
            total={total}
            onOpenMobile={() => setOpenMobile(true)}
          />

          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
              Une erreur est survenue lors du chargement des annonces.
            </div>
          ) : loading ? (
            <SkeletonGrid count={6} />
          ) : resultats.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
              <SearchX size={40} className="text-gray-300" />
              <p className="mt-3 font-medium text-gray-700">
                Aucun logement ne correspond à vos critères
              </p>
              <p className="text-sm text-gray-400">
                Essayez d'élargir votre recherche.
              </p>
              <button onClick={resetFiltres} className="btn-outline mt-4">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {resultats.map((a) => (
                <AnnonceCard key={a.id} annonce={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      <FiltresMobile
        open={openMobile}
        onClose={() => setOpenMobile(false)}
        filtres={filtres}
        updateFiltre={updateFiltre}
        resetFiltres={resetFiltres}
        total={total}
      />
    </div>
  )
}
