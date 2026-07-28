<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import AgModal from '@/components/ui/AgModal.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import {
  listerBoutiques, creerBoutique, modifierBoutique, supprimerBoutique,
  listerCategories, creerCategorie, supprimerCategorie,
  listerProduits, creerProduit, modifierProduit, supprimerProduit,
} from '@/api/marketplace';
import { formaterMontant } from '@/utils/format';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { demander } = useConfirm();

const onglet = ref('produits');
const chargement = ref(true);
const donneesDemo = ref(false);

const boutiques = ref([]);
const categories = ref([]);
const produits = ref([]);

const boutiquesDemo = [
  { id_boutique: 1, nom: 'SportShop CI', ville: 'Abidjan', telephone_contact: '+2250700001111', actif: true },
  { id_boutique: 2, nom: 'FitGear Abidjan', ville: 'Abidjan', telephone_contact: '+2250700002222', actif: true },
];
const categoriesDemo = [
  { id_categorie: 1, nom: 'Vêtements de sport' },
  { id_categorie: 2, nom: 'Accessoires' },
];
const produitsDemo = [
  { id_produit: 1, nom: 'Legging sport', prix: 8000, stock: 25, actif: true, boutique: { nom: 'SportShop CI' }, categorie: { nom: 'Vêtements de sport' } },
  { id_produit: 2, nom: 'Gourde 1L', prix: 3500, stock: 40, actif: true, boutique: { nom: 'FitGear Abidjan' }, categorie: { nom: 'Accessoires' } },
];

async function charger() {
  chargement.value = true;
  try {
    const [rb, rc, rp] = await Promise.all([listerBoutiques(), listerCategories(), listerProduits()]);
    boutiques.value = rb.data.data ?? rb.data;
    categories.value = rc.data;
    produits.value = rp.data.data ?? rp.data;
    donneesDemo.value = false;
  } catch {
    boutiques.value = boutiquesDemo;
    categories.value = categoriesDemo;
    produits.value = produitsDemo;
    donneesDemo.value = true;
  } finally {
    chargement.value = false;
  }
}
onMounted(charger);

// -- Colonnes --
const colonnesBoutiques = [
  { key: 'nom', label: 'Boutique', sortable: true },
  { key: 'ville', label: 'Ville', sortable: true },
  { key: 'telephone_contact', label: 'Contact', sortable: false },
  { key: 'actif', label: 'Statut', sortable: true },
];
const colonnesProduits = [
  { key: 'nom', label: 'Produit', sortable: true },
  { key: 'boutique_nom', label: 'Boutique', sortable: true },
  { key: 'categorie_nom', label: 'Catégorie', sortable: false },
  { key: 'prix', label: 'Prix', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'actif', label: 'Statut', sortable: true },
];

const produitsAffiches = computed(() =>
  produits.value.map((p) => ({
    ...p,
    boutique_nom: p.boutique?.nom,
    categorie_nom: p.categorie?.nom ?? '—',
  }))
);

// -- Modale boutique --
const modaleBoutiqueOuverte = ref(false);
const formBoutique = reactive({ id_boutique: null, nom: '', ville: '', telephone_contact: '', adresse: '' });
function ouvrirNouvelleBoutique() {
  Object.assign(formBoutique, { id_boutique: null, nom: '', ville: '', telephone_contact: '', adresse: '' });
  modaleBoutiqueOuverte.value = true;
}
async function enregistrerBoutique() {
  try {
    if (formBoutique.id_boutique) {
      await modifierBoutique(formBoutique.id_boutique, formBoutique);
    } else {
      await creerBoutique(formBoutique);
    }
    toast.succes('Boutique enregistrée.');
    modaleBoutiqueOuverte.value = false;
    charger();
  } catch {
    toast.erreur("Impossible d'enregistrer la boutique.");
  }
}
async function supprimerBoutiqueAction(ligne) {
  const ok = await demander({ titre: 'Supprimer cette boutique ?', message: `"${ligne.nom}" et ses produits ne seront plus visibles.`, danger: true, labelConfirmer: 'Supprimer' });
  if (!ok) return;
  try {
    await supprimerBoutique(ligne.id_boutique);
    toast.succes('Boutique supprimée.');
    charger();
  } catch {
    toast.erreur('Suppression impossible (mode démonstration ?).');
  }
}

// -- Modale produit --
const modaleProduitOuverte = ref(false);
const formProduit = reactive({ id_produit: null, id_boutique: null, id_categorie: null, nom: '', prix: 0, stock: 0, description: '' });
function ouvrirNouveauProduit() {
  Object.assign(formProduit, { id_produit: null, id_boutique: boutiques.value[0]?.id_boutique ?? null, id_categorie: null, nom: '', prix: 0, stock: 0, description: '' });
  modaleProduitOuverte.value = true;
}
const produitValide = computed(() => formProduit.nom.trim().length >= 2 && formProduit.id_boutique && formProduit.prix >= 0);
async function enregistrerProduit() {
  if (!produitValide.value) return;
  try {
    if (formProduit.id_produit) {
      await modifierProduit(formProduit.id_produit, formProduit);
    } else {
      await creerProduit(formProduit);
    }
    toast.succes('Produit enregistré.');
    modaleProduitOuverte.value = false;
    charger();
  } catch {
    toast.erreur("Impossible d'enregistrer le produit.");
  }
}
async function supprimerProduitAction(ligne) {
  const ok = await demander({ titre: 'Supprimer ce produit ?', message: `"${ligne.nom}" ne sera plus visible dans le marketplace.`, danger: true, labelConfirmer: 'Supprimer' });
  if (!ok) return;
  try {
    await supprimerProduit(ligne.id_produit);
    toast.succes('Produit supprimé.');
    charger();
  } catch {
    toast.erreur('Suppression impossible (mode démonstration ?).');
  }
}

// -- Catégorie rapide --
const nouvelleCategorie = ref('');
async function ajouterCategorie() {
  if (!nouvelleCategorie.value.trim()) return;
  try {
    await creerCategorie({ nom: nouvelleCategorie.value.trim() });
    nouvelleCategorie.value = '';
    toast.succes('Catégorie ajoutée.');
    charger();
  } catch {
    toast.erreur("Impossible d'ajouter la catégorie.");
  }
}
async function supprimerCategorieAction(cat) {
  const ok = await demander({ titre: 'Supprimer cette catégorie ?', message: `"${cat.nom}" sera retirée (les produits associés restent, sans catégorie).`, danger: true, labelConfirmer: 'Supprimer' });
  if (!ok) return;
  try {
    await supprimerCategorie(cat.id_categorie);
    toast.succes('Catégorie supprimée.');
    charger();
  } catch {
    toast.erreur('Suppression impossible (mode démonstration ?).');
  }
}
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="h4 mb-1">Marketplace</h2>
      <p class="ag-text-muted mb-0">Boutiques partenaires et produits visibles dans l'application.</p>
    </div>

    <div v-if="donneesDemo" class="alert alert-warning d-flex align-items-center gap-2 mb-3" role="status">
      <i class="bi bi-info-circle"></i>
      <span class="small mb-0">Données de démonstration — les endpoints marketplace ne répondent pas (backend non démarré ou droits insuffisants).</span>
    </div>

    <ul class="nav nav-pills gap-2 mb-3">
      <li class="nav-item"><button class="ag-tab" :class="{ 'ag-tab--actif': onglet === 'produits' }" @click="onglet = 'produits'">Produits</button></li>
      <li class="nav-item"><button class="ag-tab" :class="{ 'ag-tab--actif': onglet === 'boutiques' }" @click="onglet = 'boutiques'">Boutiques</button></li>
      <li class="nav-item"><button class="ag-tab" :class="{ 'ag-tab--actif': onglet === 'categories' }" @click="onglet = 'categories'">Catégories</button></li>
    </ul>

    <!-- Produits -->
    <div v-if="onglet === 'produits'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary d-inline-flex align-items-center gap-2" @click="ouvrirNouveauProduit">
          <i class="bi bi-plus-lg"></i> Nouveau produit
        </button>
      </div>
      <DataTable :columns="colonnesProduits" :rows="produitsAffiches" :chargement="chargement" cle-ligne="id_produit" titre-export="produits">
        <template #cell-prix="{ valeur }">{{ formaterMontant(valeur) }}</template>
        <template #cell-actif="{ valeur }"><StatusPill :statut="valeur ? 'actif' : 'inactif'" /></template>
        <template #cell-categorie_nom="{ ligne }">
          <div class="d-flex justify-content-between align-items-center gap-2">
            <span>{{ ligne.categorie_nom }}</span>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-secondary" @click.stop="Object.assign(formProduit, ligne); modaleProduitOuverte = true">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click.stop="supprimerProduitAction(ligne)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Boutiques -->
    <div v-else-if="onglet === 'boutiques'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary d-inline-flex align-items-center gap-2" @click="ouvrirNouvelleBoutique">
          <i class="bi bi-plus-lg"></i> Nouvelle boutique
        </button>
      </div>
      <DataTable :columns="colonnesBoutiques" :rows="boutiques" :chargement="chargement" cle-ligne="id_boutique" titre-export="boutiques">
        <template #cell-actif="{ ligne, valeur }">
          <div class="d-flex justify-content-between align-items-center gap-2">
            <StatusPill :statut="valeur ? 'actif' : 'inactif'" />
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-secondary" @click.stop="Object.assign(formBoutique, ligne); modaleBoutiqueOuverte = true">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click.stop="supprimerBoutiqueAction(ligne)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Catégories -->
    <div v-else class="ag-card p-4" style="max-width: 480px">
      <h3 class="h6 mb-3">Catégories de produits</h3>
      <div class="d-flex gap-2 mb-3">
        <input v-model="nouvelleCategorie" type="text" class="form-control" placeholder="Nouvelle catégorie" @keyup.enter="ajouterCategorie" />
        <button class="btn btn-primary" @click="ajouterCategorie"><i class="bi bi-plus-lg"></i></button>
      </div>
      <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
        <li v-for="cat in categories" :key="cat.id_categorie" class="d-flex justify-content-between align-items-center ag-card p-2 px-3">
          <span class="small">{{ cat.nom }}</span>
          <button class="btn btn-sm btn-outline-danger" @click="supprimerCategorieAction(cat)"><i class="bi bi-trash"></i></button>
        </li>
      </ul>
    </div>

    <!-- Modale boutique -->
    <AgModal :ouverte="modaleBoutiqueOuverte" :titre="formBoutique.id_boutique ? 'Modifier la boutique' : 'Nouvelle boutique'" @fermer="modaleBoutiqueOuverte = false">
      <form class="d-flex flex-column gap-3" @submit.prevent="enregistrerBoutique">
        <div>
          <label class="form-label small fw-medium">Nom</label>
          <input v-model="formBoutique.nom" type="text" class="form-control" />
        </div>
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-medium">Ville</label>
            <input v-model="formBoutique.ville" type="text" class="form-control" />
          </div>
          <div class="col-6">
            <label class="form-label small fw-medium">Téléphone</label>
            <input v-model="formBoutique.telephone_contact" type="text" class="form-control" />
          </div>
        </div>
        <div>
          <label class="form-label small fw-medium">Adresse</label>
          <input v-model="formBoutique.adresse" type="text" class="form-control" />
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline-secondary" @click="modaleBoutiqueOuverte = false">Annuler</button>
        <button class="btn btn-primary" @click="enregistrerBoutique">Enregistrer</button>
      </template>
    </AgModal>

    <!-- Modale produit -->
    <AgModal :ouverte="modaleProduitOuverte" :titre="formProduit.id_produit ? 'Modifier le produit' : 'Nouveau produit'" @fermer="modaleProduitOuverte = false">
      <form class="d-flex flex-column gap-3" @submit.prevent="enregistrerProduit">
        <div>
          <label class="form-label small fw-medium">Nom</label>
          <input v-model="formProduit.nom" type="text" class="form-control" />
        </div>
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-medium">Boutique</label>
            <select v-model="formProduit.id_boutique" class="form-select">
              <option v-for="b in boutiques" :key="b.id_boutique" :value="b.id_boutique">{{ b.nom }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label small fw-medium">Catégorie</label>
            <select v-model="formProduit.id_categorie" class="form-select">
              <option :value="null">Aucune</option>
              <option v-for="c in categories" :key="c.id_categorie" :value="c.id_categorie">{{ c.nom }}</option>
            </select>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-medium">Prix (XOF)</label>
            <input v-model.number="formProduit.prix" type="number" min="0" class="form-control" />
          </div>
          <div class="col-6">
            <label class="form-label small fw-medium">Stock</label>
            <input v-model.number="formProduit.stock" type="number" min="0" class="form-control" />
          </div>
        </div>
        <div>
          <label class="form-label small fw-medium">Description</label>
          <textarea v-model="formProduit.description" class="form-control" rows="2"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline-secondary" @click="modaleProduitOuverte = false">Annuler</button>
        <button class="btn btn-primary" :disabled="!produitValide" @click="enregistrerProduit">Enregistrer</button>
      </template>
    </AgModal>
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
</style>
