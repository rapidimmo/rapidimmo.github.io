import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sert le site depuis /<repo>/. On rend le base path
// configurable via VITE_BASE_PATH pour rester flexible (repo, domaine custom = '/').
// Par défaut on cible un déploiement de type https://<org>.github.io/rapidimmo/
export default defineConfig(({ mode }) => ({
  // loadEnv lit aussi .env.production / .env.local (process.env ne les contient pas ici)
  base: loadEnv(mode, process.cwd(), 'VITE_').VITE_BASE_PATH || '/rapidimmo/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        // Sépare les grosses dépendances pour accélérer le chargement initial
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}))
