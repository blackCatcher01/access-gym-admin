import { defineStore } from 'pinia';

function themePrefere() {
  const enregistre = localStorage.getItem('ag_theme');
  if (enregistre) return enregistre;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: themePrefere(),
    sidebarReduite: localStorage.getItem('ag_sidebar_reduite') === '1',
    sidebarMobileOuverte: false,
  }),

  actions: {
    appliquerTheme() {
      document.documentElement.setAttribute('data-bs-theme', this.theme);
    },

    basculerTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ag_theme', this.theme);
      this.appliquerTheme();
    },

    basculerSidebar() {
      this.sidebarReduite = !this.sidebarReduite;
      localStorage.setItem('ag_sidebar_reduite', this.sidebarReduite ? '1' : '0');
    },

    ouvrirSidebarMobile() {
      this.sidebarMobileOuverte = true;
    },

    fermerSidebarMobile() {
      this.sidebarMobileOuverte = false;
    },
  },
});
