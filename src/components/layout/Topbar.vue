<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

const ui = useUiStore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const menuProfilOuvert = ref(false);
const notificationsOuvertes = ref(false);

const notificationsDemo = [
  { id: 1, titre: 'Abonnement bientôt expiré', detail: 'Fatou K. — expire dans 3 jours', temps: 'il y a 1h' },
  { id: 2, titre: 'Nouveau paiement confirmé', detail: '15 000 XOF via Wave', temps: 'il y a 3h' },
];

function seDeconnecter() {
  auth.deconnexion();
  router.push({ name: 'connexion' });
}
</script>

<template>
  <header class="ag-topbar">
    <button class="ag-topbar__burger d-lg-none" @click="ui.ouvrirSidebarMobile" aria-label="Ouvrir le menu">
      <i class="bi bi-list"></i>
    </button>

    <h1 class="ag-topbar__titre d-none d-md-block">{{ route.meta.titre }}</h1>

    <div class="ag-topbar__recherche">
      <i class="bi bi-search"></i>
      <input type="search" placeholder="Rechercher un adhérent, un paiement..." aria-label="Recherche globale" />
      <kbd class="d-none d-md-inline">⌘K</kbd>
    </div>

    <div class="ag-topbar__actions">
      <button class="ag-topbar__icon-btn" @click="ui.basculerTheme" :aria-label="ui.theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'">
        <i class="bi" :class="ui.theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'"></i>
      </button>

      <div class="ag-dropdown">
        <button class="ag-topbar__icon-btn position-relative" @click="notificationsOuvertes = !notificationsOuvertes" aria-label="Notifications">
          <i class="bi bi-bell"></i>
          <span class="ag-topbar__badge"></span>
        </button>
        <Transition name="ag-fade-scale">
          <div v-if="notificationsOuvertes" class="ag-dropdown__panel ag-dropdown__panel--wide" @click.self="notificationsOuvertes = false">
            <div class="ag-dropdown__header">
              <strong>Notifications</strong>
            </div>
            <div v-for="n in notificationsDemo" :key="n.id" class="ag-dropdown__item">
              <div class="ag-dropdown__item-dot"></div>
              <div>
                <p class="mb-0 fw-medium small">{{ n.titre }}</p>
                <p class="mb-0 ag-text-muted small">{{ n.detail }}</p>
              </div>
              <span class="ag-text-faint small ms-auto">{{ n.temps }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <div class="ag-dropdown">
        <button class="ag-topbar__profil" @click="menuProfilOuvert = !menuProfilOuvert">
          <span class="ag-avatar">{{ auth.initiales }}</span>
          <span class="d-none d-md-inline small fw-medium">{{ auth.utilisateur?.nom }}</span>
          <i class="bi bi-chevron-down small d-none d-md-inline"></i>
        </button>
        <Transition name="ag-fade-scale">
          <div v-if="menuProfilOuvert" class="ag-dropdown__panel" @click.self="menuProfilOuvert = false">
            <RouterLink :to="{ name: 'parametres' }" class="ag-dropdown__link" @click="menuProfilOuvert = false">
              <i class="bi bi-person"></i> Mon profil
            </RouterLink>
            <RouterLink :to="{ name: 'parametres' }" class="ag-dropdown__link" @click="menuProfilOuvert = false">
              <i class="bi bi-gear"></i> Paramètres
            </RouterLink>
            <hr class="my-1" />
            <button class="ag-dropdown__link ag-dropdown__link--danger" @click="seDeconnecter">
              <i class="bi bi-box-arrow-right"></i> Se déconnecter
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ag-topbar {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-inline: 1.25rem;
  background: var(--ag-surface);
  border-bottom: 1px solid var(--ag-border);
  position: sticky;
  top: 0;
  z-index: 1030;
}
.ag-topbar__burger, .ag-topbar__icon-btn {
  background: none;
  border: none;
  color: var(--ag-text-muted);
  width: 36px;
  height: 36px;
  border-radius: var(--ag-radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--ag-duration) var(--ag-ease);
}
.ag-topbar__burger:hover, .ag-topbar__icon-btn:hover { background: var(--ag-surface-2); }

.ag-topbar__titre {
  font-family: var(--ag-font-display);
  font-size: 1.05rem;
  font-weight: 600;
  white-space: nowrap;
}

.ag-topbar__recherche {
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--ag-surface-2);
  border: 1px solid transparent;
  border-radius: var(--ag-radius-md);
  padding: 0.45rem 0.75rem;
  color: var(--ag-text-faint);
  margin-inline: auto;
  transition: border-color var(--ag-duration) var(--ag-ease);
}
.ag-topbar__recherche:focus-within { border-color: var(--ag-primary); }
.ag-topbar__recherche input {
  border: none;
  background: none;
  outline: none;
  font-size: 0.875rem;
  flex: 1;
  color: var(--ag-text);
}
.ag-topbar__recherche kbd {
  font-size: 0.7rem;
  background: var(--ag-surface);
  border: 1px solid var(--ag-border);
  border-radius: 4px;
  padding: 0.1rem 0.35rem;
  color: var(--ag-text-faint);
}

.ag-topbar__actions { display: flex; align-items: center; gap: 0.4rem; margin-left: auto; }

.ag-topbar__badge {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ag-accent);
  border: 2px solid var(--ag-surface);
}

.ag-topbar__profil {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: var(--ag-radius-md);
  color: var(--ag-text);
}
.ag-topbar__profil:hover { background: var(--ag-surface-2); }

.ag-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--ag-primary-soft);
  color: var(--ag-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.ag-dropdown { position: relative; }
.ag-dropdown__panel {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  min-width: 220px;
  background: var(--ag-surface);
  border: 1px solid var(--ag-border);
  border-radius: var(--ag-radius-lg);
  box-shadow: var(--ag-shadow-lg);
  padding: 0.5rem;
  z-index: 1050;
}
.ag-dropdown__panel--wide { min-width: 320px; }
.ag-dropdown__header { padding: 0.4rem 0.6rem 0.6rem; border-bottom: 1px solid var(--ag-border); margin-bottom: 0.4rem; }
.ag-dropdown__item {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.5rem 0.6rem;
  border-radius: var(--ag-radius-sm);
}
.ag-dropdown__item:hover { background: var(--ag-surface-2); }
.ag-dropdown__item-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--ag-primary); margin-top: 6px; flex-shrink: 0;
}
.ag-dropdown__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  border-radius: var(--ag-radius-sm);
  color: var(--ag-text);
  text-decoration: none;
  background: none;
  border: none;
  font-size: 0.875rem;
  text-align: left;
}
.ag-dropdown__link:hover { background: var(--ag-surface-2); }
.ag-dropdown__link--danger { color: var(--ag-danger); }

.ag-fade-scale-enter-active, .ag-fade-scale-leave-active {
  transition: all 140ms var(--ag-ease);
}
.ag-fade-scale-enter-from, .ag-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}
</style>
