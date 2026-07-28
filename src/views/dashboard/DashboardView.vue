<script setup>
import { ref } from 'vue';
import KpiCard from '@/components/ui/KpiCard.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

// Données de démonstration — à remplacer par des appels API
// (GET /api/dashboard/kpis) une fois l'endpoint gérant en place.
const kpis = ref([
  { label: 'Adhérents actifs', valeur: '248', tendance: 4.2, icone: 'bi-people-fill', couleur: 'primary' },
  { label: 'Revenus du mois', valeur: '2.4M XOF', tendance: 12.1, icone: 'bi-cash-coin', couleur: 'success' },
  { label: 'Passages aujourd\'hui', valeur: '37', tendance: -2.4, icone: 'bi-door-open-fill', couleur: 'accent' },
  { label: 'Abonnements à renouveler', valeur: '15', tendance: null, icone: 'bi-exclamation-circle-fill', couleur: 'warning' },
]);

const activiteRecente = ref([
  { id: 1, label: 'Fatou Koné a réservé le cours de 18h — CrossFit', temps: 'Il y a 12 min', icone: 'bi-calendar-check' },
  { id: 2, label: 'Paiement Wave confirmé — 15 000 XOF', temps: 'Il y a 34 min', icone: 'bi-cash-coin' },
  { id: 3, label: 'Nouvel adhérent inscrit — Ibrahim Traoré', temps: 'Il y a 1h', icone: 'bi-person-plus' },
  { id: 4, label: 'Abonnement expiré — Aya N\'Guessan', temps: 'Il y a 2h', icone: 'bi-exclamation-triangle' },
]);
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="h4 mb-1">Bonjour {{ auth.utilisateur?.nom?.split(' ')[0] || '' }} 👋</h2>
      <p class="ag-text-muted mb-0">Voici ce qui se passe dans votre salle aujourd'hui.</p>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="kpi in kpis" :key="kpi.label" class="col-6 col-xl-3">
        <KpiCard v-bind="kpi" />
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-8">
        <div class="ag-card p-4 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="h6 mb-0">Fréquentation — 7 derniers jours</h3>
          </div>
          <div class="ag-chart-placeholder">
            <i class="bi bi-bar-chart-line ag-text-faint" style="font-size: 2rem"></i>
            <p class="ag-text-muted small mb-0 mt-2">
              Graphique connecté à l'API à venir (module Cours & réservations).
            </p>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="ag-card p-4 h-100">
          <h3 class="h6 mb-3">Activité récente</h3>
          <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
            <li v-for="a in activiteRecente" :key="a.id" class="d-flex gap-3">
              <span class="ag-activity-icon"><i class="bi" :class="a.icone"></i></span>
              <div>
                <p class="mb-0 small">{{ a.label }}</p>
                <p class="mb-0 ag-text-faint" style="font-size: 0.75rem">{{ a.temps }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ag-chart-placeholder {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--ag-surface-2);
  border-radius: var(--ag-radius-md);
  text-align: center;
  padding: 1rem;
}
.ag-activity-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--ag-radius-md);
  background: var(--ag-surface-2);
  color: var(--ag-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
}
</style>
