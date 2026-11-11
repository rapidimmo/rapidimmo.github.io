// Initialisation Firebase (Firestore, Auth). Les photos sont sur Cloudinary.
// Les credentials proviennent des variables d'environnement Vite (build-time).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Avertissement clair en dev si la config n'est pas renseignée.
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'REMPLACER') {
  // eslint-disable-next-line no-console
  console.warn(
    '[RapidImmo] Configuration Firebase absente ou incomplète. ' +
      'Renseignez les variables VITE_FIREBASE_* dans .env.local.'
  )
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
