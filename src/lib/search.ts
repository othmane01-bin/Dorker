export type SearchEngine = 'google' | 'bing' | 'duckduckgo';

export interface EngineOption {
  id: SearchEngine;
  label: string;
  short: string;
  url: string;
}

export const ENGINES: EngineOption[] = [
  { id: 'google', label: 'Google', short: 'GOOGLE', url: 'https://www.google.com/search?q=' },
  { id: 'bing', label: 'Bing', short: 'BING', url: 'https://www.bing.com/search?q=' },
  {
    id: 'duckduckgo',
    label: 'DuckDuckGo',
    short: 'DUCKDUCKGO',
    url: 'https://duckduckgo.com/?q=',
  },
];

export const ENGINE_LABELS: Record<SearchEngine, string> = {
  google: 'GOOGLE',
  bing: 'BING',
  duckduckgo: 'DUCKDUCKGO',
};

export function isSearchEngine(value: unknown): value is SearchEngine {
  return value === 'google' || value === 'bing' || value === 'duckduckgo';
}

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  const option = ENGINES.find((item) => item.id === engine) ?? ENGINES[0];
  return `${option.url}${encodeURIComponent(query)}`;
}

/** Open a search in a new tab, using the extension API when available. */
export function openSearch(engine: SearchEngine, query: string): void {
  const url = buildSearchUrl(engine, query);

  if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
    void chrome.tabs.create({ url });
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
