import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  Save,
} from 'lucide-react'
import {
  getAnnonce,
  creerAnnonce,
  modifierAnnonce,
} from '../../services/annoncesService'
import { uploadPhoto, supprimerPhoto } from '../../services/storageService'
import {
  VILLES,
  TYPES_BIEN,
  GENRES,
  EQUIPEMENTS,
  MAX_PHOTOS,
} from '../../utils/constants'
import { cn } from '../../utils/helpers'

export default function FormulaireAnnonce() {
  const { id } = useParams()
  const editMode = Boolean(id)
  const navigate = useNavigate()

  const [chargement, setChargement] = useState(editMode)
  const [enregistrement, setEnregistrement] = useState(false)
  const [erreur, setErreur] = useState(null)

  // Photos : { url, path } — gérées hors react-hook-form
  const [photos, setPhotos] = useState([])
  const [photoPrincipale, setPhotoPrincipale] = useState('')
  const [uploadEnCours, setUploadEnCours] = useState(false)
  const [equipements, setEquipements] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titre: '',
      type: 'appartement',
      ville: '',
      quartier: '',
      surface: '',
      nbPieces: '',
      etage: '',
      meuble: 'true',
      prix: '',
      caution: '',
      genreAccepte: 'mixte',
      etudiantsAcceptes: true,
      disponibiliteImmediate: true,
      dateDisponibilite: '',
      description: '',
      statut: 'active',
      proprietaireNom: '',
      proprietaireWhatsapp: '',
      proprietaireLangues: '',
    },
  })

  const dispoImmediate = watch('disponibiliteImmediate')

  useEffect(() => {
    if (!editMode) return
    getAnnonce(id)
      .then((a) => {
        if (!a) {
          setErreur('Annonce introuvable.')
          return
        }
        reset({
          titre: a.titre || '',
          type: a.type || 'appartement',
          ville: a.ville || '',
          quartier: a.quartier || '',
          surface: a.surface ?? '',
          nbPieces: a.nbPieces ?? '',
          etage: a.etage ?? '',
          meuble: String(a.meuble ?? true),
          prix: a.prix ?? '',
          caution: a.caution ?? '',
          genreAccepte: a.genreAccepte || 'mixte',
          etudiantsAcceptes: a.etudiantsAcceptes ?? true,
          disponibiliteImmediate: a.disponibiliteImmediate ?? true,
          dateDisponibilite: a.dateDisponibilite || '',
          description: a.description || '',
          statut: a.statut || 'active',
          proprietaireNom: a.proprietaire?.nom || '',
          proprietaireWhatsapp: a.proprietaire?.whatsapp || '',
          proprietaireLangues: (a.proprietaire?.langues || []).join(', '),
        })
        const ph = (a.photos || []).map((url) => ({ url, path: null }))
        setPhotos(ph)
        setPhotoPrincipale(a.photoprincipale || a.photos?.[0] || '')
        setEquipements(a.equipements || [])
      })
      .catch(() => setErreur('Erreur de chargement.'))
      .finally(() => setChargement(false))
  }, [id, editMode, reset])

  function toggleEquipement(v) {
    setEquipements((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // permet de re-sélectionner le même fichier
    if (!files.length) return
    if (photos.length + files.length > MAX_PHOTOS) {
      setErreur(`Maximum ${MAX_PHOTOS} photos.`)
      return
    }
    setErreur(null)
    setUploadEnCours(true)
    try {
      for (const file of files) {
        const { url, path } = await uploadPhoto(file)
        setPhotos((prev) => {
          const next = [...prev, { url, path }]
          return next
        })
        setPhotoPrincipale((prev) => prev || url)
      }
    } catch (err) {
      setErreur(err.message || "Échec de l'upload d'une image.")
    } finally {
      setUploadEnCours(false)
    }
  }

  async function retirerPhoto(photo) {
    // Supprime du Storage uniquement les photos uploadées dans cette session (path connu)
    if (photo.path) await supprimerPhoto(photo.url)
    setPhotos((prev) => prev.filter((p) => p.url !== photo.url))
    setPhotoPrincipale((prev) => {
      if (prev !== photo.url) return prev
      const reste = photos.filter((p) => p.url !== photo.url)
      return reste[0]?.url || ''
    })
  }

  async function onSubmit(data) {
    setErreur(null)
    if (photos.length === 0) {
      setErreur('Ajoutez au moins une photo.')
      return
    }
    setEnregistrement(true)

    const urls = photos.map((p) => p.url)
    const payload = {
      titre: data.titre.trim(),
      type: data.type,
      ville: data.ville,
      quartier: data.quartier.trim(),
      surface: data.surface ? Number(data.surface) : null,
      nbPieces: data.nbPieces ? Number(data.nbPieces) : null,
      etage: data.etage !== '' ? Number(data.etage) : null,
      meuble: data.meuble === 'true',
      prix: Number(data.prix),
      caution: data.caution ? Number(data.caution) : null,
      equipements,
      genreAccepte: data.genreAccepte,
      etudiantsAcceptes: Boolean(data.etudiantsAcceptes),
      disponibiliteImmediate: Boolean(data.disponibiliteImmediate),
      dateDisponibilite: data.disponibiliteImmediate
        ? null
        : data.dateDisponibilite || null,
      description: data.description.trim(),
      photos: urls,
      photoprincipale: photoPrincipale || urls[0],
      proprietaire: {
        nom: data.proprietaireNom.trim(),
        whatsapp: data.proprietaireWhatsapp.trim(),
        langues: data.proprietaireLangues
          ? data.proprietaireLangues.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      },
      statut: data.statut,
    }

    try {
      if (editMode) {
        await modifierAnnonce(id, payload)
      } else {
        await creerAnnonce(payload)
      }
      navigate('/admin/annonces')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[annonce] enregistrement', err)
      setErreur(
        err?.code === 'permission-denied'
          ? 'Accès refusé par Firestore : les règles de sécurité ne sont pas publiées (Firestore → Règles → Publier).'
          : `Enregistrement impossible (${err?.code || err?.message || 'erreur inconnue'}).`
      )
      setEnregistrement(false)
    }
  }

  if (chargement) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin" /> <span className="ml-2">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/annonces"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} /> Retour à la liste
      </Link>

      <h1 className="mb-6 text-3xl font-bold text-primary-950">
        {editMode ? "Modifier l'annonce" : 'Nouvelle annonce'}
      </h1>

      {erreur && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={18} /> {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Informations de base */}
        <Section titre="Informations de base">
          <Champ label="Titre de l'annonce *" erreur={errors.titre}>
            <input
              className="input"
              placeholder="Ex : Studio meublé proche université Hassan II"
              {...register('titre', { required: 'Le titre est requis' })}
            />
          </Champ>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Type de bien *">
              <select className="input" {...register('type')}>
                {TYPES_BIEN.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Champ>
            <Champ label="Ville *" erreur={errors.ville}>
              <select
                className="input"
                {...register('ville', { required: 'La ville est requise' })}
              >
                <option value="">Choisir…</option>
                {VILLES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Champ>
          </div>
          <Champ label="Quartier / adresse approximative">
            <input className="input" placeholder="Ex : Aïn Chock" {...register('quartier')} />
          </Champ>
        </Section>

        {/* Détails du logement */}
        <Section titre="Détails du logement">
          <div className="grid gap-4 sm:grid-cols-3">
            <Champ label="Surface (m²)">
              <input type="number" min="0" className="input" {...register('surface')} />
            </Champ>
            <Champ label="Nombre de pièces">
              <input type="number" min="0" className="input" {...register('nbPieces')} />
            </Champ>
            <Champ label="Étage">
              <input type="number" className="input" {...register('etage')} />
            </Champ>
          </div>
          <Champ label="Meublé">
            <select className="input" {...register('meuble')}>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </Champ>
          <div>
            <span className="label">Équipements</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {EQUIPEMENTS.map((eq) => (
                <label
                  key={eq.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    equipements.includes(eq.value)
                      ? 'border-primary bg-primary-50 text-primary'
                      : 'border-gray-200 text-gray-600'
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={equipements.includes(eq.value)}
                    onChange={() => toggleEquipement(eq.value)}
                  />
                  {eq.label}
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* Conditions */}
        <Section titre="Conditions">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Prix mensuel (MAD) *" erreur={errors.prix}>
              <input
                type="number"
                min="0"
                className="input"
                {...register('prix', {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Prix invalide' },
                })}
              />
            </Champ>
            <Champ label="Caution (MAD) — vide si aucune">
              <input type="number" min="0" className="input" {...register('caution')} />
            </Champ>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Genre accepté">
              <select className="input" {...register('genreAccepte')}>
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </Champ>
            <Champ label="Étudiants acceptés">
              <label className="flex h-[42px] items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('etudiantsAcceptes')}
                />
                Oui, étudiants bienvenus
              </label>
            </Champ>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Disponibilité">
              <label className="flex h-[42px] items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('disponibiliteImmediate')}
                />
                Disponible immédiatement
              </label>
            </Champ>
            {!dispoImmediate && (
              <Champ label="Date de disponibilité">
                <input type="date" className="input" {...register('dateDisponibilite')} />
              </Champ>
            )}
          </div>
        </Section>

        {/* Contact propriétaire */}
        <Section titre="Contact propriétaire">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Nom / pseudonyme *" erreur={errors.proprietaireNom}>
              <input
                className="input"
                placeholder="Ex : Mohammed A."
                {...register('proprietaireNom', { required: 'Le nom est requis' })}
              />
            </Champ>
            <Champ label="Numéro WhatsApp *" erreur={errors.proprietaireWhatsapp}>
              <input
                className="input"
                placeholder="+2126XXXXXXXX"
                {...register('proprietaireWhatsapp', {
                  required: 'Le WhatsApp est requis',
                })}
              />
            </Champ>
          </div>
          <Champ label="Langues parlées (séparées par des virgules)">
            <input className="input" placeholder="Français, Arabe" {...register('proprietaireLangues')} />
          </Champ>
        </Section>

        {/* Médias */}
        <Section titre={`Photos (${photos.length}/${MAX_PHOTOS})`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <div
                key={p.url}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-xl border-2',
                  photoPrincipale === p.url ? 'border-primary' : 'border-transparent'
                )}
              >
                <img src={p.url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setPhotoPrincipale(p.url)}
                    title="Photo principale"
                    className="rounded bg-white/90 p-1 text-primary"
                  >
                    <Star size={14} fill={photoPrincipale === p.url ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => retirerPhoto(p)}
                    title="Supprimer"
                    className="rounded bg-white/90 p-1 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {photoPrincipale === p.url && (
                  <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Principale
                  </span>
                )}
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary">
                {uploadEnCours ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <Upload size={22} />
                )}
                <span className="text-xs">{uploadEnCours ? 'Envoi…' : 'Ajouter'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFiles}
                  disabled={uploadEnCours}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Jusqu'à {MAX_PHOTOS} images, 5 Mo max chacune. Cliquez sur l'étoile pour
            définir la photo principale.
          </p>
        </Section>

        {/* Description & statut */}
        <Section titre="Description & publication">
          <Champ label="Description *" erreur={errors.description}>
            <textarea
              rows={5}
              className="input"
              placeholder="Décrivez le logement, le quartier, l'ambiance…"
              {...register('description', {
                required: 'La description est requise',
                minLength: { value: 20, message: 'Au moins 20 caractères' },
              })}
            />
          </Champ>
          <Champ label="Statut">
            <select className="input" {...register('statut')}>
              <option value="active">Active (visible par le public)</option>
              <option value="inactive">Inactive (masquée)</option>
              <option value="archivee">Archivée</option>
            </select>
          </Champ>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/annonces" className="btn-outline">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={enregistrement || uploadEnCours}
            className="btn-primary"
          >
            {enregistrement ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {enregistrement ? 'Enregistrement…' : editMode ? 'Enregistrer' : "Créer l'annonce"}
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ titre, children }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-lg font-semibold text-primary-950">{titre}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Champ({ label, erreur, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {erreur && <p className="mt-1 text-xs text-red-500">{erreur.message}</p>}
    </div>
  )
}
