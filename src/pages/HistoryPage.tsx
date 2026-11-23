import { Clock3, ExternalLink, History, Trash2, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import EmptyState from '../components/EmptyState';
import { ENGINE_LABELS } from '../lib/search';
import type { HistoryEntry } from '../types';

interface HistoryPageProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 45) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

export default function HistoryPage({
  entries,
  onOpen,
  onRemove,
  onClear,
}: HistoryPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE / 08"
        title="Recent"
        accent="Queries"
        description="Your last 30 generated and searched dorks, stored locally on this device."
        count={entries.length}
        countLabel="QUERIES"
      />

      <div className="results-head history-head">
        <span className="results-title">
          <Clock3 size={13} />
          QUERY LOG
        </span>
        <button
          type="button"
          className="mini-link"
          onClick={onClear}
          disabled={entries.length === 0}
        >
          <Trash2 size={12} />
          CLEAR ALL
        </button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="No queries yet"
          description="Copy or search a dork and it will appear here. History stays in your browser and can be cleared at any time."
        />
      ) : (
        <div className="dork-list">
          {entries.map((entry) => (
            <article className="dork-card history-card" key={entry.id}>
              <div className="history-meta">
                <span className={`engine-chip ${entry.engine}`}>
                  {ENGINE_LABELS[entry.engine]}
                </span>
                <span className="history-tool">{entry.tool}</span>
                <span className="history-time" title={new Date(entry.createdAt).toLocaleString()}>
                  {timeAgo(entry.createdAt)}
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onRemove(entry.id)}
                  title="Remove from history"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="dork-query">
                <code>{entry.query}</code>
              </div>

              <div className="dork-actions">
                <CopyButton text={entry.query} />
                <button
                  type="button"
                  className="btn btn-ghost mini-btn"
                  onClick={() => onOpen(entry)}
                >
                  <ExternalLink size={13} />
                  OPEN {ENGINE_LABELS[entry.engine]}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="operator-note">
        <div className="note-icon">
          <Clock3 size={15} />
        </div>
        <div>
          <strong>Local-only history</strong>
          <p>
            Recent queries are kept in <code>chrome.storage.local</code> and never sent to a
            server. Clearing them removes the saved list from this browser.
          </p>
        </div>
      </div>
    </>
  );
}
