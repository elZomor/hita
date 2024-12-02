import { Eye } from 'lucide-react';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';

interface GalleryCardProps {
  image: {
    imagePath: string;
    description?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  isEditing: boolean;
}

export function GalleryCard({
  image,
  onEdit,
  onDelete,
  onView,
  isEditing,
}: GalleryCardProps) {
  // const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-lg p-4 relative group">
      <div className="relative aspect-square">
        <img
          src={image.imagePath}
          alt={image.description}
          className="w-full h-full object-cover rounded-lg"
        />
        {!isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:pointer-events-auto pointer-events-none">
              <button
                onClick={onView}
                className="p-2 rounded-lg text-white hover:text-purple-200 transition-colors"
                title="View"
              >
                <Eye className="h-5 w-5" />
              </button>
              <EditButton
                onClick={onEdit}
                className="text-white hover:text-purple-200"
              />
              <DeleteButton
                onClick={onDelete}
                className="text-white hover:text-red-200"
              />
            </div>
          </div>
        )}
      </div>
      {image.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {image.description}
        </p>
      )}
    </div>
  );
}
