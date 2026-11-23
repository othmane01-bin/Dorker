import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="toast" role="status">
      <CheckCircle2 size={14} />
      <span>{message}</span>
    </div>
  );
}
