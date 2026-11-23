import { normalizeDomain } from './dork';

/** Read the domain of the active tab when the extension has activeTab access. */
export async function getActiveTabDomain(): Promise<string | null> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) return null;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return null;

    const url = new URL(tab.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

    return normalizeDomain(url.hostname);
  } catch {
    return null;
  }
}

/** Open the popup page as a full tab. */
export function openDorkerTab(): void {
  if (
    typeof chrome !== 'undefined' &&
    chrome.runtime?.getURL &&
    chrome.tabs?.create
  ) {
    void chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
    return;
  }

  window.open(window.location.href, '_blank', 'noopener,noreferrer');
}
