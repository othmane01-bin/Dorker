import {
  ChevronDown,
  FileSearch,
  FileWarning,
  FolderSearch,
  History,
  KeyRound,
  LockKeyhole,
  Network,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ENGINES } from '../lib/search';
import { TOOLS } from '../data/tools';
import type { SearchEngine } from '../lib/search';
import type { ToolId } from '../types';

const TOOL_ICONS: Record<ToolId, LucideIcon> = {
  documents: FileSearch,
  builder: SlidersHorizontal,
  logins: KeyRound,
  admin: LockKeyhole,
  directories: FolderSearch,
  sensitive: FileWarning,
  subdomains: Network,
  history: History,
};

interface SidebarProps {
  activeTool: ToolId;
  onSelect: (tool: ToolId) => void;
  engine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
  counts: Partial<Record<ToolId, number>>;
  historyCount: number;
}

export default function Sidebar({
  activeTool,
  onSelect,
  engine,
  onEngineChange,
  counts,
  historyCount,
}: SidebarProps) {
  function renderTool(toolId: ToolId) {
    const tool = TOOLS.find((item) => item.id === toolId);
    if (!tool) return null;

    const Icon = TOOL_ICONS[tool.id];
    const count = tool.id === 'history' ? historyCount : counts[tool.id];

    return (
      <button
        key={tool.id}
        type="button"
        className={`nav-item${activeTool === tool.id ? ' active' : ''}`}
        onClick={() => onSelect(tool.id)}
        aria-current={activeTool === tool.id ? 'page' : undefined}
      >
        <Icon size={15} />
        <span>{tool.label}</span>
        {typeof count === 'number' && count > 0 && (
          <span className="nav-badge">{String(count).padStart(2, '0')}</span>
        )}
        {tool.id === 'builder' && <span className="nav-badge new">NEW</span>}
      </button>
    );
  }

  return (
    <aside className="sidebar">
      <p className="side-label">RECON TOOLS</p>
      <nav className="nav-group">
        {TOOLS.filter((tool) => tool.id !== 'history').map((tool) => renderTool(tool.id))}
      </nav>

      <p className="side-label spaced">WORKSPACE</p>
      <nav className="nav-group">{renderTool('history')}</nav>

      <div className="engine-block">
        <label className="engine-label" htmlFor="engine">
          SEARCH ENGINE
        </label>
        <div className="select-wrap engine-select">
          <select
            id="engine"
            value={engine}
            onChange={(event) => onEngineChange(event.target.value as SearchEngine)}
          >
            {ENGINES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} />
        </div>
      </div>

      <div className="sidebar-note">
        <ShieldCheck size={13} />
        <span>Use only on targets you own or are authorized to test.</span>
      </div>
    </aside>
  );
}
