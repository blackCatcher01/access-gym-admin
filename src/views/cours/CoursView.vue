<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import AgModal from '@/components/ui/AgModal.vue';
import { listerCours, creerCours } from '@/api/cours';
import { formaterDate } from '@/utils/format';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const chargement = ref(true);
const donneesDemo = ref(false);
const cours = ref([]);
const modaleOuverte = ref(false);
const enregistrement = ref(false);

const coursDemo = [
  { id: 1, nom_cours: 'CrossFit', coach: 'Kader Ouattara', date_heure_debut: '2026-07-25T18:00:00', duree_min: 60, capacite_max: 20, reservations: 14 },
  { id: 2, nom_cours: 'Yoga Vinyasa', coach: 'Aminata Sylla', date_heure_debut: '2026-07-25T07:00:00', duree_min: 45, capacite_max: 15, reservations: 15 },
  { id: 3, nom_cours: 'Boxe fitness', coach: 'Kader Ouattara', date_heure_debut: '2026-07-26T19:00:00', duree_min: 50, capacite_max: 18, reservations: 6 },
];

const colonnes = [
  { key: 'nom_cours', label: 'Cours', sortable: true },
  { key: 'coach', label: 'Coach', sortable: true },
  { key: 'date_heure_debut', label: 'Date & heure', sortable: true },
  { key: 'duree_min', label: 'Durée', sortable: true },
  { key: 'places', label: 'Places', sortable: false },
];

const lignesAffichees = computed(() =>
  cours.value.map((c) => ({ ...c, places: `${c.reservations ?? 0} / ${c.capacite_max}` }))
);

const form = reactive({ nom_cours: '', date_heure_debut: '', duree_min: 60, capacite_max: 15 });

const erreurs = computed(() => ({
  nom_cours: form.nom_cours.trim().length < 3 ? 'Minimum 3 caractères.' : null,
  date_heure_debut: !form.date_heure_debut ? 'Date requise.' : (new Date(form.date_heure_debut) < new Date() ? 'La date doit être future.' : null),
  duree_min: form.duree_min <= 0 ? 'Durée invalide.' : null,
  capacite_max: form.capacite_max <= 0 ? 'Capacité invalide.' : null,
}));

const formValide = computed(() => Object.values(erreurs.value).every((e) => !e));

async function charger() {
  chargement.value = true;
  try {
    const { data } = await listerCours();
    cours.value = data;
    donneesDemo.value = false;
  } catch {
    cours.value = coursDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

function ouvrirModale() {
  Object.assign(form, { nom_cours: '', date_heure_debut: '', duree_min: 60, capacite_max: 15 });
  modaleOuverte.value = true;
}

async function enregistrer() {
  if (!formValide.value) return;
  enregistrement.value = true;
  try {
    await creerCours({ ...form });
    toast.succes('Cours créé.');
    charger();
  } catch {
    // Endpoint pas encore disponible : on ajoute quand meme localement pour la demo.
    cours.value.unshift({ id: Date.now(), ...form, coach: '—', reservations: 0 });
    toast.succes('Cours ajouté (mode démonstration).');
  } finally {
    enregistrement.value = false;
    modaleOuverte.value = false;
  }
}

onMounted(charger);
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h2 class="h4 mb-1">Cours</h2>
        <p class="ag-text-muted mb-0">Planning des cours collectifs et taux de remplissage.</p>
      </div>
      <button class="btn btn-primary d-inline-flex align-items-center gap-2" @click="ouvrirModale">
        <i class="bi bi-plus-lg"></i> Nouveau cours
      </button>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/cours</code> n'est pas encore connecté côté backend.</span>
    </div>

    <DataTable
      :columns="colonnes"
      :rows="lignesAffichees"
      :chargement="chargement"
      titre-export="cours"
      vide-titre="Aucun cours planifié"
      vide-message="Créez votre premier cours collectif."
    >
      <template #cell-date_heure_debut="{ valeur }">{{ formaterDate(valeur, true) }}</template>
      <template #cell-duree_min="{ valeur }">{{ valeur }} min</template>
      <template #cell-places="{ ligne }">
        <span class="ag-mono" :class="{ 'text-danger fw-semibold': ligne.reservations >= ligne.capacite_max }">
          {{ ligne.places }}
        </span>
      </template>
    </DataTable>

    <AgModal :ouverte="modaleOuverte" titre="Nouveau cours" @fermer="modaleOuverte = false">
      <form class="d-flex flex-column gap-3" @submit.prevent="enregistrer">
        <div>
          <label class="form-label small fw-medium">Nom du cours</label>
          <input v-model="form.nom_cours" type="text" class="form-control" :class="{ 'is-invalid': form.nom_cours && erreurs.nom_cours }" placeholder="Ex. CrossFit" />
          <div v-if="form.nom_cours && erreurs.nom_cours" class="invalid-feedback">{{ erreurs.nom_cours }}</div>
        </div>
        <div>
          <label class="form-label small fw-medium">Date et heure</label>
          <input v-model="form.date_heure_debut" type="datetime-local" class="form-control" :class="{ 'is-invalid': form.date_heure_debut && erreurs.date_heure_debut }" />
          <div v-if="form.date_heure_debut && erreurs.date_heure_debut" class="invalid-feedback">{{ erreurs.date_heure_debut }}</div>
        </div>
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-medium">Durée (min)</label>
            <input v-model.number="form.duree_min" type="number" min="1" class="form-control" :class="{ 'is-invalid': erreurs.duree_min }" />
          </div>
          <div class="col-6">
            <label class="form-label small fw-medium">Capacité max</label>
            <input v-model.number="form.capacite_max" type="number" min="1" class="form-control" :class="{ 'is-invalid': erreurs.capacite_max }" />
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline-secondary" @click="modaleOuverte = false">Annuler</button>
        <button class="btn btn-primary" :disabled="!formValide || enregistrement" @click="enregistrer">
          <span v-if="enregistrement" class="spinner-border spinner-border-sm me-2"></span>
          Créer le cours
        </button>
      </template>
    </AgModal>
  </div>
</template>
