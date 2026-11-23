import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../lib/clipboard';

interface CopyButtonProps {
  text: string;
  onCopied?: () => void;
  label?: string;
  copiedLabel?: string;
  className?: string;
  disabled?: boolean;
}

export default function CopyButton({
  text,
  onCopied,
  label = 'COPY',
  copiedLabel = 'COPIED',
  className = 'btn btn-copy mini-btn',
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (!ok) return;

    setCopied(true);
    onCopied?.();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      className={`${className}${copied ? ' is-done' : ''}`}
      onClick={() => void handleCopy()}
      disabled={disabled || !text}
      title="Copy query to clipboard"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
