import type { SearchEngine } from './lib/search';

export type ToolId =
  | 'documents'
  | 'builder'
  | 'logins'
  | 'admin'
  | 'directories'
  | 'sensitive'
  | 'subdomains'
  | 'history';

export interface HistoryEntry {
  id: string;
  query: string;
  engine: SearchEngine;
  tool: string;
  createdAt: number;
}
