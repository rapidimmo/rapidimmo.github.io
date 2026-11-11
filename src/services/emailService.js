// Notification email à l'admin via EmailJS (aucun backend requis)
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function emailConfigure() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) && PUBLIC_KEY !== 'REMPLACER'
}

/**
 * Envoie une notification à l'admin avec le contenu du formulaire propriétaire.
 * Les clés doivent correspondre aux variables du template EmailJS.
 */
export async function envoyerNotificationProprietaire(data) {
  if (!emailConfigure()) {
    throw new Error('EmailJS non configuré (VITE_EMAILJS_*).')
  }
  const params = {
    from_nom: data.nom,
    telephone: data.telephone,
    ville: data.ville,
    type_bien: data.typeBien,
    prix: data.prix,
    description: data.description,
    date: new Date().toLocaleString('fr-FR'),
  }
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY })
}
