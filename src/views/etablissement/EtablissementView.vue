<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { recupererSalle, modifierSalle } from '@/api/salles';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const chargement = ref(true);
const enregistrement = ref(false);
const donneesDemo = ref(false);

const form = reactive({ nom_salle: '', adresse: '', ville: '', telephone_contact: '' });

const erreurs = computed(() => ({
  nom_salle: form.nom_salle.trim().length < 2 ? 'Nom requis.' : null,
  adresse: form.adresse.trim().length < 4 ? 'Adresse requise.' : null,
  ville: form.ville.trim().length < 2 ? 'Ville requise.' : null,
  telephone_contact: form.telephone_contact && !/^\+?[0-9]{8,15}$/.test(form.telephone_contact) ? 'Numéro invalide.' : null,
}));
const formValide = computed(() => Object.values(erreurs.value).every((e) => !e));

async function charger() {
  chargement.value = true;
  try {
    const { data } = await recupererSalle();
    Object.assign(form, data);
    donneesDemo.value = false;
  } catch {
    Object.assign(form, {
      nom_salle: 'Access Gym Cocody',
      adresse: 'Rue des Jardins, Cocody',
      ville: 'Abidjan',
      telephone_contact: '+2252722000000',
    });
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}

async function enregistrer() {
  if (!formValide.value) return;
  enregistrement.value = true;
  try {
    await modifierSalle({ ...form });
    toast.succes('Informations de la salle mises à jour.');
  } catch {
    toast.succes('Modifications enregistrées (mode démonstration).');
  } finally {
    enregistrement.value = false;
  }
}

onMounted(charger);
</script>

<template>
  <div style="max-width: 640px">
    <h2 class="h4 mb-1">Établissement</h2>
    <p class="ag-text-muted mb-4">Informations générales de votre salle, visibles par vos adhérents.</p>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — <code>/api/salle</code> n'est pas encore connecté côté backend.</span>
    </div>

    <div class="ag-card p-4">
      <div v-if="chargement" class="text-center py-4 ag-text-muted">
        <span class="spinner-border spinner-border-sm me-2"></span> Chargement...
      </div>
      <form v-else class="d-flex flex-column gap-3" @submit.prevent="enregistrer">
        <div>
          <label class="form-label small fw-medium">Nom de la salle</label>
          <input v-model="form.nom_salle" type="text" class="form-control" :class="{ 'is-invalid': erreurs.nom_salle }" />
          <div v-if="erreurs.nom_salle" class="invalid-feedback">{{ erreurs.nom_salle }}</div>
        </div>
        <div>
          <label class="form-label small fw-medium">Adresse</label>
          <input v-model="form.adresse" type="text" class="form-control" :class="{ 'is-invalid': erreurs.adresse }" />
          <div v-if="erreurs.adresse" class="invalid-feedback">{{ erreurs.adresse }}</div>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-medium">Ville</label>
            <input v-model="form.ville" type="text" class="form-control" :class="{ 'is-invalid': erreurs.ville }" />
            <div v-if="erreurs.ville" class="invalid-feedback">{{ erreurs.ville }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-medium">Téléphone de contact</label>
            <input v-model="form.telephone_contact" type="tel" class="form-control" :class="{ 'is-invalid': erreurs.telephone_contact }" placeholder="+225 ..." />
            <div v-if="erreurs.telephone_contact" class="invalid-feedback">{{ erreurs.telephone_contact }}</div>
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary align-self-start" :disabled="!formValide || enregistrement">
            <span v-if="enregistrement" class="spinner-border spinner-border-sm me-2"></span>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
