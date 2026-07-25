<script setup>
const props = defineProps({
  statut: { type: String, required: true },
});

const map = {
  actif: { label: 'Actif', variante: 'success' },
  a_renouveler: { label: 'À renouveler', variante: 'warning' },
  expire: { label: 'Expiré', variante: 'danger' },
  annule: { label: 'Annulé', variante: 'neutral' },
  inactif: { label: 'Inactif', variante: 'neutral' },
};

const infos = map[props.statut] || { label: props.statut, variante: 'neutral' };
</script>

<template>
  <span class="ag-pill" :class="`ag-pill--${infos.variante}`">{{ infos.label }}</span>
</template>
