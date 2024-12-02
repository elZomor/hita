import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GalleryCard } from './GalleryCard';
import { GalleryForm } from './GalleryForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { ImageModal } from '../../../components/shared/imageModal';

interface GallerySectionProps {
  images: {
    imagePath: string;
    description?: string;
    isProfilePicture?: boolean;
  }[];
  onUpdate?: (
    images: {
      imagePath: string;
      description?: string;
      isProfilePicture?: boolean;
    }[]
  ) => void;
}

export default function GallerySection({
  images: initialImages,
  onUpdate,
}: GallerySectionProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    description?: string;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Touch handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollToImage(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
      scrollToImage(activeIndex + 1);
    }
  };

  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const imageElements = container.getElementsByClassName('gallery-image');
    if (imageElements[index]) {
      const imageElement = imageElements[index] as HTMLElement;
      container.scrollTo({
        left:
          imageElement.offsetLeft -
          container.offsetWidth / 2 +
          imageElement.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const handleAdd = () => {
    const newImage = {
      imagePath: '',
      description: '',
      isProfilePicture: false,
    };
    setIsAdding(true);
    setImages([...images, newImage]);
    setEditingIndex(images.length);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (
    index: number,
    updatedImage: {
      file?: File;
      description?: string;
      isProfilePicture: boolean;
    }
  ) => {
    const updatedImages = [...images];

    // If setting as profile picture, unset others
    if (updatedImage.isProfilePicture) {
      updatedImages.forEach((img) => (img.isProfilePicture = false));
    }

    updatedImages[index] = {
      imagePath: updatedImage.file
        ? URL.createObjectURL(updatedImage.file)
        : images[index].imagePath,
      description: updatedImage.description,
      isProfilePicture: updatedImage.isProfilePicture,
    };
    setImages(updatedImages);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedImages);
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedImages);
  };

  const handleCancel = () => {
    if (isAdding) {
      setImages(images.slice(0, -1));
    }
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleView = (image: { imagePath: string; description?: string }) => {
    setSelectedImage({
      url: image.imagePath,
      description: image.description,
    });
  };

  return (
    <Section
      title={t('GALLERY')}
      headerActions={
        <div className="flex gap-2">
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      {editingIndex !== null ? (
        <GalleryForm
          image={images[editingIndex]}
          onSave={(updatedImage) => handleSave(editingIndex, updatedImage)}
          onCancel={handleCancel}
        />
      ) : (
        <div className="relative">
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={activeIndex === 0}
                className={clsx(
                  'absolute left-0 top-1/2 -translate-y-1/2 z-10',
                  'p-2 rounded-full text-white transition-colors',
                  activeIndex === 0
                    ? 'bg-black/30 cursor-not-allowed'
                    : 'bg-black/50 hover:bg-black/70'
                )}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === images.length - 1}
                className={clsx(
                  'absolute right-0 top-1/2 -translate-y-1/2 z-10',
                  'p-2 rounded-full text-white transition-colors',
                  activeIndex === images.length - 1
                    ? 'bg-black/30 cursor-not-allowed'
                    : 'bg-black/50 hover:bg-black/70'
                )}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Gallery */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-6 p-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={clsx(
                    'gallery-image flex-shrink-0 w-64 transition-all duration-300',
                    index === activeIndex ? 'scale-100' : 'scale-90 opacity-50'
                  )}
                >
                  <GalleryCard
                    image={image}
                    onEdit={() => handleEdit(index)}
                    onDelete={() => handleDelete(index)}
                    onView={() => handleView(image)}
                    isEditing={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">{t('NO_IMAGES')}</p>
              <button
                onClick={handleAdd}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('ADD_FIRST_IMAGE')}
              </button>
            </div>
          )}
        </div>
      )}

      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url || ''}
        altText={selectedImage?.description || ''}
        onClose={() => setSelectedImage(null)}
      />
    </Section>
  );
}
