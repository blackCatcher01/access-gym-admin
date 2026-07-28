import client from './client';

// Backend a venir : GET /api/abonnements, POST /api/abonnements/{id}/renouveler
export function listerAbonnements(params = {}) {
  return client.get('/abonnements', { params });
}

export function renouvelerAbonnement(idAbonnement) {
  return client.post(`/abonnements/${idAbonnement}/renouveler`);
}
