# Access Gym — Interface d'administration

SPA Vue 3 (Composition API) + Bootstrap 5, connectée à l'API Laravel `access-gym`.

## Démarrage

```powershell
npm install
copy .env.example .env
# Modifiez VITE_API_BASE_URL si votre API Laravel ne tourne pas sur localhost:8000
npm run dev
```

Ouvrez `http://localhost:5173`. Le backend Laravel doit tourner en parallèle (`php artisan serve`), avec `SANCTUM_STATEFUL_DOMAINS` / CORS déjà configurés pour `localhost:5173` (voir guides backend précédents).

## Système de design

- **Palette** : teal profond (`#0f9b8e`, activité/santé) + corail (`#ff6b4a`, énergie/CTA), sur fond neutre clair ou slate profond en sombre — pas de noir pur.
- **Typographie** : *Space Grotesk* (titres), *Inter* (texte/UI), *JetBrains Mono* (chiffres — KPI, tableaux, montants) pour un alignement tabulaire propre sur les données.
- **Signature** : le motif "pulse" (tracé d'activité animé) — logo, favicon, états vides.
- **Mode sombre** : natif via l'attribut `data-bs-theme` de Bootstrap 5.3, tokens dans `src/assets/styles/tokens.css`. Bascule dans la barre supérieure et dans Paramètres, préférence mémorisée + détection `prefers-color-scheme` par défaut.
- Respecte `prefers-reduced-motion`, focus visible partout, contraste vérifié sur les deux modes.

## Architecture

```
src/
  api/            appels HTTP (client axios centralisé + un fichier par domaine)
  components/
    layout/       AppShell, Sidebar (rétractable), Topbar (recherche, notifs, profil)
    ui/           composants réutilisables : DataTable, KpiCard, AgModal, AgDrawer,
                   ToastHost, ConfirmHost, StatusPill, PulseMark
  composables/    useToast, useConfirm — état global léger sans store dédié
  router/         routes avec lazy loading (import() par vue) + garde d'authentification
  stores/         Pinia — auth (session), ui (thème, sidebar)
  views/          une vue par route, groupées par module
```

**Décisions notables :**
- Toutes les vues sont chargées en *lazy loading* (`() => import(...)`) — chaque route génère son propre chunk JS (vérifié au build : `DashboardView`, `UsersView`, etc. sont séparés).
- `DataTable.vue` est générique (colonnes en props, cellules personnalisables via slots nommés `#cell-<clé>`) — à réutiliser pour Abonnements, Paiements, Cours sans dupliquer la logique de tri/recherche/pagination/export CSV.
- `useToast`/`useConfirm` remplacent respectivement les alertes navigateur et `window.confirm` par des composants cohérents avec le design system, appelables depuis n'importe quel composant sans prop-drilling.
- Le token Sanctum est stocké en `localStorage` (simplicité MVP). Pour durcir en production, migrer vers l'authentification Sanctum par cookie de session (`withCredentials` + `/sanctum/csrf-cookie`), déjà préparée côté backend (CORS `supports_credentials: true`).

## État d'avancement

✅ **Construit** : authentification OTP (2 étapes), coquille de layout (sidebar rétractable + responsive, topbar), tableau de bord (KPIs), et **tous les modules métier** :
- Utilisateurs (adhérents/staff, tiroir de détail, activation/désactivation)
- Abonnements (filtre par statut, renouvellement, **création sur place via recherche par téléphone**)
- Paiements (filtres statut + moyen, total confirmé)
- Cours (planning, création via modale avec validation temps réel, indicateur de remplissage)
- Réservations (filtre par statut, annulation avec confirmation)
- Établissement (informations de la salle, formulaire validé en temps réel)
- Journal d'audit (lecture seule)
- **Marketplace** (boutiques, produits, catégories — réservé au super_admin)
- **Bannières publicitaires** (carrousel d'accueil mobile — réservé au super_admin)
- Paramètres (profil, thème)

Système de design complet (clair/sombre), tous les modules bâtis sur les mêmes composants réutilisables (`DataTable`, `StatusPill`, `AgDrawer`, `AgModal`, `useToast`, `useConfirm`) pour une cohérence totale. Les menus Marketplace/Bannières et leurs routes sont filtrés par rôle (`auth.estSuperAdmin`), à la fois dans la sidebar et dans la garde de navigation.

🔜 **Prochaine étape** : brancher les endpoints backend restants. Chaque module bascule **automatiquement** sur des données de démonstration si son endpoint n'existe pas encore côté API (bandeau orange visible) :

| Module | Endpoint attendu | Statut |
|---|---|---|
| Utilisateurs | `GET /api/adherents`, `GET /api/staff` | à construire |
| Abonnements | `GET /api/abonnements`, `POST /api/abonnements/{id}/renouveler` | à construire |
| Paiements | `GET /api/paiements` | à construire |
| Cours | `GET/POST/PATCH/DELETE /api/cours` | ✅ réel (Phase 2) |
| Réservations | `GET /api/reservations`, `PATCH /api/reservations/{id}` | à construire (staff) |
| Établissement | `GET/PATCH /api/salle` | à construire |
| Journal d'audit | `GET /api/journal-audit` | à construire |
| Marketplace | `GET/POST/PATCH/DELETE /api/marketplace/*` | ✅ réel (Phase 2) |
| Bannières | `GET/POST/PATCH/DELETE /api/bannieres` | ✅ réel (Phase 2) |
| Nouvel abonnement (staff) | `GET /api/staff/adherents/rechercher`, `POST /api/staff/abonnements` | ✅ réel (Phase 2) |
| Liste des salles (sélecteur de formule) | `GET /api/salles` | ✅ réel (Phase 2) |

## Scripts

```powershell
npm run dev       # serveur de développement
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build de production
```
