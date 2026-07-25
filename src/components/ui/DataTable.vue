<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key, label, sortable, class }]
  rows: { type: Array, required: true },
  chargement: { type: Boolean, default: false },
  taillePageDefaut: { type: Number, default: 10 },
  rechercheGlobale: { type: Boolean, default: true },
  cleLigne: { type: String, default: 'id' },
  titreExport: { type: String, default: 'export' },
  videTitre: { type: String, default: 'Aucun résultat' },
  videMessage: { type: String, default: 'Ajustez vos filtres ou votre recherche.' },
});

const emit = defineEmits(['row-click']);

const recherche = ref('');
const triCle = ref(null);
const triDirection = ref('asc');
const pageActuelle = ref(1);
const taillePage = ref(props.taillePageDefaut);

function basculerTri(colonne) {
  if (!colonne.sortable) return;
  if (triCle.value === colonne.key) {
    triDirection.value = triDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    triCle.value = colonne.key;
    triDirection.value = 'asc';
  }
}

const lignesFiltrees = computed(() => {
  if (!recherche.value.trim()) return props.rows;
  const q = recherche.value.trim().toLowerCase();
  return props.rows.filter((ligne) =>
    props.columns.some((col) => String(ligne[col.key] ?? '').toLowerCase().includes(q))
  );
});

const lignesTriees = computed(() => {
  if (!triCle.value) return lignesFiltrees.value;
  const copie = [...lignesFiltrees.value];
  copie.sort((a, b) => {
    const va = a[triCle.value];
    const vb = b[triCle.value];
    if (va == null) return 1;
    if (vb == null) return -1;
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return triDirection.value === 'asc' ? cmp : -cmp;
  });
  return copie;
});

const totalPages = computed(() => Math.max(1, Math.ceil(lignesTriees.value.length / taillePage.value)));

const lignesPage = computed(() => {
  const debut = (pageActuelle.value - 1) * taillePage.value;
  return lignesTriees.value.slice(debut, debut + taillePage.value);
});

function allerPage(n) {
  pageActuelle.value = Math.min(Math.max(1, n), totalPages.value);
}

function exporterCsv() {
  const entetes = props.columns.map((c) => c.label).join(';');
  const lignes = lignesTriees.value.map((ligne) =>
    props.columns.map((c) => `"${String(ligne[c.key] ?? '').replace(/"/g, '""')}"`).join(';')
  );
  const contenu = [entetes, ...lignes].join('\n');
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = `${props.titreExport}.csv`;
  lien.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="ag-datatable ag-card">
    <div class="ag-datatable__toolbar">
      <div v-if="rechercheGlobale" class="ag-datatable__search">
        <i class="bi bi-search"></i>
        <input v-model="recherche" type="search" placeholder="Rechercher..." @input="pageActuelle = 1" />
      </div>
      <div class="ms-auto d-flex gap-2">
        <slot name="filtres" />
        <button class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" @click="exporterCsv">
          <i class="bi bi-download"></i> Exporter
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table ag-table mb-0">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :class="[col.class, { 'ag-th-sortable': col.sortable }]" @click="basculerTri(col)">
              <span class="d-inline-flex align-items-center gap-1">
                {{ col.label }}
                <i
                  v-if="col.sortable"
                  class="bi"
                  :class="triCle === col.key ? (triDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up ag-text-faint'"
                  style="font-size: 0.75rem"
                ></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="chargement">
            <td :colspan="columns.length" class="text-center py-5 ag-text-muted">
              <span class="spinner-border spinner-border-sm me-2"></span> Chargement...
            </td>
          </tr>
          <tr v-else-if="lignesPage.length === 0">
            <td :colspan="columns.length" class="text-center py-5">
              <i class="bi bi-inbox ag-text-faint" style="font-size: 1.75rem"></i>
              <p class="fw-medium mb-0 mt-2">{{ videTitre }}</p>
              <p class="ag-text-muted small mb-0">{{ videMessage }}</p>
            </td>
          </tr>
          <tr
            v-for="ligne in lignesPage"
            :key="ligne[cleLigne]"
            @click="emit('row-click', ligne)"
            :style="{ cursor: $attrs.onRowClick ? 'pointer' : 'default' }"
          >
            <td v-for="col in columns" :key="col.key" :class="col.class">
              <slot :name="`cell-${col.key}`" :ligne="ligne" :valeur="ligne[col.key]">
                {{ ligne[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ag-datatable__footer">
      <span class="ag-text-muted small">
        {{ lignesTriees.length }} résultat{{ lignesTriees.length > 1 ? 's' : '' }}
      </span>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" :disabled="pageActuelle === 1" @click="allerPage(pageActuelle - 1)">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="small ag-mono">{{ pageActuelle }} / {{ totalPages }}</span>
        <button class="btn btn-sm btn-outline-secondary" :disabled="pageActuelle === totalPages" @click="allerPage(pageActuelle + 1)">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ag-datatable__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid var(--ag-border);
  flex-wrap: wrap;
}
.ag-datatable__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--ag-surface-2);
  border-radius: var(--ag-radius-md);
  padding: 0.4rem 0.75rem;
  color: var(--ag-text-faint);
  min-width: 220px;
}
.ag-datatable__search input {
  border: none;
  background: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--ag-text);
  width: 100%;
}
.ag-th-sortable { cursor: pointer; user-select: none; }
.ag-datatable__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
}
table td, table th { padding-inline: 1.1rem; }
</style>
