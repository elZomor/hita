import { useEffect } from 'react';
import { CheckCircle, X, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export function Snackbar({
  message,
  type,
  isOpen,
  onClose,
  autoHideDuration = 5000,
}: SnackbarProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoHideDuration]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={clsx(
          'flex items-center gap-2 p-4 rounded-lg shadow-lg max-w-md animate-slideIn',
          type === 'success'
            ? 'bg-green-900 text-green-50'
            : 'bg-red-900 text-red-50'
        )}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        )}
        <p className="text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className={clsx(
            'p-1 rounded-full hover:bg-opacity-10',
            type === 'success' ? 'hover:bg-green-900' : 'hover:bg-red-900'
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
