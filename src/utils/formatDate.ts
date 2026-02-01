export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
  });
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isExpired(dateString: string): boolean {
  const expirationDate = stripTime(new Date(dateString));
  const today = stripTime(new Date());
  return expirationDate < today;
}

export function isExpiringSoon(dateString: string, daysThreshold: number = 30): boolean {
  const expirationDate = stripTime(new Date(dateString));
  const today = stripTime(new Date());
  const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
  return expirationDate >= today && expirationDate <= thresholdDate;
}

export function getExpirationStatus(dateString: string): 'expired' | 'expiring-soon' | 'active' {
  if (isExpired(dateString)) return 'expired';
  if (isExpiringSoon(dateString)) return 'expiring-soon';
  return 'active';
}
