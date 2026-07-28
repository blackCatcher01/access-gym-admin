import client from './client';

export function listerBoutiques(params = {}) {
  return client.get('/marketplace/boutiques', { params });
}
export function creerBoutique(donnees) {
  return client.post('/marketplace/boutiques', donnees);
}
export function modifierBoutique(id, donnees) {
  return client.patch(`/marketplace/boutiques/${id}`, donnees);
}
export function supprimerBoutique(id) {
  return client.delete(`/marketplace/boutiques/${id}`);
}

export function listerCategories() {
  return client.get('/marketplace/categories');
}
export function creerCategorie(donnees) {
  return client.post('/marketplace/categories', donnees);
}
export function supprimerCategorie(id) {
  return client.delete(`/marketplace/categories/${id}`);
}

export function listerProduits(params = {}) {
  return client.get('/marketplace/produits', { params });
}
export function creerProduit(donnees) {
  return client.post('/marketplace/produits', donnees);
}
export function modifierProduit(id, donnees) {
  return client.patch(`/marketplace/produits/${id}`, donnees);
}
export function supprimerProduit(id) {
  return client.delete(`/marketplace/produits/${id}`);
}
