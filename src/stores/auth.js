import { defineStore } from 'pinia';
import { demanderOtp, verifierOtp } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    utilisateur: JSON.parse(localStorage.getItem('ag_user') || 'null'),
    roles: JSON.parse(localStorage.getItem('ag_roles') || '[]'),
    token: localStorage.getItem('ag_token') || null,
  }),

  getters: {
    estConnecte: (state) => !!state.token,
    aAccesAdmin: (state) => state.roles.some((r) => ['coach', 'gerant', 'super_admin'].includes(r)),
    estSuperAdmin: (state) => state.roles.includes('super_admin'),
    estGerantOuAdmin: (state) => state.roles.some((r) => ['gerant', 'super_admin'].includes(r)),
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
      this.roles = data.roles || [];
      localStorage.setItem('ag_token', data.token);
      localStorage.setItem('ag_user', JSON.stringify(data.utilisateur));
      localStorage.setItem('ag_roles', JSON.stringify(this.roles));
    },

    deconnexion() {
      this.token = null;
      this.utilisateur = null;
      this.roles = [];
      localStorage.removeItem('ag_token');
      localStorage.removeItem('ag_user');
      localStorage.removeItem('ag_roles');
    },
  },
});
