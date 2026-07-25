<script setup>
defineProps({
  label: { type: String, required: true },
  valeur: { type: [String, Number], required: true },
  tendance: { type: Number, default: null }, // +12.4 ou -3.2
  icone: { type: String, default: 'bi-graph-up' },
  couleur: { type: String, default: 'primary' }, // primary | accent | success | warning
});
</script>

<template>
  <div class="ag-card ag-card--hover ag-kpi p-3 p-md-4">
    <div class="d-flex align-items-start justify-content-between mb-3">
      <span class="ag-kpi__icon" :class="`ag-kpi__icon--${couleur}`">
        <i class="bi" :class="icone"></i>
      </span>
      <span
        v-if="tendance !== null"
        class="ag-pill"
        :class="tendance >= 0 ? 'ag-pill--success' : 'ag-pill--danger'"
      >
        {{ tendance >= 0 ? '+' : '' }}{{ tendance }}%
      </span>
    </div>
    <p class="ag-mono fw-bold mb-1" style="font-size: 1.75rem; line-height: 1;">{{ valeur }}</p>
    <p class="ag-text-muted small mb-0">{{ label }}</p>
  </div>
</template>

<style scoped>
.ag-kpi__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--ag-radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.ag-kpi__icon--primary { background: var(--ag-primary-soft); color: var(--ag-primary); }
.ag-kpi__icon--accent { background: var(--ag-accent-soft); color: var(--ag-accent); }
.ag-kpi__icon--success { background: var(--ag-success-soft); color: var(--ag-success); }
.ag-kpi__icon--warning { background: var(--ag-warning-soft); color: var(--ag-warning); }
</style>
