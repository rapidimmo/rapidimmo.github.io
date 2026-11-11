// Chargement des annonces actives + filtrage/tri temps réel côté client.
import { useEffect, useMemo, useState } from 'react'
import { getAnnoncesActives } from '../services/annoncesService'

const FILTRES_DEFAUT = {
  recherche: '',
  ville: '',
  type: '',
  prixMin: '',
  prixMax: '',
  meuble: '', // '', 'oui', 'non'
  genre: '',
  dispoImmediate: false,
  tri: 'recent',
}

export function useAnnonces() {
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtres, setFiltres] = useState(FILTRES_DEFAUT)

  useEffect(() => {
    let actif = true
    setLoading(true)
    getAnnoncesActives()
      .then((data) => {
        if (actif) setAnnonces(data)
      })
      .catch((e) => {
        if (actif) setError(e)
      })
      .finally(() => {
        if (actif) setLoading(false)
      })
    return () => {
      actif = false
    }
  }, [])

  const resultats = useMemo(() => {
    let list = [...annonces]
    const f = filtres

    if (f.recherche.trim()) {
      const q = f.recherche.toLowerCase()
      list = list.filter(
        (a) =>
          a.titre?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.quartier?.toLowerCase().includes(q) ||
          a.ville?.toLowerCase().includes(q)
      )
    }
    if (f.ville) list = list.filter((a) => a.ville === f.ville)
    if (f.type) list = list.filter((a) => a.type === f.type)
    if (f.genre) list = list.filter((a) => a.genreAccepte === f.genre)
    if (f.prixMin !== '')
      list = list.filter((a) => Number(a.prix) >= Number(f.prixMin))
    if (f.prixMax !== '')
      list = list.filter((a) => Number(a.prix) <= Number(f.prixMax))
    if (f.meuble === 'oui') list = list.filter((a) => a.meuble === true)
    if (f.meuble === 'non') list = list.filter((a) => a.meuble === false)
    if (f.dispoImmediate)
      list = list.filter((a) => a.disponibiliteImmediate === true)

    switch (f.tri) {
      case 'prix_asc':
        list.sort((a, b) => Number(a.prix) - Number(b.prix))
        break
      case 'prix_desc':
        list.sort((a, b) => Number(b.prix) - Number(a.prix))
        break
      default:
        // déjà trié par datePublication desc par Firestore
        break
    }
    return list
  }, [annonces, filtres])

  function updateFiltre(patch) {
    setFiltres((prev) => ({ ...prev, ...patch }))
  }

  function resetFiltres() {
    setFiltres(FILTRES_DEFAUT)
  }

  return {
    annonces,
    resultats,
    loading,
    error,
    filtres,
    updateFiltre,
    resetFiltres,
    total: resultats.length,
  }
}
