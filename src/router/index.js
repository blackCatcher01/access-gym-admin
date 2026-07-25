import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/connexion',
    name: 'connexion',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppShell.vue'),
    children: [
      {
        path: '',
        name: 'tableau-de-bord',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { titre: 'Tableau de bord', icone: 'bi-grid-1x2' },
      },
      {
        path: 'utilisateurs',
        name: 'utilisateurs',
        component: () => import('@/views/users/UsersView.vue'),
        meta: { titre: 'Utilisateurs', icone: 'bi-people' },
      },
      {
        path: 'abonnements',
        name: 'abonnements',
        component: () => import('@/views/abonnements/AbonnementsView.vue'),
        meta: { titre: 'Abonnements', icone: 'bi-card-checklist' },
      },
      {
        path: 'paiements',
        name: 'paiements',
        component: () => import('@/views/paiements/PaiementsView.vue'),
        meta: { titre: 'Paiements', icone: 'bi-cash-coin' },
      },
      {
        path: 'cours',
        name: 'cours',
        component: () => import('@/views/cours/CoursView.vue'),
        meta: { titre: 'Cours', icone: 'bi-calendar3' },
      },
      {
        path: 'reservations',
        name: 'reservations',
        component: () => import('@/views/reservations/ReservationsView.vue'),
        meta: { titre: 'Réservations', icone: 'bi-bookmark-check' },
      },
      {
        path: 'etablissement',
        name: 'etablissement',
        component: () => import('@/views/etablissement/EtablissementView.vue'),
        meta: { titre: 'Établissement', icone: 'bi-building' },
      },
      {
        path: 'journal-audit',
        name: 'journal-audit',
        component: () => import('@/views/audit/AuditView.vue'),
        meta: { titre: "Journal d'audit", icone: 'bi-shield-check' },
      },
      {
        path: 'parametres',
        name: 'parametres',
        component: () => import('@/views/settings/SettingsView.vue'),
        meta: { titre: 'Paramètres', icone: 'bi-gear' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'introuvable',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// router.beforeEach((to) => {
//   const auth = useAuthStore();

//   if (!to.meta.public && !auth.estConnecte) {
//     return { name: 'connexion', query: { redirect: to.fullPath } };
//   }

//   if (to.name === 'connexion' && auth.estConnecte) {
//     return { name: 'tableau-de-bord' };
//   }

//   return true;
// });

export default router;
