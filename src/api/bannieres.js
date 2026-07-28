import client from './client';

export function listerBannieres() {
  return client.get('/bannieres');
}
export function creerBanniere(donnees) {
  return client.post('/bannieres', donnees);
}
export function modifierBanniere(id, donnees) {
  return client.patch(`/bannieres/${id}`, donnees);
}
export function supprimerBanniere(id) {
  return client.delete(`/bannieres/${id}`);
}
