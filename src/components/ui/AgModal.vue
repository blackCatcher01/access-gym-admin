<script setup>
import { watch } from 'vue';

const props = defineProps({
  ouverte: { type: Boolean, required: true },
  titre: { type: String, default: '' },
  taille: { type: String, default: 'md' }, // sm | md | lg
});
const emit = defineEmits(['fermer']);

watch(() => props.ouverte, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="ag-modal-fade">
      <div v-if="ouverte" class="ag-modal__backdrop" @click.self="emit('fermer')">
        <Transition name="ag-modal-pop" appear>
          <div class="ag-modal" :class="`ag-modal--${taille}`" role="dialog" aria-modal="true" :aria-label="titre">
            <div class="ag-modal__header">
              <h2 class="h6 mb-0">{{ titre }}</h2>
              <button class="ag-modal__close" @click="emit('fermer')" aria-label="Fermer">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="ag-modal__body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="ag-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ag-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 16, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1090;
  padding: 1rem;
}
.ag-modal {
  background: var(--ag-surface);
  border-radius: var(--ag-radius-lg);
  box-shadow: var(--ag-shadow-lg);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.ag-modal--sm { max-width: 400px; }
.ag-modal--md { max-width: 560px; }
.ag-modal--lg { max-width: 800px; }
.ag-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--ag-border);
}
.ag-modal__close {
  background: none;
  border: none;
  color: var(--ag-text-faint);
}
.ag-modal__body { padding: 1.25rem; overflow-y: auto; }
.ag-modal__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--ag-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ag-modal-fade-enter-active, .ag-modal-fade-leave-active { transition: opacity 160ms var(--ag-ease); }
.ag-modal-fade-enter-from, .ag-modal-fade-leave-to { opacity: 0; }
.ag-modal-pop-enter-active { transition: all 200ms var(--ag-ease); }
.ag-modal-pop-enter-from { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
