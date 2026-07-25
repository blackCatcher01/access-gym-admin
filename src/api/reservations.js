import client from './client';

// Backend a venir : GET /api/reservations, PATCH /api/reservations/{id}
export function listerReservations(params = {}) {
  return client.get('/reservations', { params });
}

export function annulerReservation(idReservation) {
  return client.patch(`/reservations/${idReservation}`, { statut_reservation: 'annulee' });
}
