import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Send, AlertCircle } from 'lucide-react'
import { creerMessage } from '../services/messagesService'
import {
  envoyerNotificationProprietaire,
  emailConfigure,
} from '../services/emailService'
import { VILLES, TYPES_BIEN } from '../utils/constants'

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function onSubmit(data) {
    setErreur(null)
    try {
      const payload = {
        nom: data.nom.trim(),
        telephone: data.telephone.trim(),
        ville: data.ville,
        typeBien: data.typeBien,
        prix: data.prix ? Number(data.prix) : null,
        description: data.description.trim(),
      }
      // 1) Persistance en base (source de vérité, visible dans l'admin)
      await creerMessage(payload)
      // 2) Notification email best-effort (ne bloque pas si non configuré)
      if (emailConfigure()) {
        try {
          await envoyerNotificationProprietaire(payload)
        } catch {
          /* la notification email est secondaire */
        }
      }
      setEnvoye(true)
      reset()
    } catch (e) {
      setErreur(
        "L'envoi a échoué. Vérifiez votre connexion et réessayez."
      )
    }
  }

  if (envoye) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-primary" />
        <h1 className="mt-4 text-3xl font-bold text-primary-950">
          Merci ! Votre demande a bien été envoyée.
        </h1>
        <p className="mt-2 text-gray-500">
          Notre équipe vous recontacte rapidement pour publier votre annonce.
        </p>
        <button onClick={() => setEnvoye(false)} className="btn-outline mt-6">
          Envoyer une autre annonce
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <span className="eyebrow">Propriétaires</span>
        <h1 className="mt-3 text-3xl font-bold text-primary-950 sm:text-4xl">
          Publier une annonce
        </h1>
        <p className="mt-2 text-gray-500">
          Vous êtes propriétaire ? Remplissez ce formulaire, notre équipe vous
          recontacte pour mettre en ligne votre logement — gratuitement.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card mt-8 space-y-5 p-6"
        noValidate
      >
        {erreur && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={18} /> {erreur}
          </div>
        )}

        <div>
          <label className="label">Nom complet *</label>
          <input
            className="input"
            placeholder="Ex : Mohammed A."
            {...register('nom', { required: 'Le nom est requis' })}
          />
          {errors.nom && <Erreur msg={errors.nom.message} />}
        </div>

        <div>
          <label className="label">Téléphone / WhatsApp *</label>
          <input
            className="input"
            placeholder="+212 6XX XX XX XX"
            {...register('telephone', {
              required: 'Le téléphone est requis',
              pattern: {
                value: /^[+]?[\d\s()-]{8,}$/,
                message: 'Numéro invalide',
              },
            })}
          />
          {errors.telephone && <Erreur msg={errors.telephone.message} />}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Ville *</label>
            <select
              className="input"
              defaultValue=""
              {...register('ville', { required: 'La ville est requise' })}
            >
              <option value="" disabled>
                Choisir…
              </option>
              {VILLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.ville && <Erreur msg={errors.ville.message} />}
          </div>
          <div>
            <label className="label">Type de bien *</label>
            <select
              className="input"
              defaultValue=""
              {...register('typeBien', { required: 'Le type est requis' })}
            >
              <option value="" disabled>
                Choisir…
              </option>
              {TYPES_BIEN.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.typeBien && <Erreur msg={errors.typeBien.message} />}
          </div>
        </div>

        <div>
          <label className="label">Prix mensuel souhaité (MAD)</label>
          <input
            type="number"
            min="0"
            className="input"
            placeholder="Ex : 2500"
            {...register('prix', {
              min: { value: 0, message: 'Prix invalide' },
            })}
          />
          {errors.prix && <Erreur msg={errors.prix.message} />}
        </div>

        <div>
          <label className="label">Description du logement *</label>
          <textarea
            rows={4}
            className="input"
            placeholder="Décrivez brièvement votre logement, le quartier, les équipements…"
            {...register('description', {
              required: 'Une description est requise',
              minLength: { value: 20, message: 'Au moins 20 caractères' },
            })}
          />
          {errors.description && <Erreur msg={errors.description.message} />}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          <Send size={18} />
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
      </form>
    </div>
  )
}

function Erreur({ msg }) {
  return <p className="mt-1 text-xs text-red-500">{msg}</p>
}
