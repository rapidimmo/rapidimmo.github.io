// Upload des photos d'annonces sur Cloudinary (offre gratuite, sans carte bancaire).
// Upload "unsigned" : seul un upload preset public est utilisé côté navigateur,
// aucun secret API n'est exposé.
import { MAX_PHOTO_SIZE_MO } from '../utils/constants'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const DOSSIER = 'rapidimmo/annonces'

/**
 * Upload une image et renvoie son URL publique (optimisée : format + qualité auto).
 * @param {File} file
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadPhoto(file) {
  if (!file) throw new Error('Aucun fichier fourni')
  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image')
  }
  const tailleMo = file.size / (1024 * 1024)
  if (tailleMo > MAX_PHOTO_SIZE_MO) {
    throw new Error(`Image trop lourde (max ${MAX_PHOTO_SIZE_MO} Mo)`)
  }
  if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'REMPLACER') {
    throw new Error(
      'Cloudinary non configuré : renseignez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET.'
    )
  }

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', DOSSIER)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form }
  )
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error?.message || "Échec de l'upload de l'image.")
  }

  // f_auto,q_auto : Cloudinary sert du WebP/AVIF compressé selon le navigateur
  const url = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
  return { url, path: data.public_id }
}

/**
 * Suppression d'une photo.
 * En upload "unsigned", Cloudinary n'autorise pas la suppression depuis le
 * navigateur (elle exige le secret API). La photo est donc simplement retirée
 * de l'annonce ; les images orphelines peuvent être nettoyées depuis la
 * Media Library Cloudinary (dossier rapidimmo/annonces).
 */
export async function supprimerPhoto() {
  // no-op volontaire
}
