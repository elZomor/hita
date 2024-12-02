import { useRef, useState } from 'react';
import { GalleryObject } from '../../models/Performer';
import { useTranslation } from 'react-i18next';
import { FaLock } from 'react-icons/fa6';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { ImageModal } from '../../components/shared/imageModal';

type GallerySectionProps = {
  galleryObject: GalleryObject;
};

const GallerySection = ({ galleryObject }: GallerySectionProps) => {
  const { t, i18n } = useTranslation();
  const { data, isLocked } = galleryObject;
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    description: string;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Touch handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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
        // Swiped left
        handleNext();
      } else {
        // Swiped right
        handlePrevious();
      }
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (data === undefined) return;
    if (activeIndex < data.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('GALLERY')}
        </h2>
        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <FaLock className="text-gray-500" size={20} />
          <span className="text-gray-700 text-sm">{t('LOCKED')}</span>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t('GALLERY')} ({data.length}{' '}
        {t('PERFORMER_PAGE.GALLERY_SECTION.IMAGES')})
      </h2>

      <div className="relative">
        {/* Mobile View */}
        <div
          className="md:hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative">
            <img
              src={data[activeIndex].imagePath}
              alt={data[activeIndex].description}
              className="w-full h-64 object-cover rounded-lg"
              onClick={() =>
                setSelectedImage({
                  url: data[activeIndex].imagePath,
                  description: data[activeIndex].description,
                })
              }
            />
            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white"
              onClick={() =>
                setSelectedImage({
                  url: data[activeIndex].imagePath,
                  description: data[activeIndex].description,
                })
              }
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              className={clsx(
                'p-2 rounded-full text-white transition-colors',
                activeIndex === 0
                  ? 'bg-black/30 cursor-not-allowed'
                  : 'bg-black/50 hover:bg-black/70'
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={handleNext}
              disabled={activeIndex === data.length - 1}
              className={clsx(
                'p-2 rounded-full text-white transition-colors',
                activeIndex === data.length - 1
                  ? 'bg-black/30 cursor-not-allowed'
                  : 'bg-black/50 hover:bg-black/70'
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            className={clsx(
              'p-2 rounded-full text-white transition-colors',
              activeIndex === 0
                ? 'bg-black/30 cursor-not-allowed'
                : 'bg-black/50 hover:bg-black/70'
            )}
          >
            {i18n.language === 'en' ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </button>

          <div className="flex items-center gap-4 overflow-hidden">
            {data.map((image, index) => {
              const position = index - activeIndex;
              const isActive = index === activeIndex;

              if (position < -1 || position > 1) return null;

              return (
                <div
                  key={index}
                  className={clsx(
                    'transition-all duration-300 cursor-pointer',
                    {
                      'order-2 scale-100 opacity-100': position === 0,
                      'order-3 scale-75 opacity-50': position === 1,
                      'order-1 scale-75 opacity-50': position === -1,
                    }
                  )}
                  onClick={() => {
                    if (isActive) {
                      setSelectedImage({
                        url: image.imagePath,
                        description: image.description,
                      });
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div className="relative group">
                    <img
                      src={image.imagePath}
                      alt={image.description}
                      className="w-64 h-64 object-cover rounded-lg"
                    />

                    {isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-lg">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === data.length - 1}
            className={clsx(
              'p-2 rounded-full text-white transition-colors',
              activeIndex === data.length - 1
                ? 'bg-black/30 cursor-not-allowed'
                : 'bg-black/50 hover:bg-black/70'
            )}
          >
            {i18n.language === 'en' ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Image Description */}
        {data[activeIndex].description && (
          <div className="text-center mt-4">
            <p className="text-gray-600">{data[activeIndex].description}</p>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url || ''}
        altText={selectedImage?.description || ''}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default GallerySection;
