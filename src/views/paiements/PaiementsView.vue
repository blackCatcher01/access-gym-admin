<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import { listerPaiements } from '@/api/paiements';
import { formaterDate, formaterMontant } from '@/utils/format';

const chargement = ref(true);
const donneesDemo = ref(false);
const paiements = ref([]);
const filtreStatut = ref('tous');
const filtreMoyen = ref('tous');

const paiementsDemo = [
  { id: 1, adherent: 'Fatou Koné', montant: 15000, moyen_paiement: 'wave', statut_paiement: 'confirme', date_paiement: '2026-07-20T10:12:00' },
  { id: 2, adherent: 'Ibrahim Traoré', montant: 40000, moyen_paiement: 'orange_money', statut_paiement: 'confirme', date_paiement: '2026-07-18T09:03:00' },
  { id: 3, adherent: "Aya N'Guessan", montant: 15000, moyen_paiement: 'especes', statut_paiement: 'en_attente', date_paiement: '2026-07-22T16:44:00' },
  { id: 4, adherent: 'Moussa Diabaté', montant: 150000, moyen_paiement: 'free_money', statut_paiement: 'echoue', date_paiement: '2026-07-15T08:21:00' },
];

const libellesMoyen = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  free_money: 'Free Money',
  especes: 'Espèces',
};

const colonnes = [
  { key: 'adherent', label: 'Adhérent', sortable: true },
  { key: 'montant', label: 'Montant', sortable: true },
  { key: 'moyen_paiement', label: 'Moyen', sortable: true },
  { key: 'date_paiement', label: 'Date', sortable: true },
  { key: 'statut_paiement', label: 'Statut', sortable: true },
];

const lignesFiltrees = computed(() =>
  paiements.value.filter(
    (p) =>
      (filtreStatut.value === 'tous' || p.statut_paiement === filtreStatut.value) &&
      (filtreMoyen.value === 'tous' || p.moyen_paiement === filtreMoyen.value)
  )
);

const totalConfirme = computed(() =>
  lignesFiltrees.value.filter((p) => p.statut_paiement === 'confirme').reduce((s, p) => s + Number(p.montant), 0)
);

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerPaiements();
    paiements.value = data;
    donneesDemo.value = false;
  } catch {
    paiements.value = paiementsDemo;
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
      <h2 class="h4 mb-1">Paiements</h2>
      <p class="ag-text-muted mb-0">
        Historique des transactions —
        <span class="ag-mono fw-semibold">{{ formaterMontant(totalConfirme) }}</span> confirmés sur la sélection actuelle.
      </p>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/paiements</code> n'est pas encore connecté côté backend.</span>
    </div>

    <DataTable
      :columns="colonnes"
      :rows="lignesFiltrees"
      :chargement="chargement"
      titre-export="paiements"
      vide-titre="Aucun paiement"
      vide-message="Ajustez les filtres pour voir d'autres transactions."
    >
      <template #filtres>
        <select v-model="filtreStatut" class="form-select form-select-sm" style="width: auto">
          <option value="tous">Tous les statuts</option>
          <option value="confirme">Confirmé</option>
          <option value="en_attente">En attente</option>
          <option value="echoue">Échoué</option>
        </select>
        <select v-model="filtreMoyen" class="form-select form-select-sm" style="width: auto">
          <option value="tous">Tous les moyens</option>
          <option value="wave">Wave</option>
          <option value="orange_money">Orange Money</option>
          <option value="free_money">Free Money</option>
          <option value="especes">Espèces</option>
        </select>
      </template>
      <template #cell-montant="{ valeur }"><span class="ag-mono">{{ formaterMontant(valeur) }}</span></template>
      <template #cell-moyen_paiement="{ valeur }">{{ libellesMoyen[valeur] || valeur }}</template>
      <template #cell-date_paiement="{ valeur }">{{ formaterDate(valeur, true) }}</template>
      <template #cell-statut_paiement="{ valeur }"><StatusPill :statut="valeur" /></template>
    </DataTable>
  </div>
</template>
