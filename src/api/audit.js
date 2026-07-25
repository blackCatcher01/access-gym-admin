import client from './client';

// Backend a venir : GET /api/journal-audit
export function listerJournalAudit(params = {}) {
  return client.get('/journal-audit', { params });
}
