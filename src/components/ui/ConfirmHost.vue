<script setup>
import AgModal from './AgModal.vue';
import { useConfirm } from '@/composables/useConfirm';

const { etat, repondre } = useConfirm();
</script>

<template>
  <AgModal :ouverte="etat.ouverte" :titre="etat.titre" taille="sm" @fermer="repondre(false)">
    <p class="ag-text-muted mb-0">{{ etat.message }}</p>
    <template #footer>
      <button class="btn btn-outline-secondary" @click="repondre(false)">Annuler</button>
      <button class="btn" :class="etat.danger ? 'btn-danger' : 'btn-primary'" @click="repondre(true)">
        {{ etat.labelConfirmer }}
      </button>
    </template>
  </AgModal>
</template>
