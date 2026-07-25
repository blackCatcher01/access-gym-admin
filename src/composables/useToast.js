import { reactive } from 'vue';

const toasts = reactive([]);
let idSuivant = 1;

function pousser(type, message, { duree = 4000, titre } = {}) {
  const id = idSuivant++;
  toasts.push({ id, type, message, titre });
  if (duree) {
    setTimeout(() => retirer(id), duree);
  }
  return id;
}

function retirer(id) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

export function useToast() {
  return {
    toasts,
    succes: (message, options) => pousser('success', message, options),
    erreur: (message, options) => pousser('danger', message, options),
    info: (message, options) => pousser('info', message, options),
    avertissement: (message, options) => pousser('warning', message, options),
    retirer,
  };
}
