import { useMemo } from 'react';
import { Crosshair, Info, Sparkles, Terminal } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ScopeFields from '../components/ScopeFields';
import QueryCard from '../components/QueryCard';
import EmptyState from '../components/EmptyState';
import { isValidDomain, normalizeDomain, renderDork } from '../lib/dork';
import { ENGINE_LABELS } from '../lib/search';
import type { SearchEngine } from '../lib/search';
import type { DorkCategory } from '../data/dorks';

interface DorkLibraryProps {
  category: DorkCategory;
  target: string;
  keyword: string;
  onTargetChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onUseCurrentTab: () => void;
  engine: SearchEngine;
  onCopied: (query: string) => void;
  onSearch: (query: string) => void;
}

export default function DorkLibrary({
  category,
  target,
  keyword,
  onTargetChange,
  onKeywordChange,
  onUseCurrentTab,
  engine,
  onCopied,
  onSearch,
}: DorkLibraryProps) {
  const validTarget = isValidDomain(target);
  const domain = normalizeDomain(target);
  const keywordReady = keyword.trim().length > 0;

  const dorks = useMemo(
    () =>
      category.templates
        .filter((template) => !template.needsKeyword || keywordReady)
        .map((template) => ({
          template,
          query: renderDork(template.query, domain, keyword),
        })),
    [category, domain, keyword, keywordReady],
  );

  const lockedCount = category.templates.filter(
    (template) => template.needsKeyword && !keywordReady,
  ).length;

  return (
    <>
      <PageHeader
        eyebrow={`DORK TOOLS / ${category.index}`}
        title={category.title}
        accent={category.accent}
        description={category.description}
        count={category.templates.length}
        countLabel="DORKS"
      />

      <ScopeFields
        target={target}
        keyword={keyword}
        onTargetChange={onTargetChange}
        onKeywordChange={onKeywordChange}
        onUseCurrentTab={onUseCurrentTab}
      />

      {validTarget ? (
        <>
          <div className="results-head">
            <span className="results-title">
              <Terminal size={13} />
              GENERATED DORKS
            </span>
            <span className="results-count">{String(dorks.length).padStart(2, '0')}</span>
            <span className="results-note">
              {ENGINE_LABELS[engine]} · {domain}
            </span>
            <span className="step-tag">STEP 02</span>
          </div>

          {lockedCount > 0 && (
            <div className="inline-note">
              <Info size={13} />
              <span>
                Add a keyword to unlock {lockedCount} more {lockedCount === 1 ? 'dork' : 'dorks'} in
                this category.
              </span>
            </div>
          )}

          <div className="dork-list">
            {dorks.map((dork, index) => (
              <QueryCard
                key={dork.template.id}
                index={index}
                template={dork.template}
                query={dork.query}
                engine={engine}
                onCopied={() => onCopied(dork.query)}
                onSearch={() => onSearch(dork.query)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Crosshair}
          title={target.trim() ? 'That target looks off' : 'Set a target to begin'}
          description={
            target.trim()
              ? 'Enter a root domain such as example.com. Protocols, paths, ports, and wildcards are cleaned up or rejected.'
              : `Dorker will generate ${category.templates.length} ready-to-use queries for this category once a valid domain is set.`
          }
          action={
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onTargetChange('example.com')}
            >
              <Sparkles size={13} />
              TRY EXAMPLE.COM
            </button>
          }
        />
      )}

      <div className="operator-note">
        <div className="note-icon">
          <Info size={15} />
        </div>
        <div>
          <strong>How to read results</strong>
          <p>
            Every dork starts with <code>site:</code> and adds targeted operators. Search engines
            only return pages they have already indexed, so absence of results is not proof that
            nothing exists.
          </p>
        </div>
      </div>
    </>
  );
}
