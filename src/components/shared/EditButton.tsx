import { Pen } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export function EditButton({ onClick, className = '' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors ${className}`}
      title="Edit"
    >
      <Pen className="h-4 w-4" />
    </button>
  );
}
