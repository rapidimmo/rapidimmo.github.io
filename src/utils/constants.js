// Référentiels partagés (filtres publics + formulaire admin)

export const VILLES = [
  'Casablanca',
  'Rabat',
  'Fès',
  'Marrakech',
  'Oujda',
  'Tanger',
  'Agadir',
  'Meknès',
  'Kénitra',
  'Tétouan',
  'Salé',
  'El Jadida',
]

export const TYPES_BIEN = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'studio', label: 'Studio' },
  { value: 'chambre', label: 'Chambre' },
  { value: 'colocation', label: 'Colocation' },
]

export const GENRES = [
  { value: 'mixte', label: 'Mixte' },
  { value: 'femmes', label: 'Femmes uniquement' },
  { value: 'hommes', label: 'Hommes uniquement' },
]

// clé = valeur stockée en base ; label = affichage ; icon = nom d'icône lucide
export const EQUIPEMENTS = [
  { value: 'wifi', label: 'Wi-Fi', icon: 'Wifi' },
  { value: 'cuisine_equipee', label: 'Cuisine équipée', icon: 'CookingPot' },
  { value: 'eau_chaude', label: 'Eau chaude', icon: 'Droplets' },
  { value: 'climatisation', label: 'Climatisation', icon: 'Snowflake' },
  { value: 'parking', label: 'Parking', icon: 'Car' },
  { value: 'gardien', label: 'Gardien', icon: 'ShieldCheck' },
  { value: 'ascenseur', label: 'Ascenseur', icon: 'ArrowUpDown' },
  { value: 'terrasse', label: 'Terrasse', icon: 'Trees' },
]

export const STATUTS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archivee', label: 'Archivée' },
]

export const TRI_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'prix_asc', label: 'Prix croissant' },
  { value: 'prix_desc', label: 'Prix décroissant' },
]

export const PRIX_MIN = 0
export const PRIX_MAX = 10000

export const MAX_PHOTOS = 8
export const MAX_PHOTO_SIZE_MO = 5

// Helpers de lookup
export const typeLabel = (v) => TYPES_BIEN.find((t) => t.value === v)?.label || v
export const genreLabel = (v) => GENRES.find((g) => g.value === v)?.label || v
export const equipementLabel = (v) =>
  EQUIPEMENTS.find((e) => e.value === v)?.label || v
