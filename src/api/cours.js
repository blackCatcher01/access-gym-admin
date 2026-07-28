import client from './client';

// Backend a venir : GET/POST/PATCH/DELETE /api/cours
export function listerCours(params = {}) {
  return client.get('/cours', { params });
}

export function creerCours(donnees) {
  return client.post('/cours', donnees);
}

export function modifierCours(idCours, donnees) {
  return client.patch(`/cours/${idCours}`, donnees);
}

export function supprimerCours(idCours) {
  return client.delete(`/cours/${idCours}`);
}
