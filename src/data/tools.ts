import type { ToolId } from '../types';

export interface ToolMeta {
  id: ToolId;
  label: string;
}

export const TOOLS: ToolMeta[] = [
  { id: 'documents', label: 'Document Finder' },
  { id: 'builder', label: 'Query Builder' },
  { id: 'logins', label: 'Login Finder' },
  { id: 'admin', label: 'Admin Panels' },
  { id: 'directories', label: 'Directories' },
  { id: 'sensitive', label: 'Sensitive Files' },
  { id: 'subdomains', label: 'Subdomains' },
  { id: 'history', label: 'Recent Queries' },
];

export const TOOL_LABELS: Record<ToolId, string> = {
  documents: 'Document Finder',
  builder: 'Query Builder',
  logins: 'Login Finder',
  admin: 'Admin Panels',
  directories: 'Directories',
  sensitive: 'Sensitive Files',
  subdomains: 'Subdomains',
  history: 'Recent Queries',
};

export function isToolId(value: unknown): value is ToolId {
  return typeof value === 'string' && TOOLS.some((tool) => tool.id === value);
}
