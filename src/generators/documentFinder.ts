import { cleanPhrase, isValidDomain, normalizeDomain } from '../lib/dork';

export const DOCUMENT_TYPES = [
  { label: 'Any file type', value: 'any' },
  { label: 'PDF document (.pdf)', value: 'pdf' },
  { label: 'Word document (.doc)', value: 'doc' },
  { label: 'Word document (.docx)', value: 'docx' },
  { label: 'Excel spreadsheet (.xls)', value: 'xls' },
  { label: 'Excel spreadsheet (.xlsx)', value: 'xlsx' },
  { label: 'PowerPoint (.ppt)', value: 'ppt' },
  { label: 'PowerPoint (.pptx)', value: 'pptx' },
  { label: 'Plain text (.txt)', value: 'txt' },
  { label: 'CSV data (.csv)', value: 'csv' },
  { label: 'SQL dump (.sql)', value: 'sql' },
  { label: 'Log file (.log)', value: 'log' },
  { label: 'Environment file (.env)', value: 'env' },
  { label: 'Backup file (.bak)', value: 'bak' },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]['value'];

export interface DocumentFinderInput {
  domain: string;
  fileType: DocumentType;
  keyword: string;
}

export function buildDocumentQuery(input: DocumentFinderInput): string {
  if (!isValidDomain(input.domain)) return '';

  const domain = normalizeDomain(input.domain);
  const parts: string[] = [`site:${domain}`];

  if (input.fileType !== 'any') parts.push(`filetype:${input.fileType}`);

  const keyword = cleanPhrase(input.keyword);
  if (keyword) parts.push(`"${keyword}"`);

  return parts.join(' ');
}
