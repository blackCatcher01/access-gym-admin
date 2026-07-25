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
  confirme: { label: 'Confirmé', variante: 'success' },
  en_attente: { label: 'En attente', variante: 'warning' },
  echoue: { label: 'Échoué', variante: 'danger' },
  confirmee: { label: 'Confirmée', variante: 'success' },
  liste_attente: { label: "Liste d'attente", variante: 'warning' },
  annulee: { label: 'Annulée', variante: 'neutral' },
  autorise: { label: 'Autorisé', variante: 'success' },
  refuse: { label: 'Refusé', variante: 'danger' },
};

const infos = map[props.statut] || { label: props.statut, variante: 'neutral' };
</script>

<template>
  <span class="ag-pill" :class="`ag-pill--${infos.variante}`">{{ infos.label }}</span>
</template>
