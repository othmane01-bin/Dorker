import { ExternalLink } from 'lucide-react';
import CopyButton from './CopyButton';
import { ENGINE_LABELS } from '../lib/search';
import type { SearchEngine } from '../lib/search';
import type { DorkTemplate } from '../data/dorks';

interface QueryCardProps {
  index: number;
  template: DorkTemplate;
  query: string;
  engine: SearchEngine;
  onCopied: () => void;
  onSearch: () => void;
}

export default function QueryCard({
  index,
  template,
  query,
  engine,
  onCopied,
  onSearch,
}: QueryCardProps) {
  return (
    <article className="dork-card">
      <div className="dork-head">
        <span className="dork-index">{String(index + 1).padStart(2, '0')}</span>
        <div className="dork-copy">
          <h3 className="dork-title">{template.title}</h3>
          <p className="dork-desc">{template.description}</p>
        </div>
      </div>

      <div className="dork-query">
        <code>{query}</code>
      </div>

      <div className="dork-actions">
        <CopyButton text={query} onCopied={onCopied} />
        <button
          type="button"
          className="btn btn-ghost mini-btn"
          onClick={onSearch}
          title={`Open this dork on ${ENGINE_LABELS[engine]}`}
        >
          <ExternalLink size={13} />
          {ENGINE_LABELS[engine]}
        </button>
      </div>
    </article>
  );
}
