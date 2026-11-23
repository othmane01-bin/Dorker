import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, ScanSearch } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import DocumentFinder from './pages/DocumentFinder';
import QueryBuilder from './pages/QueryBuilder';
import DorkLibrary from './pages/DorkLibrary';
import HistoryPage from './pages/HistoryPage';
import { DORK_CATEGORIES, isLibraryId } from './data/dorks';
import { TOOL_LABELS, isToolId } from './data/tools';
import { getActiveTabDomain, openDorkerTab } from './lib/activeTab';
import { isValidDomain } from './lib/dork';
import { isSearchEngine, openSearch } from './lib/search';
import type { SearchEngine } from './lib/search';
import { loadSetting, saveSetting } from './lib/storage';
import type { HistoryEntry, ToolId } from './types';

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.query === 'string' &&
    typeof entry.tool === 'string' &&
    typeof entry.createdAt === 'number' &&
    isSearchEngine(entry.engine)
  );
}

function getVersion(): string {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
      return chrome.runtime.getManifest().version;
    }
  } catch {
    // Fall through to the package version.
  }
  return '0.2.0';
}

const VERSION = getVersion();

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('documents');
  const [target, setTarget] = useState('');
  const [keyword, setKeyword] = useState('');
  const [engine, setEngine] = useState<SearchEngine>('google');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const historyRef = useRef<HistoryEntry[]>([]);

  useEffect(() => {
    let alive = true;

    void (async () => {
      const [storedTarget, storedKeyword, storedEngine, storedTool] = await Promise.all([
        loadSetting<string>('target', ''),
        loadSetting<string>('keyword', ''),
        loadSetting<SearchEngine>('engine', 'google'),
        loadSetting<ToolId>('tool', 'documents'),
      ]);

      if (!alive) return;

      if (typeof storedTarget === 'string') setTarget(storedTarget);
      if (typeof storedKeyword === 'string') setKeyword(storedKeyword);
      if (isSearchEngine(storedEngine)) setEngine(storedEngine);
      if (isToolId(storedTool)) setActiveTool(storedTool);

      const params = new URLSearchParams(window.location.search);
      const queryTarget = params.get('target');
      const queryTool = params.get('tool');
      if (queryTarget) setTarget(queryTarget);
      if (queryTool && isToolId(queryTool)) setActiveTool(queryTool);

      setHydrated(true);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    void saveSetting('target', target);
    void saveSetting('keyword', keyword);
    void saveSetting('engine', engine);
    void saveSetting('tool', activeTool);
  }, [hydrated, target, keyword, engine, activeTool]);

  useEffect(() => {
    let alive = true;

    void loadSetting<HistoryEntry[]>('history', []).then((stored) => {
      if (!alive) return;
      const entries = Array.isArray(stored) ? stored.filter(isHistoryEntry) : [];
      historyRef.current = entries;
      setHistory(entries);
    });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeTool]);

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /** Update state and storage together so the record survives the popup closing. */
  const commitHistory = useCallback((next: HistoryEntry[]): Promise<void> => {
    historyRef.current = next;
    setHistory(next);
    return saveSetting('history', next);
  }, []);

  const recordQuery = useCallback(
    (
      query: string,
      searchEngine: SearchEngine = engine,
      toolLabel: string = TOOL_LABELS[activeTool],
    ): Promise<void> => {
      const trimmed = query.trim();
      if (!trimmed) return Promise.resolve();

      const entry: HistoryEntry = {
        id: createId(),
        query: trimmed,
        engine: searchEngine,
        tool: toolLabel,
        createdAt: Date.now(),
      };

      return commitHistory(
        [entry, ...historyRef.current.filter((item) => item.query !== trimmed)].slice(0, 30),
      );
    },
    [activeTool, engine, commitHistory],
  );

  const searchQuery = useCallback(
    async (query: string) => {
      await recordQuery(query);
      openSearch(engine, query);
    },
    [engine, recordQuery],
  );

  const useCurrentTab = useCallback(async () => {
    const domain = await getActiveTabDomain();

    if (!domain) {
      notify('No readable domain in the current tab');
      return;
    }

    if (!isValidDomain(domain)) {
      notify('The current tab does not expose a valid domain');
      return;
    }

    setTarget(domain);
    notify(`Target set to ${domain}`);
  }, [notify]);

  const removeHistory = useCallback(
    (id: string) => {
      void commitHistory(historyRef.current.filter((entry) => entry.id !== id));
    },
    [commitHistory],
  );

  const clearHistory = useCallback(() => {
    void commitHistory([]);
    notify('Query history cleared');
  }, [commitHistory, notify]);

  const openHistoryEntry = useCallback((entry: HistoryEntry) => {
    openSearch(entry.engine, entry.query);
  }, []);

  const counts = useMemo<Partial<Record<ToolId, number>>>(() => {
    const next: Partial<Record<ToolId, number>> = {};
    for (const category of Object.values(DORK_CATEGORIES)) {
      next[category.id] = category.templates.length;
    }
    return next;
  }, []);

  const category = isLibraryId(activeTool) ? DORK_CATEGORIES[activeTool] : null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <ScanSearch size={17} />
        </div>
        <div className="brand-copy">
          <span className="brand-name">
            DORKER<span className="brand-cursor">_</span>
          </span>
          <span className="brand-sub">OSINT DORK CONSOLE</span>
        </div>

        <div className="topbar-right">
          <span className="owner">
            by <b>othmane01</b>
          </span>
          <span className="status">
            <i /> LOCAL
          </span>
          <button
            type="button"
            className="icon-btn topbar-icon"
            onClick={openDorkerTab}
            title="Open Dorker in a full tab"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </header>

      <div className="workspace">
        <Sidebar
          activeTool={activeTool}
          onSelect={setActiveTool}
          engine={engine}
          onEngineChange={setEngine}
          counts={counts}
          historyCount={history.length}
        />

        <div className="content" ref={contentRef}>
          <div className="content-inner">
            {activeTool === 'documents' && (
              <DocumentFinder
                target={target}
                keyword={keyword}
                onTargetChange={setTarget}
                onKeywordChange={setKeyword}
                onUseCurrentTab={() => void useCurrentTab()}
                engine={engine}
                onCopied={(query) => void recordQuery(query)}
                onSearch={searchQuery}
              />
            )}

            {activeTool === 'builder' && (
              <QueryBuilder
                target={target}
                onTargetChange={setTarget}
                onUseCurrentTab={() => void useCurrentTab()}
                engine={engine}
                onCopied={(query) => void recordQuery(query)}
                onSearch={searchQuery}
              />
            )}

            {category && (
              <DorkLibrary
                category={category}
                target={target}
                keyword={keyword}
                onTargetChange={setTarget}
                onKeywordChange={setKeyword}
                onUseCurrentTab={() => void useCurrentTab()}
                engine={engine}
                onCopied={(query) => void recordQuery(query)}
                onSearch={searchQuery}
              />
            )}

            {activeTool === 'history' && (
              <HistoryPage
                entries={history}
                onOpen={openHistoryEntry}
                onRemove={removeHistory}
                onClear={clearHistory}
              />
            )}

            <footer className="footer">
              <span>
                DORKER <b>v{VERSION}</b>
              </span>
              <span>
                by <b>othmane01</b> · USE RESPONSIBLY
              </span>
            </footer>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </main>
  );
}
