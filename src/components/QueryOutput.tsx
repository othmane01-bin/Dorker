import { ExternalLink, Terminal } from 'lucide-react';
import CopyButton from './CopyButton';
import { ENGINE_LABELS } from '../lib/search';
import type { SearchEngine } from '../lib/search';

interface QueryOutputProps {
  query: string;
  placeholder: string;
  hint: string;
  engine: SearchEngine;
  step: string;
  onCopied: () => void;
  onSearch: () => void;
}

export default function QueryOutput({
  query,
  placeholder,
  hint,
  engine,
  step,
  onCopied,
  onSearch,
}: QueryOutputProps) {
  return (
    <section className="panel output-panel">
      <div className="output-head">
        <div>
          <div className="output-title">
            <span className="live-dot" />
            GENERATED QUERY
          </div>
          <p className="output-hint">{hint}</p>
        </div>
        <span className="step-tag">{step}</span>
      </div>

      <div className="query-box">
        <span className="query-prompt">$</span>
        {query ? (
          <code>{query}</code>
        ) : (
          <span className="query-placeholder">{placeholder}</span>
        )}
      </div>

      <div className="output-actions">
        <CopyButton
          text={query}
          onCopied={onCopied}
          label="COPY QUERY"
          className="btn btn-copy"
          disabled={!query}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onSearch}
          disabled={!query}
          title={`Open this query on ${ENGINE_LABELS[engine]}`}
        >
          <ExternalLink size={14} />
          SEARCH {ENGINE_LABELS[engine]}
        </button>
        <span className="output-engine">
          <Terminal size={11} />
          LOCAL BUILD
        </span>
      </div>
    </section>
  );
}
