import { useMemo, useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ScopeFields from '../components/ScopeFields';
import QueryOutput from '../components/QueryOutput';
import { DOCUMENT_TYPES, buildDocumentQuery } from '../generators/documentFinder';
import type { DocumentType } from '../generators/documentFinder';
import type { SearchEngine } from '../lib/search';

interface DocumentFinderProps {
  target: string;
  keyword: string;
  onTargetChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onUseCurrentTab: () => void;
  engine: SearchEngine;
  onCopied: (query: string) => void;
  onSearch: (query: string) => void;
}

export default function DocumentFinder({
  target,
  keyword,
  onTargetChange,
  onKeywordChange,
  onUseCurrentTab,
  engine,
  onCopied,
  onSearch,
}: DocumentFinderProps) {
  const [fileType, setFileType] = useState<DocumentType>('pdf');

  const query = useMemo(
    () => buildDocumentQuery({ domain: target, fileType, keyword }),
    [target, fileType, keyword],
  );

  return (
    <>
      <PageHeader
        eyebrow="DORK TOOLS / 01"
        title="Document"
        accent="Finder"
        description="Surface publicly indexed documents by domain, format, and exact phrase."
        count={DOCUMENT_TYPES.length - 1}
        countLabel="FORMATS"
      />

      <ScopeFields
        target={target}
        keyword={keyword}
        onTargetChange={onTargetChange}
        onKeywordChange={onKeywordChange}
        onUseCurrentTab={onUseCurrentTab}
        keywordPlaceholder="e.g. annual report, policy, handbook"
      >
        <div className="field">
          <label htmlFor="filetype">DOCUMENT TYPE</label>
          <div className="select-wrap">
            <select
              id="filetype"
              value={fileType}
              onChange={(event) => setFileType(event.target.value as DocumentType)}
            >
              {DOCUMENT_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
          <span className="field-hint">Adds a filetype: operator to the query.</span>
        </div>
      </ScopeFields>

      <QueryOutput
        query={query}
        placeholder="Enter a valid target domain to generate a document dork."
        hint="Restrict the search by domain, document format, and an optional exact phrase."
        engine={engine}
        step="STEP 02"
        onCopied={() => onCopied(query)}
        onSearch={() => onSearch(query)}
      />

      <div className="operator-note">
        <div className="note-icon">
          <Info size={15} />
        </div>
        <div>
          <strong>What this query does</strong>
          <p>
            <code>site:</code> limits results to the target. <code>filetype:</code> filters by
            document format. A quoted keyword searches for an exact phrase. Search engines only
            see pages they have already indexed.
          </p>
        </div>
      </div>
    </>
  );
}
