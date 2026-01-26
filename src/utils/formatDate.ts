export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
  });
}

export function isExpired(dateString: string): boolean {
  const expirationDate = new Date(dateString);
  const now = new Date();
  return expirationDate < now;
}

export function isExpiringSoon(dateString: string, daysThreshold: number = 30): boolean {
  const expirationDate = new Date(dateString);
  const now = new Date();
  const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
  return expirationDate > now && expirationDate <= thresholdDate;
}

export function getExpirationStatus(dateString: string): 'expired' | 'expiring-soon' | 'active' {
  if (isExpired(dateString)) return 'expired';
  if (isExpiringSoon(dateString)) return 'expiring-soon';
  return 'active';
}
