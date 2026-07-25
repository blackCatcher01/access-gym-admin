<script setup>
import { useUiStore } from '@/stores/ui';
import PulseMark from '@/components/ui/PulseMark.vue';

const ui = useUiStore();

const groupes = [
  {
    titre: 'Vue d\'ensemble',
    items: [
      { nom: 'tableau-de-bord', label: 'Tableau de bord', icone: 'bi-grid-1x2' },
    ],
  },
  {
    titre: 'Gestion',
    items: [
      { nom: 'utilisateurs', label: 'Utilisateurs', icone: 'bi-people' },
      { label: 'Abonnements', icone: 'bi-card-checklist', bientot: true },
      { label: 'Paiements', icone: 'bi-cash-coin', bientot: true },
      { label: 'Cours & réservations', icone: 'bi-calendar3', bientot: true },
    ],
  },
  {
    titre: 'Établissement',
    items: [
      { label: 'Salles', icone: 'bi-building', bientot: true },
      { label: 'Journal d\'audit', icone: 'bi-shield-check', bientot: true },
    ],
  },
  {
    titre: 'Système',
    items: [
      { nom: 'parametres', label: 'Paramètres', icone: 'bi-gear' },
    ],
  },
];
</script>

<template>
  <aside
    class="ag-sidebar"
    :class="{ 'ag-sidebar--reduite': ui.sidebarReduite, 'ag-sidebar--mobile-ouverte': ui.sidebarMobileOuverte }"
  >
    <div class="ag-sidebar__brand">
      <PulseMark :size="30" />
      <span v-if="!ui.sidebarReduite" class="ag-display fw-semibold">Access Gym</span>
      <button class="ag-sidebar__close-mobile" @click="ui.fermerSidebarMobile" aria-label="Fermer le menu">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <nav class="ag-sidebar__nav">
      <div v-for="groupe in groupes" :key="groupe.titre" class="ag-sidebar__groupe">
        <p v-if="!ui.sidebarReduite" class="ag-sidebar__groupe-titre">{{ groupe.titre }}</p>
        <template v-for="item in groupe.items" :key="item.label">
          <RouterLink
            v-if="!item.bientot"
            :to="{ name: item.nom }"
            class="ag-sidebar__link"
            active-class="ag-sidebar__link--actif"
            :title="ui.sidebarReduite ? item.label : null"
          >
            <i class="bi" :class="item.icone"></i>
            <span v-if="!ui.sidebarReduite">{{ item.label }}</span>
          </RouterLink>
          <span
            v-else
            class="ag-sidebar__link ag-sidebar__link--bientot"
            :title="ui.sidebarReduite ? item.label + ' — bientôt' : null"
          >
            <i class="bi" :class="item.icone"></i>
            <span v-if="!ui.sidebarReduite" class="flex-grow-1">{{ item.label }}</span>
            <span v-if="!ui.sidebarReduite" class="ag-pill ag-pill--neutral">Bientôt</span>
          </span>
        </template>
      </div>
    </nav>

    <button class="ag-sidebar__toggle d-none d-lg-flex" @click="ui.basculerSidebar" :aria-label="ui.sidebarReduite ? 'Développer le menu' : 'Réduire le menu'">
      <i class="bi" :class="ui.sidebarReduite ? 'bi-chevron-double-right' : 'bi-chevron-double-left'"></i>
    </button>
  </aside>

  <div
    v-if="ui.sidebarMobileOuverte"
    class="ag-sidebar__overlay d-lg-none"
    @click="ui.fermerSidebarMobile"
  ></div>
</template>

<style scoped>
.ag-sidebar {
  position: fixed;
  inset-block: 0;
  left: 0;
  width: 260px;
  background: var(--ag-surface);
  border-right: 1px solid var(--ag-border);
  display: flex;
  flex-direction: column;
  z-index: 1040;
  transition: width var(--ag-duration) var(--ag-ease), transform var(--ag-duration) var(--ag-ease);
  transform: translateX(-100%);
}
@media (min-width: 992px) {
  .ag-sidebar { transform: translateX(0); }
}
.ag-sidebar--mobile-ouverte { transform: translateX(0); }
.ag-sidebar--reduite { width: 76px; }

.ag-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--ag-border);
  white-space: nowrap;
  overflow: hidden;
}
.ag-sidebar__close-mobile {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--ag-text-muted);
}

.ag-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0.75rem;
}
.ag-sidebar__groupe { margin-bottom: 1.1rem; }
.ag-sidebar__groupe-titre {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ag-text-faint);
  font-weight: 600;
  padding: 0 0.6rem;
  margin-bottom: 0.4rem;
}

.ag-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.6rem;
  border-radius: var(--ag-radius-md);
  color: var(--ag-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  transition: background-color var(--ag-duration) var(--ag-ease), color var(--ag-duration) var(--ag-ease);
}
.ag-sidebar__link i { font-size: 1.05rem; flex-shrink: 0; }
.ag-sidebar__link:hover {
  background: var(--ag-surface-2);
  color: var(--ag-text);
}
.ag-sidebar__link--actif {
  background: var(--ag-primary-soft);
  color: var(--ag-primary);
}
.ag-sidebar__link--bientot {
  cursor: default;
  opacity: 0.6;
}
.ag-sidebar__link--bientot:hover {
  background: none;
  color: var(--ag-text-muted);
}

.ag-sidebar__toggle {
  align-items: center;
  justify-content: center;
  margin: 0.6rem;
  padding: 0.5rem;
  border: 1px solid var(--ag-border);
  border-radius: var(--ag-radius-md);
  background: var(--ag-surface);
  color: var(--ag-text-muted);
}
.ag-sidebar__toggle:hover { background: var(--ag-surface-2); }

.ag-sidebar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 16, 0.5);
  z-index: 1039;
}
</style>
