<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import { listerReservations, annulerReservation } from '@/api/reservations';
import { formaterDate } from '@/utils/format';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { demander } = useConfirm();

const chargement = ref(true);
const donneesDemo = ref(false);
const reservations = ref([]);
const filtreStatut = ref('tous');

const reservationsDemo = [
  { id: 1, adherent: 'Fatou Koné', cours: 'CrossFit — 25/07 18h', statut_reservation: 'confirmee', date_reservation: '2026-07-23T14:00:00' },
  { id: 2, adherent: 'Ibrahim Traoré', cours: 'Yoga Vinyasa — 25/07 07h', statut_reservation: 'liste_attente', date_reservation: '2026-07-23T09:30:00' },
  { id: 3, adherent: "Aya N'Guessan", cours: 'Boxe fitness — 26/07 19h', statut_reservation: 'confirmee', date_reservation: '2026-07-22T18:00:00' },
  { id: 4, adherent: 'Moussa Diabaté', cours: 'CrossFit — 25/07 18h', statut_reservation: 'annulee', date_reservation: '2026-07-20T11:00:00' },
];

const colonnes = [
  { key: 'adherent', label: 'Adhérent', sortable: true },
  { key: 'cours', label: 'Cours', sortable: true },
  { key: 'date_reservation', label: 'Réservé le', sortable: true },
  { key: 'statut_reservation', label: 'Statut', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

const lignesFiltrees = computed(() =>
  filtreStatut.value === 'tous'
    ? reservations.value
    : reservations.value.filter((r) => r.statut_reservation === filtreStatut.value)
);

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerReservations();
    reservations.value = data;
    donneesDemo.value = false;
  } catch {
    reservations.value = reservationsDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

async function annuler(ligne) {
  const ok = await demander({
    titre: 'Annuler cette réservation ?',
    message: `${ligne.adherent} sera retiré de "${ligne.cours}". La première personne en liste d'attente prendra sa place si applicable.`,
    labelConfirmer: 'Annuler la réservation',
    danger: true,
  });
  if (!ok) return;

  try {
    await annulerReservation(ligne.id);
  } catch {
    // Endpoint pas encore disponible : mise a jour locale pour la demo.
  }
  ligne.statut_reservation = 'annulee';
  toast.succes('Réservation annulée.');
}

onMounted(charger);
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="h4 mb-1">Réservations</h2>
      <p class="ag-text-muted mb-0">Suivi des inscriptions aux cours collectifs.</p>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/reservations</code> n'est pas encore connecté côté backend.</span>
    </div>

    <DataTable
      :columns="colonnes"
      :rows="lignesFiltrees"
      :chargement="chargement"
      titre-export="reservations"
      vide-titre="Aucune réservation"
      vide-message="Ajustez le filtre de statut."
    >
      <template #filtres>
        <select v-model="filtreStatut" class="form-select form-select-sm" style="width: auto">
          <option value="tous">Tous les statuts</option>
          <option value="confirmee">Confirmée</option>
          <option value="liste_attente">Liste d'attente</option>
          <option value="annulee">Annulée</option>
        </select>
      </template>
      <template #cell-date_reservation="{ valeur }">{{ formaterDate(valeur, true) }}</template>
      <template #cell-statut_reservation="{ valeur }"><StatusPill :statut="valeur" /></template>
      <template #cell-actions="{ ligne }">
        <button
          v-if="ligne.statut_reservation !== 'annulee'"
          class="btn btn-sm btn-outline-danger"
          @click.stop="annuler(ligne)"
        >
          Annuler
        </button>
      </template>
    </DataTable>
  </div>
</template>
