import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GalleryForm } from './GalleryForm';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import { FaLock } from 'react-icons/fa6';
import 'swiper/swiper-bundle.css';
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
import { GallerySwiper } from './GallerySwiper.tsx';
import SwiperImageModal from './SwiperImageModal.tsx';

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
  const { t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<Gallery | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      setIsUploading(true);
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
    } catch {
      // No Implementation
    } finally {
      setIsUploading(false);
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
    } catch {
      // No Implementation
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

  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsImageModalOpen(true);
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageModalOpen]);

  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth <= 768) {
        setSlidesPerView(2); // 1 slide for mobile
      } else {
        setSlidesPerView(4); // Default slides for desktop
      }
    };

    updateSlidesPerView(); // Initial check
    window.addEventListener('resize', updateSlidesPerView); // Listen for resize events

    return () => {
      window.removeEventListener('resize', updateSlidesPerView); // Cleanup on unmount
    };
  }, []);

  // Number of slides per row
  const totalSlides = images.length; // Total number of slides
  const rows = Math.ceil(totalSlides / slidesPerView);

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
          isUploading={isUploading}
        />
      ) : (
        <>
          <div className="relative">
            <GallerySwiper
              slidesPerView={slidesPerView}
              rows={rows}
              images={images}
              onClick={openModal}
              isEditing={isEditMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

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

          {isImageModalOpen && (
            <SwiperImageModal
              closeModal={closeModal}
              activeIndex={activeIndex}
              images={images}
            />
          )}
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
