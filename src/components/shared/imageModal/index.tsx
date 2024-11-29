import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export function ImageModal({
  isOpen,
  imageUrl,
  altText,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full mx-auto">
        <div className="relative bg-black rounded-lg shadow-xl">
          <button
            onClick={onClose}
            className="absolute -right-4 -top-4 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-2">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-auto rounded-md max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
