export function formaterMontant(valeur) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(valeur) + ' XOF';
}

export function formaterDate(valeur, avecHeure = false) {
  if (!valeur) return '—';
  const date = new Date(valeur);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(avecHeure ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}
