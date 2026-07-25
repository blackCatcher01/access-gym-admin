import { defineStore } from 'pinia';
import { demanderOtp, verifierOtp } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    utilisateur: JSON.parse(localStorage.getItem('ag_user') || 'null'),
    token: localStorage.getItem('ag_token') || null,
  }),

  getters: {
    estConnecte: (state) => !!state.token,
    // Un adhérent ne doit jamais accéder au back-office.
    aAccesAdmin: (state) => ['coach', 'gerant', 'super_admin'].includes(state.utilisateur?.role),
    initiales: (state) => (state.utilisateur?.nom || '?').split(' ').map((m) => m[0]).slice(0, 2).join('').toUpperCase(),
  },

  actions: {
    async demanderCode(telephone) {
      await demanderOtp(telephone);
    },

    async verifierCode(telephone, code) {
      const { data } = await verifierOtp(telephone, code);
      this.token = data.token;
      this.utilisateur = data.utilisateur;
      localStorage.setItem('ag_token', data.token);
      localStorage.setItem('ag_user', JSON.stringify(data.utilisateur));
    },

    deconnexion() {
      this.token = null;
      this.utilisateur = null;
      localStorage.removeItem('ag_token');
      localStorage.removeItem('ag_user');
    },
  },
});
