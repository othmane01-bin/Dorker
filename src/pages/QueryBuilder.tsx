import { useMemo, useState } from 'react';
import { ChevronDown, Info, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ScopeFields from '../components/ScopeFields';
import QueryOutput from '../components/QueryOutput';
import { DOCUMENT_TYPES } from '../generators/documentFinder';
import type { DocumentType } from '../generators/documentFinder';
import { cleanPhrase, isValidDomain, normalizeDomain } from '../lib/dork';
import type { SearchEngine } from '../lib/search';

interface QueryBuilderProps {
  target: string;
  onTargetChange: (value: string) => void;
  onUseCurrentTab: () => void;
  engine: SearchEngine;
  onCopied: (query: string) => void;
  onSearch: (query: string) => void;
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint: string;
  wide?: boolean;
}

function TextField({ id, label, value, onChange, placeholder, hint, wide }: TextFieldProps) {
  return (
    <div className={`field${wide ? ' field-wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="plain-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
      />
      <span className="field-hint">{hint}</span>
    </div>
  );
}

export default function QueryBuilder({
  target,
  onTargetChange,
  onUseCurrentTab,
  engine,
  onCopied,
  onSearch,
}: QueryBuilderProps) {
  const [phrase, setPhrase] = useState('');
  const [intitle, setIntitle] = useState('');
  const [inurl, setInurl] = useState('');
  const [intext, setIntext] = useState('');
  const [exclude, setExclude] = useState('');
  const [fileType, setFileType] = useState<DocumentType>('any');

  const query = useMemo(() => {
    if (!isValidDomain(target)) return '';

    const parts: string[] = [`site:${normalizeDomain(target)}`];
    if (fileType !== 'any') parts.push(`filetype:${fileType}`);

    const phraseValue = cleanPhrase(phrase);
    if (phraseValue) parts.push(`"${phraseValue}"`);

    const titleValue = cleanPhrase(intitle);
    if (titleValue) parts.push(`intitle:"${titleValue}"`);

    const urlValue = cleanPhrase(inurl);
    if (urlValue) parts.push(`inurl:"${urlValue}"`);

    const textValue = cleanPhrase(intext);
    if (textValue) parts.push(`intext:"${textValue}"`);

    const excluded = exclude
      .split(/[\s,]+/)
      .map((term) => term.trim().replace(/^-+/, '').replace(/"/g, ''))
      .filter(Boolean);
    for (const term of excluded) parts.push(`-${term}`);

    return parts.join(' ');
  }, [target, fileType, phrase, intitle, inurl, intext, exclude]);

  return (
    <>
      <PageHeader
        eyebrow="DORK TOOLS / 02"
        title="Query"
        accent="Builder"
        description="Stack Google operators into a precise, targeted search string."
        count={7}
        countLabel="OPERATORS"
      />

      <ScopeFields
        target={target}
        keyword=""
        onTargetChange={onTargetChange}
        onKeywordChange={() => undefined}
        onUseCurrentTab={onUseCurrentTab}
        showKeyword={false}
      />

      <section className="panel builder-panel">
        <div className="panel-head">
          <div className="panel-icon">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <h2>Operator stack</h2>
            <p>Every field is optional. Blank operators are skipped.</p>
          </div>
          <span className="step-tag">STEP 02</span>
        </div>

        <div className="form-grid">
          <TextField
            id="phrase"
            label="EXACT PHRASE"
            value={phrase}
            onChange={setPhrase}
            placeholder="annual report"
            hint="Wrapped in quotes; matches the exact phrase."
            wide
          />
          <TextField
            id="intitle"
            label="INTITLE"
            value={intitle}
            onChange={setIntitle}
            placeholder="index of"
            hint="Matches words in the page title."
          />
          <TextField
            id="inurl"
            label="INURL"
            value={inurl}
            onChange={setInurl}
            placeholder="admin"
            hint="Matches words in the URL path."
          />
          <TextField
            id="intext"
            label="INTEXT"
            value={intext}
            onChange={setIntext}
            placeholder="password"
            hint="Matches words in the page body."
          />

          <div className="field">
            <label htmlFor="builder-filetype">FILE TYPE</label>
            <div className="select-wrap">
              <select
                id="builder-filetype"
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
            <span className="field-hint">Adds a filetype: operator.</span>
          </div>

          <TextField
            id="exclude"
            label="EXCLUDE TERMS"
            value={exclude}
            onChange={setExclude}
            placeholder="shop, blog"
            hint="Comma or space separated; each term is prefixed with -."
            wide
          />
        </div>
      </section>

      <QueryOutput
        query={query}
        placeholder="Enter a valid target domain to generate a custom dork."
        hint="Combine two or three operators for focused results; long stacks may be ignored."
        engine={engine}
        step="STEP 03"
        onCopied={() => onCopied(query)}
        onSearch={() => onSearch(query)}
      />

      <div className="operator-note">
        <div className="note-icon">
          <Info size={15} />
        </div>
        <div>
          <strong>Operator tips</strong>
          <p>
            <code>intitle:</code> and <code>inurl:</code> match indexed page data, not live pages.
            Use <code>-term</code> to exclude noise. Search engines may cap how many operators
            they honour, so keep the stack focused.
          </p>
        </div>
      </div>
    </>
  );
}
