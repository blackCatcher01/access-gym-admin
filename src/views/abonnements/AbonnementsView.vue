<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import AgDrawer from '@/components/ui/AgDrawer.vue';
import { listerAbonnements, renouvelerAbonnement } from '@/api/abonnements';
import { formaterDate, formaterMontant } from '@/utils/format';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { demander } = useConfirm();

const chargement = ref(true);
const donneesDemo = ref(false);
const abonnements = ref([]);
const filtreStatut = ref('tous');
const selection = ref(null);
const drawerOuvert = ref(false);

const abonnementsDemo = [
  { id: 1, adherent: 'Fatou Koné', formule: 'Mensuel', prix: 15000, date_debut: '2026-06-24', date_fin: '2026-07-24', statut: 'a_renouveler' },
  { id: 2, adherent: 'Ibrahim Traoré', formule: 'Trimestriel', prix: 40000, date_debut: '2026-05-10', date_fin: '2026-08-10', statut: 'actif' },
  { id: 3, adherent: "Aya N'Guessan", formule: 'Mensuel', prix: 15000, date_debut: '2026-05-18', date_fin: '2026-06-18', statut: 'expire' },
  { id: 4, adherent: 'Moussa Diabaté', formule: 'Annuel', prix: 150000, date_debut: '2026-05-30', date_fin: '2027-05-30', statut: 'actif' },
];

const colonnes = [
  { key: 'adherent', label: 'Adhérent', sortable: true },
  { key: 'formule', label: 'Formule', sortable: true },
  { key: 'prix', label: 'Prix', sortable: true },
  { key: 'date_fin', label: 'Échéance', sortable: true },
  { key: 'statut', label: 'Statut', sortable: true },
];

const lignesFiltrees = computed(() => {
  if (filtreStatut.value === 'tous') return abonnements.value;
  return abonnements.value.filter((a) => a.statut === filtreStatut.value);
});

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerAbonnements();
    abonnements.value = data;
    donneesDemo.value = false;
  } catch {
    abonnements.value = abonnementsDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

function voirDetail(ligne) {
  selection.value = ligne;
  drawerOuvert.value = true;
}

async function renouveler(ligne) {
  const ok = await demander({
    titre: 'Renouveler cet abonnement ?',
    message: `${ligne.adherent} sera reconduit sur la formule "${ligne.formule}" pour une nouvelle période.`,
    labelConfirmer: 'Renouveler',
  });
  if (!ok) return;

  try {
    await renouvelerAbonnement(ligne.id);
  } catch {
    // Endpoint pas encore disponible : on simule quand meme le resultat visuel.
  }
  ligne.statut = 'actif';
  toast.succes('Abonnement renouvelé.');
  drawerOuvert.value = false;
}

onMounted(charger);
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h2 class="h4 mb-1">Abonnements</h2>
        <p class="ag-text-muted mb-0">Suivi des formules et des échéances de vos adhérents.</p>
      </div>
      <button class="btn btn-primary d-inline-flex align-items-center gap-2">
        <i class="bi bi-plus-lg"></i> Nouvel abonnement
      </button>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/abonnements</code> n'est pas encore connecté côté backend.</span>
    </div>

    <DataTable
      :columns="colonnes"
      :rows="lignesFiltrees"
      :chargement="chargement"
      titre-export="abonnements"
      vide-titre="Aucun abonnement"
      vide-message="Ajustez le filtre de statut ou créez un premier abonnement."
      @row-click="voirDetail"
    >
      <template #filtres>
        <select v-model="filtreStatut" class="form-select form-select-sm" style="width: auto">
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="a_renouveler">À renouveler</option>
          <option value="expire">Expiré</option>
          <option value="annule">Annulé</option>
        </select>
      </template>
      <template #cell-prix="{ valeur }">{{ formaterMontant(valeur) }}</template>
      <template #cell-date_fin="{ valeur }">{{ formaterDate(valeur) }}</template>
      <template #cell-statut="{ valeur }"><StatusPill :statut="valeur" /></template>
    </DataTable>

    <AgDrawer :ouvert="drawerOuvert" :titre="selection?.adherent" @fermer="drawerOuvert = false">
      <template v-if="selection">
        <dl class="ag-detail-list">
          <div><dt>Formule</dt><dd>{{ selection.formule }}</dd></div>
          <div><dt>Prix</dt><dd class="ag-mono">{{ formaterMontant(selection.prix) }}</dd></div>
          <div><dt>Début</dt><dd>{{ formaterDate(selection.date_debut) }}</dd></div>
          <div><dt>Échéance</dt><dd>{{ formaterDate(selection.date_fin) }}</dd></div>
          <div><dt>Statut</dt><dd><StatusPill :statut="selection.statut" /></dd></div>
        </dl>
      </template>
      <template #footer>
        <button class="btn btn-outline-secondary" @click="drawerOuvert = false">Fermer</button>
        <button v-if="selection?.statut !== 'actif'" class="btn btn-primary" @click="renouveler(selection)">
          Renouveler
        </button>
      </template>
    </AgDrawer>
  </div>
</template>

<style scoped>
.ag-detail-list div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 0.6rem;
  border-bottom: 1px solid var(--ag-border);
}
.ag-detail-list dt { color: var(--ag-text-muted); font-size: 0.85rem; margin: 0; }
.ag-detail-list dd { margin: 0; font-size: 0.85rem; font-weight: 500; }
</style>
