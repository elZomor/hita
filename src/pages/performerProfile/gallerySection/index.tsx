import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GalleryCard } from './GalleryCard';
import { GalleryForm } from './GalleryForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { ImageModal } from '../../../components/shared/imageModal';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import { FaLock } from 'react-icons/fa6';
import {
  Gallery,
  mapGalleryResponseToGallery,
} from '../../../models/Performer.ts';
import {
  delete_request,
  get_request,
  patch_files,
  upload_file,
} from '../../../utils/restUtils.ts';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';

interface GallerySectionProps {
  images: Gallery[];
  isLocked: boolean;
  showLock: boolean;
  refreshPerformerPage: () => void;
}

export default function GallerySection({
  images: initialImages,
  isLocked,
  showLock,
  refreshPerformerPage,
}: GallerySectionProps) {
  const { isEditMode } = useEditMode();
  const { i18n, t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const isEnglish = i18n.language === 'en';
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    description?: string;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<Gallery | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
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
      id: 0,
      imagePath: '',
      description: '',
      isProfilePicture: false,
    };
    setIsAdding(true);
    setImages([newImage, ...images]);
    setEditingIndex(0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentImage(images[index]);
  };

  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    file: formData['file'],
    description: formData['description'],
    is_profile_picture: formData['isProfilePicture'],
  });

  const handleSave = async (updatedImage: Gallery) => {
    try {
      if (currentImage?.id === undefined) {
        await upload_file(`hita/gallery`, mapFormDataToRequest(updatedImage));
      } else {
        await patch_files(
          `hita/gallery/${currentImage?.id}`,
          mapFormDataToRequest(updatedImage)
        );
      }

      const { data: getData } = await get_request(`hita/gallery`);
      setImages(mapGalleryResponseToGallery(getData.data));
      setEditingIndex(null);
      setCurrentImage(null);
      setIsAdding(false);
      if (updatedImage.isProfilePicture) {
        refreshPerformerPage();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (image: Gallery) => {
    setCurrentImage(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await delete_request(`hita/gallery/${currentImage?.id}`);
      setShowDeleteModal(false);

      const { data: getData } = await get_request(`hita/gallery`);
      const newImages = mapGalleryResponseToGallery(getData.data);
      setImages(newImages);
      if (newImages.length === 0) {
        refreshPerformerPage();
      }
    } catch (e) {
      console.error(e);
    }
    setEditingIndex(null);
    setCurrentImage(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isAdding) {
      setImages(images.slice(1));
    }
    setEditingIndex(null);
    setCurrentImage(null);
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
      title={`${t('GALLERY')} (${images.length})`}
      headerActions={
        <div className="flex gap-2">
          {isLocked && !isEditMode && (
            <FaLock className="text-gray-500" size={16} />
          )}
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      {showLock ? (
        <div className="flex items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
          <FaLock className="text-gray-500" size={16} />
          <span className="text-gray-700 text-sm">
            {t('PERFORMER_PAGE.GALLERY_SECTION.LOCKED_SECTION')}
          </span>
        </div>
      ) : editingIndex !== null ? (
        <GalleryForm
          image={images[editingIndex]}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="relative">
            {images.length > 1 && (
              <>
                <button
                  onClick={isEnglish ? handlePrevious : handleNext}
                  disabled={
                    isEnglish
                      ? activeIndex === 0
                      : activeIndex === images.length - 1
                  }
                  className={clsx(
                    'absolute left-0 top-1/2 -translate-y-1/2 z-10',
                    'p-2 rounded-full text-white transition-colors',
                    (activeIndex === 0 && isEnglish) ||
                      (activeIndex === images.length - 1 && !isEnglish)
                      ? 'bg-black/30 cursor-not-allowed'
                      : 'bg-black/50 hover:bg-black/70'
                  )}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={isEnglish ? handleNext : handlePrevious}
                  disabled={
                    isEnglish
                      ? activeIndex === images.length - 1
                      : activeIndex === 0
                  }
                  className={clsx(
                    'absolute right-0 top-1/2 -translate-y-1/2 z-10',
                    'p-2 rounded-full text-white transition-colors',
                    (activeIndex === images.length - 1 && isEnglish) ||
                      (activeIndex === 0 && !isEnglish)
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
                      index === activeIndex
                        ? 'scale-100'
                        : 'scale-90 opacity-50'
                    )}
                  >
                    <GalleryCard
                      image={image}
                      onEdit={() => handleEdit(index)}
                      onDelete={() => handleDelete(image)}
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
                <p className="text-gray-500">
                  {t('PERFORMER_PAGE.GALLERY_SECTION.NO_IMAGES')}
                </p>
                {isEditMode && (
                  <button
                    onClick={handleAdd}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('PERFORMER_PAGE.GALLERY_SECTION.ADD_FIRST_IMAGE')}
                  </button>
                )}
              </div>
            )}
          </div>

          <ImageModal
            isOpen={!!selectedImage}
            imageUrl={selectedImage?.url || ''}
            altText={selectedImage?.description || ''}
            onClose={() => setSelectedImage(null)}
          />
        </>
      )}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.GALLERY_SECTION.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.GALLERY_SECTION.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.GALLERY_SECTION.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.GALLERY_SECTION.DELETE_CANCEL')}
      />
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Section>
  );
}
