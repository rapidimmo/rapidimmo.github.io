import { useEffect, useState } from 'react'

// L'évènement arrive souvent avant le montage de React : on le capture au plus tôt.
let deferredPrompt = null
const listeners = new Set()
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    listeners.forEach((l) => l())
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    listeners.forEach((l) => l())
  })
}

const estStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

const estIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/**
 * mode : 'prompt' (Android/Chrome/Edge : installation native),
 *        'ios' (Safari iOS : instructions manuelles), ou null (déjà installée / non supporté).
 */
export function useInstallPrompt() {
  const [, force] = useState(0)

  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => listeners.delete(l)
  }, [])

  let mode = null
  if (!estStandalone()) {
    if (deferredPrompt) mode = 'prompt'
    else if (estIOS()) mode = 'ios'
  }

  async function installer() {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    force((n) => n + 1)
    return outcome === 'accepted'
  }

  return { mode, installer }
}
