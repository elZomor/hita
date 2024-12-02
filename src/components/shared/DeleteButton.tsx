import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors ${className}`}
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
