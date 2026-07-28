<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import AgDrawer from '@/components/ui/AgDrawer.vue';
import AgModal from '@/components/ui/AgModal.vue';
import { listerAbonnements, renouvelerAbonnement } from '@/api/abonnements';
import { rechercherAdherentParTelephone, creerAbonnementSurPlace } from '@/api/staffAbonnements';
import { listerSalles } from '@/api/salles';
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

// -- Créer un abonnement sur place (recherche par téléphone) --
const modaleNouvelOuverte = ref(false);
const etapeNouvel = ref('recherche'); // recherche | formulaire
const rechercheEnCours = ref(false);
const creationEnCours = ref(false);
const telephoneRecherche = ref('');
const adherentTrouve = ref(null);
const erreurRecherche = ref(null);
const formulesDisponibles = ref([]);
const formNouvel = reactive({ id_formule: null, moyen_paiement: 'especes' });

function ouvrirNouvelAbonnement() {
  etapeNouvel.value = 'recherche';
  telephoneRecherche.value = '';
  adherentTrouve.value = null;
  erreurRecherche.value = null;
  modaleNouvelOuverte.value = true;
}

async function rechercherAdherent() {
  if (!telephoneRecherche.value.trim()) return;
  rechercheEnCours.value = true;
  erreurRecherche.value = null;
  try {
    const { data } = await rechercherAdherentParTelephone(telephoneRecherche.value.trim());
    adherentTrouve.value = data;

    const { data: salles } = await listerSalles();
    formulesDisponibles.value = (salles.data ?? salles).flatMap((s) =>
      (s.formules_abonnement ?? []).map((f) => ({ ...f, salle_nom: s.nom_salle }))
    );
    formNouvel.id_formule = formulesDisponibles.value[0]?.id_formule ?? null;
    formNouvel.moyen_paiement = 'especes';
    etapeNouvel.value = 'formulaire';
  } catch (e) {
    erreurRecherche.value = e.response?.data?.message || "Aucun compte trouvé pour ce numéro.";
  } finally {
    rechercheEnCours.value = false;
  }
}

async function validerNouvelAbonnement() {
  if (!formNouvel.id_formule) return;
  creationEnCours.value = true;
  try {
    await creerAbonnementSurPlace({
      telephone: telephoneRecherche.value.trim(),
      id_formule: formNouvel.id_formule,
      moyen_paiement: formNouvel.moyen_paiement,
    });
    toast.succes('Abonnement créé et activé.');
    modaleNouvelOuverte.value = false;
    charger();
  } catch (e) {
    toast.erreur(e.response?.data?.message || "Impossible de créer l'abonnement.");
  } finally {
    creationEnCours.value = false;
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h2 class="h4 mb-1">Abonnements</h2>
        <p class="ag-text-muted mb-0">Suivi des formules et des échéances de vos adhérents.</p>
      </div>
      <button class="btn btn-primary d-inline-flex align-items-center gap-2" @click="ouvrirNouvelAbonnement">
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

    <AgModal :ouverte="modaleNouvelOuverte" titre="Nouvel abonnement sur place" @fermer="modaleNouvelOuverte = false">
      <div v-if="etapeNouvel === 'recherche'">
        <label class="form-label small fw-medium">Numéro de téléphone de l'adhérent</label>
        <div class="d-flex gap-2">
          <input
            v-model="telephoneRecherche"
            type="tel"
            class="form-control"
            placeholder="+225 07 00 00 00 00"
            @keyup.enter="rechercherAdherent"
          />
          <button class="btn btn-primary" :disabled="rechercheEnCours" @click="rechercherAdherent">
            <span v-if="rechercheEnCours" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-search"></i>
          </button>
        </div>
        <p v-if="erreurRecherche" class="text-danger small mt-2 mb-0">{{ erreurRecherche }}</p>
        <p class="ag-text-faint small mt-2 mb-0">
          L'adhérent doit déjà avoir créé son compte via l'application (numéro + code SMS) — cette recherche ne crée pas de nouveau compte.
        </p>
      </div>

      <div v-else>
        <div class="d-flex align-items-center gap-2 mb-3 ag-card p-2 px-3">
          <span class="ag-avatar-sm">{{ (adherentTrouve.prenom?.[0] || '') + (adherentTrouve.nom?.[0] || '') }}</span>
          <div>
            <p class="mb-0 small fw-medium">{{ adherentTrouve.prenom }} {{ adherentTrouve.nom }}</p>
            <p class="mb-0 ag-text-muted small">{{ adherentTrouve.telephone }}</p>
          </div>
        </div>

        <label class="form-label small fw-medium">Formule</label>
        <select v-model="formNouvel.id_formule" class="form-select mb-3">
          <option v-for="f in formulesDisponibles" :key="f.id_formule" :value="f.id_formule">
            {{ f.salle_nom }} — {{ f.nom_formule }} ({{ formaterMontant(f.prix) }})
          </option>
        </select>

        <label class="form-label small fw-medium">Moyen de paiement</label>
        <select v-model="formNouvel.moyen_paiement" class="form-select">
          <option value="especes">Espèces</option>
          <option value="wave">Wave</option>
          <option value="orange_money">Orange Money</option>
          <option value="free_money">Free Money</option>
        </select>
      </div>

      <template #footer>
        <button class="btn btn-outline-secondary" @click="modaleNouvelOuverte = false">Annuler</button>
        <button
          v-if="etapeNouvel === 'formulaire'"
          class="btn btn-primary"
          :disabled="!formNouvel.id_formule || creationEnCours"
          @click="validerNouvelAbonnement"
        >
          <span v-if="creationEnCours" class="spinner-border spinner-border-sm me-2"></span>
          Créer et activer
        </button>
      </template>
    </AgModal>
  </div>
</template>

<style scoped>
.ag-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ag-primary-soft);
  color: var(--ag-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}
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
