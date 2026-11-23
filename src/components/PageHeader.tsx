interface PageHeaderProps {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  count?: number;
  countLabel?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  count,
  countLabel = 'DORKS',
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </div>
        <h1 className="page-title">
          {title} <span>{accent}</span>
        </h1>
        <p className="page-blurb">{description}</p>
      </div>

      {typeof count === 'number' && (
        <div className="page-meta">
          <span className="meta-count">{String(count).padStart(2, '0')}</span>
          <span className="meta-label">{countLabel}</span>
        </div>
      )}
    </header>
  );
}
