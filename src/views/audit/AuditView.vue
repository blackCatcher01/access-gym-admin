<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import { listerJournalAudit } from '@/api/audit';
import { formaterDate } from '@/utils/format';

const chargement = ref(true);
const donneesDemo = ref(false);
const entrees = ref([]);

const entreesDemo = [
  { id: 1, staff: 'Aminata Sylla', action: 'Validation paiement espèces', date_action: '2026-07-24T09:12:00', ip_address: '10.0.0.14' },
  { id: 2, staff: 'Kader Ouattara', action: 'Modification du cours "CrossFit"', date_action: '2026-07-23T17:40:00', ip_address: '10.0.0.22' },
  { id: 3, staff: 'Aminata Sylla', action: 'Désactivation du compte adhérent #482', date_action: '2026-07-23T11:05:00', ip_address: '10.0.0.14' },
  { id: 4, staff: 'Aminata Sylla', action: 'Création du compte staff "Kader Ouattara"', date_action: '2026-07-20T08:30:00', ip_address: '10.0.0.14' },
];

const colonnes = [
  { key: 'staff', label: 'Membre du staff', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'date_action', label: 'Date', sortable: true },
  { key: 'ip_address', label: 'Adresse IP', sortable: false },
];

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerJournalAudit();
    entrees.value = data;
    donneesDemo.value = false;
  } catch {
    entrees.value = entreesDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

onMounted(charger);
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="h4 mb-1">Journal d'audit</h2>
      <p class="ag-text-muted mb-0">Traçabilité des actions sensibles effectuées par le personnel — lecture seule.</p>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/journal-audit</code> n'est pas encore connecté côté backend.</span>
    </div>

    <DataTable
      :columns="colonnes"
      :rows="entrees"
      :chargement="chargement"
      titre-export="journal-audit"
      vide-titre="Aucune entrée"
      vide-message="Le journal se remplira au fil des actions du personnel."
    >
      <template #cell-date_action="{ valeur }">{{ formaterDate(valeur, true) }}</template>
      <template #cell-ip_address="{ valeur }"><span class="ag-mono small">{{ valeur }}</span></template>
    </DataTable>
  </div>
</template>
