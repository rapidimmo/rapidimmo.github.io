// CRUD Firestore pour la collection `messages` (formulaires propriétaires)
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'messages'
const messagesRef = collection(db, COL)

/** Création publique (formulaire Contact). */
export async function creerMessage(data) {
  const payload = {
    ...data,
    lu: false,
    archive: false,
    dateReception: serverTimestamp(),
  }
  const ref = await addDoc(messagesRef, payload)
  return ref.id
}

/** Liste (admin). */
export async function getMessages() {
  const q = query(messagesRef, orderBy('dateReception', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function marquerLu(id, lu = true) {
  await updateDoc(doc(db, COL, id), { lu })
}

export async function archiverMessage(id, archive = true) {
  await updateDoc(doc(db, COL, id), { archive })
}

export async function supprimerMessage(id) {
  await deleteDoc(doc(db, COL, id))
}
