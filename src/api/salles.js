import client from './client';

// Backend a venir : GET /api/salle (salle courante du staff connecte), PATCH /api/salle
export function recupererSalle() {
  return client.get('/salle');
}

export function modifierSalle(donnees) {
  return client.patch('/salle', donnees);
}

// Toutes les salles de la plateforme — utilise par le super_admin pour
// choisir a quelle salle rattacher un nouveau gerant (endpoint deja
// existant, consomme par l'app mobile pour la liste "Salles").
export function listerToutesSalles(params = {}) {
  return client.get('/salles', { params });
}
