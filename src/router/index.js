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

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (!to.meta.public && !auth.estConnecte) {
    return { name: 'connexion', query: { redirect: to.fullPath } };
  }

  if (to.name === 'connexion' && auth.estConnecte) {
    return { name: 'tableau-de-bord' };
  }

  return true;
});

export default router;
