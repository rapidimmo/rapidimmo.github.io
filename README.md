# RapidImmo

Plateforme web de recherche de logements vérifiés au Maroc, pensée pour les
étudiants et les nouveaux arrivants. Application 100 % statique (React + Vite)
déployable sur **GitHub Pages**, avec Firebase (Firestore, Auth) comme
back‑end serverless, Cloudinary pour les photos et EmailJS pour les notifications.

## 🧱 Stack technique

| Couche | Techno |
|---|---|
| UI | React 18 + Vite |
| Styles | Tailwind CSS |
| Routage | React Router v6 (`HashRouter`) |
| Base de données | Firebase Firestore |
| Authentification | Firebase Authentication (email/mot de passe) |
| Stockage photos | Cloudinary (upload unsigned, offre gratuite) |
| Emails | EmailJS |
| Icônes | Lucide React |
| Formulaires | React Hook Form |
| CI/CD | GitHub Actions → GitHub Pages |

## 🚀 Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseignez vos valeurs Firebase / EmailJS
npm run dev                  # http://localhost:5173
```

> Sans configuration Firebase valide, l'application se lance mais les listes
> d'annonces restent vides (un avertissement s'affiche dans la console).

### Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (`/dist`) |
| `npm run preview` | Prévisualise le build |

## 🔥 Configuration Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com).
2. **Firestore Database** → créez la base (mode production).
3. **Authentication** → activez le fournisseur **E‑mail/Mot de passe**, puis
   créez un utilisateur admin (Authentication → Users → *Add user*).
4. **Paramètres du projet → Vos applications → Web** : copiez la config dans
   `.env.local` (voir `.env.example`).
5. Déployez les règles Firestore fournies ([`firestore.rules`](./firestore.rules)),
   via la console (onglet *Règles*) ou avec la CLI Firebase :
   ```bash
   firebase deploy --only firestore:rules
   ```

> Firebase Storage n'est **pas** utilisé (il exige le forfait Blaze) ;
> `storage.rules` n'est conservé qu'au cas où vous y reviendriez.

## 🖼️ Configuration Cloudinary (photos)

1. Créez un compte gratuit sur [cloudinary.com](https://cloudinary.com) (sans carte).
2. Notez le **Cloud name** affiché sur le Dashboard.
3. **Settings → Upload → Upload presets → Add upload preset** :
   *Signing mode* = **Unsigned**, enregistrez et notez le nom du preset.
4. Renseignez `VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET`
   dans `.env.local` (et dans les secrets GitHub pour le déploiement).

> En mode unsigned, la suppression d'images n'est pas possible depuis le
> navigateur : retirer une photo l'enlève de l'annonce, et les images orphelines
> se nettoient depuis la *Media Library* Cloudinary (dossier `rapidimmo/annonces`).

### Modèle de données

**Collection `annonces`** — voir le cahier des charges §4.1
(champs `titre`, `type`, `ville`, `prix`, `equipements[]`, `photos[]`,
`proprietaire{}`, `statut`, `datePublication`, `dateMiseAJour`…).

**Collection `messages`** — formulaires propriétaires
(`nom`, `telephone`, `ville`, `typeBien`, `prix`, `description`, `lu`, `archive`,
`dateReception`).

> Index conseillés (Firestore les proposera automatiquement au premier appel) :
> `annonces` sur `(statut ==, datePublication desc)` et `(statut ==, ville ==)`.

## ✉️ Configuration EmailJS (optionnelle)

1. Créez un compte sur [emailjs.com](https://www.emailjs.com) et un service email.
2. Créez un template avec les variables : `from_nom`, `telephone`, `ville`,
   `type_bien`, `prix`, `description`, `date`.
3. Renseignez `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
   `VITE_EMAILJS_PUBLIC_KEY` dans `.env.local`.

> Les messages sont **toujours** enregistrés dans Firestore (visibles dans
> l'espace admin) ; l'email n'est qu'une notification secondaire.

## 🔐 Espace administrateur

- URL : `#/admin/login`
- Connexion avec l'utilisateur créé dans Firebase Auth.
- Fonctionnalités : tableau de bord, CRUD annonces, upload photos, gestion des
  messages propriétaires.

## 📦 Déploiement sur GitHub Pages

1. Poussez le code sur GitHub.
2. La configuration publique (Firebase, Cloudinary, base path) est dans
   [`.env.production`](./.env.production) — aucun secret GitHub n'est nécessaire.
   `VITE_BASE_PATH` doit valoir `/<nom-du-repo>/` (ou `/` pour un domaine personnalisé).
3. **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. Chaque `push` sur `main` déclenche le workflow
   [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

> Le routage utilise `HashRouter` (`/#/...`) pour éviter les erreurs 404 au
> rechargement, GitHub Pages ne gérant pas la réécriture d'URL côté serveur.

## 🗂️ Structure du projet

```
src/
├── components/   # Navbar, Footer, AnnonceCard, Filtres, PhotoCarousel…
├── pages/        # Accueil, Annonces, AnnonceDetail, APropos, Contact
│   └── admin/    # Login, Dashboard, GestionAnnonces, FormulaireAnnonce, Messages
├── hooks/        # useAnnonces, useAuth
├── services/     # firebase, annoncesService, storageService, messagesService, emailService
├── context/      # AuthContext
└── utils/        # constants, helpers
```

## 🔒 Sécurité

- Credentials Firebase injectés au build via variables d'environnement / GitHub Secrets.
- Écriture Firestore réservée aux admins authentifiés (règles fournies).
- Numéros WhatsApp masqués jusqu'au clic (anti‑scraping).
- Validation des formulaires côté client (React Hook Form).

---

Fait pour RapidImmo · Version 1.0
