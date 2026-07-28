<script setup>
defineProps({
  ouvert: { type: Boolean, required: true },
  titre: { type: String, default: '' },
});
const emit = defineEmits(['fermer']);
</script>

<template>
  <Teleport to="body">
    <Transition name="ag-drawer-fade">
      <div v-if="ouvert" class="ag-drawer__backdrop" @click.self="emit('fermer')">
        <Transition name="ag-drawer-slide" appear>
          <aside class="ag-drawer" role="dialog" aria-modal="true" :aria-label="titre">
            <div class="ag-drawer__header">
              <h2 class="h6 mb-0">{{ titre }}</h2>
              <button class="ag-modal__close" @click="emit('fermer')" aria-label="Fermer">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="ag-drawer__body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="ag-drawer__footer">
              <slot name="footer" />
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ag-drawer__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 16, 0.5);
  z-index: 1090;
  display: flex;
  justify-content: flex-end;
}
.ag-drawer {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: var(--ag-surface);
  box-shadow: var(--ag-shadow-lg);
  display: flex;
  flex-direction: column;
}
.ag-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--ag-border);
}
.ag-modal__close { background: none; border: none; color: var(--ag-text-faint); }
.ag-drawer__body { padding: 1.25rem; overflow-y: auto; flex: 1; }
.ag-drawer__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--ag-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ag-drawer-fade-enter-active, .ag-drawer-fade-leave-active { transition: opacity 200ms var(--ag-ease); }
.ag-drawer-fade-enter-from, .ag-drawer-fade-leave-to { opacity: 0; }
.ag-drawer-slide-enter-active, .ag-drawer-slide-leave-active { transition: transform 220ms var(--ag-ease); }
.ag-drawer-slide-enter-from, .ag-drawer-slide-leave-to { transform: translateX(100%); }
</style>
