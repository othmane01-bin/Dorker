const PREFIX = 'dorker:';

function hasChromeStorage(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.storage !== 'undefined' &&
    typeof chrome.storage.local !== 'undefined'
  );
}

/** Read a value from chrome.storage.local, with a localStorage fallback for dev previews. */
export async function loadSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(key);
      return (result[key] as T | undefined) ?? fallback;
    }

    const raw = window.localStorage.getItem(`${PREFIX}${key}`);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** Persist a value locally. Nothing ever leaves the browser. */
export async function saveSetting<T>(key: string, value: T): Promise<void> {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [key]: value });
      return;
    }

    window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in restricted contexts. The tool still works.
  }
}
