<script setup>
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useToast } from '@/composables/useToast';

const auth = useAuthStore();
const ui = useUiStore();
const toast = useToast();

function enregistrer() {
  toast.succes('Profil mis à jour.');
}
</script>

<template>
  <div style="max-width: 640px">
    <h2 class="h4 mb-1">Paramètres</h2>
    <p class="ag-text-muted mb-4">Gérez votre profil et vos préférences d'affichage.</p>

    <div class="ag-card p-4 mb-3">
      <h3 class="h6 mb-3">Profil</h3>
      <form @submit.prevent="enregistrer" class="d-flex flex-column gap-3">
        <div>
          <label class="form-label small fw-medium">Nom complet</label>
          <input type="text" class="form-control" :value="auth.utilisateur?.nom" />
        </div>
        <div>
          <label class="form-label small fw-medium">Téléphone</label>
          <input type="text" class="form-control" :value="auth.utilisateur?.telephone" disabled />
          <p class="ag-text-faint small mt-1 mb-0">Le numéro sert d'identifiant de connexion, il ne peut pas être modifié ici.</p>
        </div>
        <div>
          <button type="submit" class="btn btn-primary align-self-start">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="ag-card p-4">
      <h3 class="h6 mb-3">Apparence</h3>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <p class="mb-0 fw-medium small">Thème sombre</p>
          <p class="ag-text-muted small mb-0">Bascule instantanément, préférence mémorisée sur cet appareil.</p>
        </div>
        <div class="form-check form-switch fs-4 mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            :checked="ui.theme === 'dark'"
            @change="ui.basculerTheme"
          />
        </div>
      </div>
    </div>
  </div>
</template>
