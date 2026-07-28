import client from './client';

export function rechercherAdherentParTelephone(telephone) {
  return client.get('/staff/adherents/rechercher', { params: { telephone } });
}

export function creerAbonnementSurPlace(donnees) {
  return client.post('/staff/abonnements', donnees);
}
