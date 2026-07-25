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

✅ **Construit** : authentification OTP (2 étapes), coquille de layout (sidebar rétractable + responsive, topbar), tableau de bord (KPIs), module Utilisateurs (adhérents/staff, tableau, tiroir de détail, activation/désactivation), page Paramètres, système de design complet (clair/sombre).

🔜 **Prochaines étapes** (même structure, à dupliquer depuis le module Utilisateurs) :
- Module Abonnements (liste, création, renouvellement)
- Module Paiements (historique, filtre par statut/moyen de paiement)
- Module Cours & réservations (calendrier, capacité)
- Module Salles (si multi-établissements) + Journal d'audit
- Endpoints backend correspondants : `GET /api/adherents`, `GET /api/staff`, etc. (actuellement en données de démonstration côté `UsersView.vue`, basculement automatique dès que l'API répond)

## Scripts

```powershell
npm run dev       # serveur de développement
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build de production
```
