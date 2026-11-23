/**
 * Domain helpers shared by every dork generator.
 */
export function normalizeDomain(value: string): string {
  return value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, '')
    .toLowerCase();
}

export function isValidDomain(value: string): boolean {
  const domain = normalizeDomain(value);
  if (!domain || domain.includes(' ') || domain.length > 253) return false;

  return /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain);
}

/** Normalize a free-text phrase and strip characters that would break a dork. */
export function cleanPhrase(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/"/g, '');
}

/** Replace template tokens and collapse whitespace. */
export function renderDork(template: string, domain: string, keyword: string): string {
  return template
    .replace(/\{target\}/g, domain)
    .replace(/\{keyword\}/g, cleanPhrase(keyword))
    .replace(/\s+/g, ' ')
    .trim();
}
