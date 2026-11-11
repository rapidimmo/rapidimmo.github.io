import { useState } from 'react'
import { MessageCircle, Phone, Eye } from 'lucide-react'
import { whatsappLink, masquerNumero } from '../utils/helpers'

// Bouton de contact propriétaire.
// Le numéro reste masqué jusqu'au clic (protection anti-scraping, cf. cahier des charges).
export default function WhatsAppButton({ numero, titreAnnonce = '' }) {
  const [revele, setRevele] = useState(false)
  const message = `Bonjour, je suis intéressé(e) par votre annonce "${titreAnnonce}" sur RapidImmo.`

  if (!numero) return null

  if (!revele) {
    return (
      <button onClick={() => setRevele(true)} className="btn-primary w-full !py-3">
        <Eye size={18} />
        Afficher le contact
        <span className="font-normal text-white/60">{masquerNumero(numero)}</span>
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <a
        href={whatsappLink(numero, message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp w-full !py-3"
      >
        <MessageCircle size={18} />
        Contacter sur WhatsApp
      </a>
      <a href={`tel:${numero}`} className="btn-outline w-full">
        <Phone size={16} />
        {numero}
      </a>
    </div>
  )
}
