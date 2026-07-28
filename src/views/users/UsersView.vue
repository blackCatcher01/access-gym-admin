<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import AgDrawer from '@/components/ui/AgDrawer.vue';
import { listerAdherents, listerStaff } from '@/api/utilisateurs';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { demander } = useConfirm();

const onglet = ref('adherents');
const chargement = ref(true);
const donneesDemo = ref(false);
const adherents = ref([]);
const staff = ref([]);
const utilisateurSelectionne = ref(null);
const drawerOuvert = ref(false);

const adherentsDemo = [
  { id: 1, nom: 'Fatou Koné', telephone: '+225 07 12 34 56', statut: 'actif', inscription: '12/03/2026' },
  { id: 2, nom: 'Ibrahim Traoré', telephone: '+225 05 98 76 54', statut: 'a_renouveler', inscription: '02/01/2026' },
  { id: 3, nom: "Aya N'Guessan", telephone: '+225 01 22 33 44', statut: 'expire', inscription: '18/11/2025' },
  { id: 4, nom: 'Moussa Diabaté', telephone: '+225 07 55 66 77', statut: 'actif', inscription: '30/05/2026' },
];

const staffDemo = [
  { id: 101, nom: 'Kader Ouattara', telephone: '+225 07 00 11 22', role_staff: 'coach', statut: 'actif' },
  { id: 102, nom: 'Aminata Sylla', telephone: '+225 05 44 55 66', role_staff: 'gerant', statut: 'actif' },
];

const colonnesAdherents = [
  { key: 'nom', label: 'Nom', sortable: true },
  { key: 'telephone', label: 'Téléphone', sortable: false },
  { key: 'statut', label: 'Abonnement', sortable: true },
  { key: 'inscription', label: 'Inscrit le', sortable: true },
];

const colonnesStaff = [
  { key: 'nom', label: 'Nom', sortable: true },
  { key: 'telephone', label: 'Téléphone', sortable: false },
  { key: 'role_staff', label: 'Rôle', sortable: true },
  { key: 'statut', label: 'Statut', sortable: true },
];

const lignesActuelles = computed(() => (onglet.value === 'adherents' ? adherents.value : staff.value));
const colonnesActuelles = computed(() => (onglet.value === 'adherents' ? colonnesAdherents : colonnesStaff));

async function charger() {
  chargement.value = true;
  try {
    const [resAdherents, resStaff] = await Promise.all([listerAdherents(), listerStaff()]);
    adherents.value = resAdherents.data;
    staff.value = resStaff.data;
    donneesDemo.value = false;
  } catch {
    // Endpoints pas encore construits côté backend : on affiche des
    // données de démonstration pour garder l'interface exploitable.
    adherents.value = adherentsDemo;
    staff.value = staffDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

function voirDetail(ligne) {
  utilisateurSelectionne.value = ligne;
  drawerOuvert.value = true;
}

async function basculerStatut(ligne) {
  const activer = ligne.statut === 'inactif';
  const ok = await demander({
    titre: activer ? 'Réactiver ce compte ?' : 'Désactiver ce compte ?',
    message: activer
      ? `${ligne.nom} pourra de nouveau accéder à la salle et à son compte.`
      : `${ligne.nom} n'aura plus accès à la salle tant que le compte est désactivé.`,
    labelConfirmer: activer ? 'Réactiver' : 'Désactiver',
    danger: !activer,
  });
  if (!ok) return;

  ligne.statut = activer ? 'actif' : 'inactif';
  toast.succes(activer ? 'Compte réactivé.' : 'Compte désactivé.');
}

onMounted(charger);
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h2 class="h4 mb-1">Utilisateurs</h2>
        <p class="ag-text-muted mb-0">Adhérents et personnel de votre établissement.</p>
      </div>
      <button class="btn btn-primary d-inline-flex align-items-center gap-2">
        <i class="bi bi-plus-lg"></i> Ajouter
      </button>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">
        Données de démonstration — les endpoints <code>/api/adherents</code> et <code>/api/staff</code> ne sont pas encore connectés côté backend.
      </span>
    </div>

    <ul class="nav nav-pills gap-2 mb-3">
      <li class="nav-item">
        <button class="ag-tab" :class="{ 'ag-tab--actif': onglet === 'adherents' }" @click="onglet = 'adherents'">
          Adhérents <span class="ag-mono">({{ adherents.length }})</span>
        </button>
      </li>
      <li class="nav-item">
        <button class="ag-tab" :class="{ 'ag-tab--actif': onglet === 'staff' }" @click="onglet = 'staff'">
          Staff <span class="ag-mono">({{ staff.length }})</span>
        </button>
      </li>
    </ul>

    <DataTable
      :columns="colonnesActuelles"
      :rows="lignesActuelles"
      :chargement="chargement"
      cle-ligne="id"
      titre-export="utilisateurs"
      vide-titre="Aucun utilisateur"
      vide-message="Ajoutez un adhérent ou un membre du personnel pour commencer."
      @row-click="voirDetail"
    >
      <template #cell-nom="{ ligne }">
        <div class="d-flex align-items-center gap-2">
          <span class="ag-avatar-sm">{{ ligne.nom.split(' ').map((m) => m[0]).slice(0, 2).join('') }}</span>
          <span class="fw-medium">{{ ligne.nom }}</span>
        </div>
      </template>
      <template #cell-statut="{ valeur }">
        <StatusPill :statut="valeur" />
      </template>
      <template #cell-role_staff="{ valeur }">
        <span class="text-capitalize">{{ valeur }}</span>
      </template>
    </DataTable>

    <AgDrawer :ouvert="drawerOuvert" :titre="utilisateurSelectionne?.nom" @fermer="drawerOuvert = false">
      <template v-if="utilisateurSelectionne">
        <div class="d-flex align-items-center gap-3 mb-4">
          <span class="ag-avatar-lg">
            {{ utilisateurSelectionne.nom.split(' ').map((m) => m[0]).slice(0, 2).join('') }}
          </span>
          <div>
            <p class="fw-semibold mb-0">{{ utilisateurSelectionne.nom }}</p>
            <p class="ag-text-muted small mb-0">{{ utilisateurSelectionne.telephone }}</p>
          </div>
        </div>

        <dl class="ag-detail-list">
          <div>
            <dt>Statut</dt>
            <dd><StatusPill :statut="utilisateurSelectionne.statut" /></dd>
          </div>
          <div v-if="utilisateurSelectionne.inscription">
            <dt>Inscrit le</dt>
            <dd>{{ utilisateurSelectionne.inscription }}</dd>
          </div>
          <div v-if="utilisateurSelectionne.role_staff">
            <dt>Rôle</dt>
            <dd class="text-capitalize">{{ utilisateurSelectionne.role_staff }}</dd>
          </div>
        </dl>
      </template>

      <template #footer>
        <button class="btn btn-outline-secondary" @click="drawerOuvert = false">Fermer</button>
        <button
          class="btn"
          :class="utilisateurSelectionne?.statut === 'inactif' ? 'btn-primary' : 'btn-danger'"
          @click="basculerStatut(utilisateurSelectionne)"
        >
          {{ utilisateurSelectionne?.statut === 'inactif' ? 'Réactiver' : 'Désactiver' }}
        </button>
      </template>
    </AgDrawer>
  </div>
</template>

<style scoped>
.ag-tab {
  background: none;
  border: 1px solid var(--ag-border);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ag-text-muted);
}
.ag-tab--actif {
  background: var(--ag-primary-soft);
  border-color: var(--ag-primary-soft);
  color: var(--ag-primary);
}
.ag-avatar-sm, .ag-avatar-lg {
  border-radius: 50%;
  background: var(--ag-primary-soft);
  color: var(--ag-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.ag-avatar-sm { width: 28px; height: 28px; font-size: 0.65rem; }
.ag-avatar-lg { width: 52px; height: 52px; font-size: 1rem; }
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
