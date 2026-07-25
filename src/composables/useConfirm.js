import { reactive } from 'vue';

const etat = reactive({
  ouverte: false,
  titre: '',
  message: '',
  labelConfirmer: 'Confirmer',
  danger: false,
  resolve: null,
});

export function useConfirm() {
  function demander({ titre, message, labelConfirmer = 'Confirmer', danger = false }) {
    etat.titre = titre;
    etat.message = message;
    etat.labelConfirmer = labelConfirmer;
    etat.danger = danger;
    etat.ouverte = true;
    return new Promise((resolve) => {
      etat.resolve = resolve;
    });
  }

  function repondre(valeur) {
    etat.ouverte = false;
    etat.resolve?.(valeur);
  }

  return { etat, demander, repondre };
}
