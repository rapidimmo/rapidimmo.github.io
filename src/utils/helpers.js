// Fonctions utilitaires transverses

/** Formate un prix en dirhams marocains : 2200 -> "2 200 MAD" */
export function formatPrix(prix) {
  if (prix === null || prix === undefined || prix === '') return '—'
  const n = Number(prix)
  if (Number.isNaN(n)) return '—'
  return `${n.toLocaleString('fr-FR')} MAD`
}

/**
 * Normalise une valeur de date pouvant venir de Firestore
 * (Timestamp), d'un ISO string ou d'un objet Date.
 */
export function toDate(value) {
  if (!value) return null
  if (typeof value?.toDate === 'function') return value.toDate() // Firestore Timestamp
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Formate une date en français : "22 juillet 2026" */
export function formatDate(value) {
  const d = toDate(value)
  if (!d) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Date relative courte : "il y a 3 jours" */
export function timeAgo(value) {
  const d = toDate(value)
  if (!d) return ''
  const diff = Date.now() - d.getTime()
  const jours = Math.floor(diff / 86400000)
  if (jours <= 0) return "aujourd'hui"
  if (jours === 1) return 'hier'
  if (jours < 7) return `il y a ${jours} jours`
  if (jours < 30) return `il y a ${Math.floor(jours / 7)} sem.`
  if (jours < 365) return `il y a ${Math.floor(jours / 30)} mois`
  return `il y a ${Math.floor(jours / 365)} an(s)`
}

/** Une annonce est "nouvelle" si publiée il y a moins de 7 jours */
export function estNouvelle(datePublication) {
  const d = toDate(datePublication)
  if (!d) return false
  return Date.now() - d.getTime() < 7 * 86400000
}

/** Construit un lien WhatsApp cliquable (wa.me) à partir d'un numéro. */
export function whatsappLink(numero, message = '') {
  const clean = String(numero || '').replace(/[^\d]/g, '')
  const base = `https://wa.me/${clean}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Masque un numéro : "+212612345678" -> "+212 6•• •• •• 78" */
export function masquerNumero(numero) {
  const s = String(numero || '')
  if (s.length < 4) return '••••'
  return `${s.slice(0, 4)} •• •• •• ${s.slice(-2)}`
}

/** Concatène des classes conditionnelles (mini clsx) */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Debounce simple pour les filtres en temps réel */
export function debounce(fn, delay = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}
