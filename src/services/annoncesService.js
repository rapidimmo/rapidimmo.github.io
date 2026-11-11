// CRUD Firestore pour la collection `annonces`
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'annonces'
const annoncesRef = collection(db, COL)

/**
 * Récupère les annonces actives (module public).
 * Le filtrage fin (type, prix, meublé, genre…) est fait côté client
 * dans le hook useAnnonces pour rester dans le tier gratuit Firestore
 * et offrir un filtrage temps réel sans index composés multiples.
 */
export async function getAnnoncesActives({ max = 200 } = {}) {
  // Pas d'orderBy côté Firestore : where + orderBy sur deux champs exigerait
  // un index composite. Le tri par date se fait ici (volume modeste).
  const q = query(annoncesRef, where('statut', '==', 'active'), fbLimit(500))
  const snap = await getDocs(q)
  const ts = (v) => v?.toMillis?.() ?? (v ? new Date(v).getTime() : 0)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => ts(b.datePublication) - ts(a.datePublication))
    .slice(0, max)
}

/** Récupère TOUTES les annonces (module admin, tous statuts). */
export async function getAllAnnonces({ max = 500 } = {}) {
  const q = query(annoncesRef, orderBy('dateMiseAJour', 'desc'), fbLimit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Récupère une annonce par son id. */
export async function getAnnonce(id) {
  const ref = doc(db, COL, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/** Annonces similaires : même ville, hors annonce courante. */
export async function getAnnoncesSimilaires(ville, excludeId, max = 3) {
  const q = query(
    annoncesRef,
    where('statut', '==', 'active'),
    where('ville', '==', ville),
    fbLimit(max + 1)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a) => a.id !== excludeId)
    .slice(0, max)
}

/** Crée une annonce. Renvoie l'id généré. */
export async function creerAnnonce(data) {
  const payload = {
    ...data,
    datePublication: serverTimestamp(),
    dateMiseAJour: serverTimestamp(),
  }
  const ref = await addDoc(annoncesRef, payload)
  return ref.id
}

/** Met à jour une annonce. */
export async function modifierAnnonce(id, data) {
  const ref = doc(db, COL, id)
  await updateDoc(ref, { ...data, dateMiseAJour: serverTimestamp() })
}

/** Change uniquement le statut (active/inactive/archivee). */
export async function changerStatut(id, statut) {
  const ref = doc(db, COL, id)
  await updateDoc(ref, { statut, dateMiseAJour: serverTimestamp() })
}

/** Supprime une annonce. */
export async function supprimerAnnonce(id) {
  await deleteDoc(doc(db, COL, id))
}
