<script setup>
import { useToast } from '@/composables/useToast';

const { toasts, retirer } = useToast();

const icones = {
  success: 'bi-check-circle-fill',
  danger: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};
</script>

<template>
  <div class="ag-toast-host" role="region" aria-live="polite" aria-label="Notifications">
    <TransitionGroup name="ag-toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="ag-toast"
        :class="`ag-toast--${t.type}`"
        role="status"
      >
        <i class="bi" :class="icones[t.type]"></i>
        <div class="ag-toast__body">
          <strong v-if="t.titre">{{ t.titre }}</strong>
          <span>{{ t.message }}</span>
        </div>
        <button type="button" class="ag-toast__close" @click="retirer(t.id)" aria-label="Fermer">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.ag-toast-host {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1080;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(360px, calc(100vw - 2rem));
}
.ag-toast {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--ag-radius-md);
  background: var(--ag-surface);
  border: 1px solid var(--ag-border);
  box-shadow: var(--ag-shadow-lg);
  font-size: 0.875rem;
}
.ag-toast--success { color: var(--ag-success); }
.ag-toast--danger { color: var(--ag-danger); }
.ag-toast--warning { color: var(--ag-warning); }
.ag-toast--info { color: var(--ag-info); }
.ag-toast__body {
  display: flex;
  flex-direction: column;
  color: var(--ag-text);
  flex: 1;
}
.ag-toast__close {
  background: none;
  border: none;
  color: var(--ag-text-faint);
  line-height: 1;
  padding: 0;
}
.ag-toast-enter-active, .ag-toast-leave-active {
  transition: all 220ms var(--ag-ease);
}
.ag-toast-enter-from { opacity: 0; transform: translateX(20px); }
.ag-toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
