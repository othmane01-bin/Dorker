import { AlertCircle, Crosshair, MousePointerClick } from 'lucide-react';
import type { ReactNode } from 'react';
import { isValidDomain, normalizeDomain } from '../lib/dork';

interface ScopeFieldsProps {
  target: string;
  keyword: string;
  onTargetChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onUseCurrentTab: () => void;
  showKeyword?: boolean;
  keywordPlaceholder?: string;
  children?: ReactNode;
}

export default function ScopeFields({
  target,
  keyword,
  onTargetChange,
  onKeywordChange,
  onUseCurrentTab,
  showKeyword = true,
  keywordPlaceholder = 'e.g. annual report, vpn, api',
  children,
}: ScopeFieldsProps) {
  const hasTarget = target.trim().length > 0;
  const invalid = hasTarget && !isValidDomain(target);

  return (
    <section className="panel scope-panel">
      <div className="scope-head">
        <div className="scope-title">
          <Crosshair size={14} />
          TARGET SCOPE
        </div>
        <span className="step-tag">STEP 01</span>
      </div>

      <div className={`scope-grid${showKeyword ? '' : ' single'}`}>
        <div className="field">
          <label htmlFor="target">
            TARGET DOMAIN <span className="required">*</span>
          </label>
          <div className="target-row">
            <div className={`input-control${invalid ? ' is-invalid' : ''}`}>
              <span className="input-prefix">site:</span>
              <input
                id="target"
                value={target}
                onChange={(event) => onTargetChange(event.target.value)}
                onBlur={() => {
                  if (isValidDomain(target)) onTargetChange(normalizeDomain(target));
                }}
                placeholder="example.com"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              className="btn btn-ghost tab-btn"
              onClick={onUseCurrentTab}
              title="Use the domain from the current tab"
            >
              <MousePointerClick size={13} />
              THIS TAB
            </button>
          </div>
          {invalid ? (
            <span className="field-hint is-error">
              <AlertCircle size={11} />
              Enter a valid domain, such as example.com
            </span>
          ) : (
            <span className="field-hint">Results are restricted to this domain.</span>
          )}
        </div>

        {showKeyword && (
          <div className="field">
            <label htmlFor="keyword">
              KEYWORD <span className="optional">OPTIONAL</span>
            </label>
            <div className="input-control">
              <input
                id="keyword"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder={keywordPlaceholder}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <span className="field-hint">Used as an exact phrase. Unlocks keyword dorks.</span>
          </div>
        )}
      </div>

      {children && <div className="scope-extra">{children}</div>}
    </section>
  );
}
