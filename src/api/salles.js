import client from './client';

// Backend a venir : GET /api/salle (salle courante du staff connecte), PATCH /api/salle
export function recupererSalle() {
  return client.get('/salle');
}

export function modifierSalle(donnees) {
  return client.patch('/salle', donnees);
}
