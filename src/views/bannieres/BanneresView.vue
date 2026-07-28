<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import AgModal from '@/components/ui/AgModal.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import { listerBannieres, creerBanniere, modifierBanniere, supprimerBanniere } from '@/api/bannieres';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { demander } = useConfirm();

const chargement = ref(true);
const donneesDemo = ref(false);
const bannieres = ref([]);

const bannieresDemo = [
  { id_banniere: 1, titre: 'Promo rentrée -20%', image: 'https://via.placeholder.com/600x200', ordre_affichage: 1, actif: true },
  { id_banniere: 2, titre: 'Nouvelle salle à Marcory', image: 'https://via.placeholder.com/600x200', ordre_affichage: 2, actif: true },
];

const colonnes = [
  { key: 'apercu', label: '', sortable: false },
  { key: 'titre', label: 'Titre', sortable: true },
  { key: 'ordre_affichage', label: 'Ordre', sortable: true },
  { key: 'actif', label: 'Statut', sortable: true },
];

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerBannieres();
    bannieres.value = data;
    donneesDemo.value = false;
  } catch {
    bannieres.value = bannieresDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}
onMounted(charger);

const modaleOuverte = ref(false);
const form = reactive({ id_banniere: null, titre: '', image: '', lien_url: '', ordre_affichage: 0, date_debut: '', date_fin: '' });

function ouvrirNouvelle() {
  Object.assign(form, { id_banniere: null, titre: '', image: '', lien_url: '', ordre_affichage: bannieres.value.length + 1, date_debut: '', date_fin: '' });
  modaleOuverte.value = true;
}
function ouvrirEdition(ligne) {
  Object.assign(form, ligne);
  modaleOuverte.value = true;
}

const formValide = computed(() => form.titre.trim().length >= 2 && form.image.trim().length > 0);

async function enregistrer() {
  if (!formValide.value) return;
  try {
    if (form.id_banniere) {
      await modifierBanniere(form.id_banniere, form);
    } else {
      await creerBanniere(form);
    }
    toast.succes('Bannière enregistrée.');
    modaleOuverte.value = false;
    charger();
  } catch {
    toast.erreur("Impossible d'enregistrer la bannière (mode démonstration ?).");
  }
}

async function basculerActif(ligne) {
  try {
    await modifierBanniere(ligne.id_banniere, { actif: !ligne.actif });
    ligne.actif = !ligne.actif;
    toast.succes(ligne.actif ? 'Bannière activée.' : 'Bannière désactivée.');
  } catch {
    toast.erreur('Action impossible (mode démonstration ?).');
  }
}

async function supprimer(ligne) {
  const ok = await demander({ titre: 'Supprimer cette bannière ?', message: `"${ligne.titre}" ne sera plus visible dans le carrousel.`, danger: true, labelConfirmer: 'Supprimer' });
  if (!ok) return;
  try {
    await supprimerBanniere(ligne.id_banniere);
    toast.succes('Bannière supprimée.');
    charger();
  } catch {
    toast.erreur('Suppression impossible (mode démonstration ?).');
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h2 class="h4 mb-1">Bannières publicitaires</h2>
        <p class="ag-text-muted mb-0">Carrousel affiché en haut de l'accueil de l'application mobile.</p>
      </div>
      <button class="btn btn-primary d-inline-flex align-items-center gap-2" @click="ouvrirNouvelle">
        <i class="bi bi-plus-lg"></i> Nouvelle bannière
      </button>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — l'endpoint <code>/api/bannieres</code> ne répond pas (backend non démarré ou droits insuffisants).</span>
    </div>

    <DataTable :columns="colonnes" :rows="bannieres" :chargement="chargement" cle-ligne="id_banniere" titre-export="bannieres" @row-click="ouvrirEdition">
      <template #cell-apercu="{ ligne }">
        <img :src="ligne.image" :alt="ligne.titre" style="width: 64px; height: 32px; object-fit: cover; border-radius: 6px" />
      </template>
      <template #cell-actif="{ ligne, valeur }">
        <div class="d-flex justify-content-between align-items-center gap-2">
          <StatusPill :statut="valeur ? 'actif' : 'inactif'" />
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary" @click.stop="basculerActif(ligne)">
              <i class="bi" :class="valeur ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click.stop="supprimer(ligne)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </template>
    </DataTable>

    <AgModal :ouverte="modaleOuverte" :titre="form.id_banniere ? 'Modifier la bannière' : 'Nouvelle bannière'" @fermer="modaleOuverte = false">
      <form class="d-flex flex-column gap-3" @submit.prevent="enregistrer">
        <div>
          <label class="form-label small fw-medium">Titre</label>
          <input v-model="form.titre" type="text" class="form-control" />
        </div>
        <div>
          <label class="form-label small fw-medium">URL de l'image</label>
          <input v-model="form.image" type="text" class="form-control" placeholder="https://..." />
          <p class="ag-text-faint small mt-1 mb-0">Format recommandé : bannière large (ratio ~3:1), pour un rendu net sur mobile.</p>
        </div>
        <div>
          <label class="form-label small fw-medium">Lien (optionnel)</label>
          <input v-model="form.lien_url" type="text" class="form-control" placeholder="https://..." />
        </div>
        <div class="row g-3">
          <div class="col-4">
            <label class="form-label small fw-medium">Ordre</label>
            <input v-model.number="form.ordre_affichage" type="number" min="0" class="form-control" />
          </div>
          <div class="col-4">
            <label class="form-label small fw-medium">Début</label>
            <input v-model="form.date_debut" type="date" class="form-control" />
          </div>
          <div class="col-4">
            <label class="form-label small fw-medium">Fin</label>
            <input v-model="form.date_fin" type="date" class="form-control" />
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline-secondary" @click="modaleOuverte = false">Annuler</button>
        <button class="btn btn-primary" :disabled="!formValide" @click="enregistrer">Enregistrer</button>
      </template>
    </AgModal>
  </div>
</template>
