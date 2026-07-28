<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center px-3">
    <span class="ag-display fw-bold" style="font-size: 4rem; color: var(--ag-primary)">404</span>
    <h1 class="h4 mt-2">Cette page n'existe pas</h1>
    <p class="ag-text-muted mb-4">Vérifiez l'adresse ou retournez au tableau de bord.</p>
    <button class="btn btn-primary" @click="router.push({ name: 'tableau-de-bord' })">
      Retour au tableau de bord
    </button>
  </div>
</template>
