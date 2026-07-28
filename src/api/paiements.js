import client from './client';

// Backend a venir : GET /api/paiements
export function listerPaiements(params = {}) {
  return client.get('/paiements', { params });
}
