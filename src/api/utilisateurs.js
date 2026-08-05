import client from './client';

export function listerAdherents(params = {}) {
  return client.get('/adherents', { params });
}

export function listerStaff(params = {}) {
  return client.get('/staff', { params });
}

export function changerStatutUtilisateur(idUtilisateur, estActif) {
  return client.patch(`/utilisateurs/${idUtilisateur}`, { is_active: estActif });
}

export function creerStaff(donnees) {
  return client.post('/staff', donnees);
}

export function creerAdherent(donnees) {
  return client.post('/adherents', donnees);
}
