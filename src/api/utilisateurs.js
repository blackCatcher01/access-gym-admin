import client from './client';

// Ces endpoints ne sont pas encore construits côté Laravel (prochaine étape
// backend : GET /api/adherents, GET /api/staff avec scoping par salle et
// policies). En attendant, le front reste fonctionnel via des données de
// démonstration (voir UsersView.vue).
export function listerAdherents(params = {}) {
  return client.get('/adherents', { params });
}

export function listerStaff(params = {}) {
  return client.get('/staff', { params });
}

export function changerStatutUtilisateur(idUtilisateur, estActif) {
  return client.patch(`/utilisateurs/${idUtilisateur}`, { is_active: estActif });
}
