import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  className?: string;
}

export function AddButton({ onClick, className = '' }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors ${className}`}
      title="Add"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}
