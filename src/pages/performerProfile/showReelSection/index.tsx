import { VideoModal } from '../../../components/shared/VideoModal.tsx';
import { useState } from 'react';
import Section from '../../../components/shared/section/Section.tsx';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../../constants.ts';
import { Play, Trash2 } from 'lucide-react';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { delete_request } from '../../../utils/restUtils.ts';
import { VideoUpload } from '../../../components/shared/VideoUpload.tsx';

type ShowReelSectionProps = {
  username: string;
  hasShowReel: boolean;
};

export const ShowReelSection = ({
  username,
  hasShowReel,
}: ShowReelSectionProps) => {
  const [showReel, setShowReel] = useState(hasShowReel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { isEditMode } = useEditMode();
  const onThumbnailClick = () => setIsModalOpen(true);
  const confirmDelete = async () => {
    try {
      await delete_request(`hita/show-reel/delete`);
      setShowDeleteModal(false);
      setShowReel(false);
    } catch {
      // Intentionally left empty
    }
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleSavedSuccessfully = () => {
    setShowReel(true);
  };

  const IconOnVideo = () => {
    return isEditMode ? (
      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 md:opacity-0 transition-opacity">
        <div className="bg-gray-800 bg-opacity-60 rounded-full p-3">
          <Trash2
            className="text-gray-300 w-6 h-6 hover:text-red-500 hover:cursor-pointer"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>
    ) : (
      <div
        className="absolute inset-0 flex items-center justify-center hover:cursor-pointer"
        onClick={onThumbnailClick}
      >
        <div className="bg-black bg-opacity-50 rounded-full p-3">
          <Play className="text-white w-12 h-12" />
        </div>
      </div>
    );
  };

  const NoShowReelComponent = () => {
    return isEditMode ? (
      <VideoUpload handleSavedSuccessfully={handleSavedSuccessfully} />
    ) : (
      <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg w-full h-full">
        <p className="text-gray-500">
          {t('PERFORMER_PAGE.SHOW_REEL.NO_SHOW_REEL')}
        </p>
      </div>
    );
  };

  return (
    <Section title={t('SHOWREEL')}>
      <div className={`h-40 md:h-60 flex justify-center items-center`}>
        {showReel ? (
          <div className="relative w-1/2 h-full group">
            <div className="bg-black w-full h-full rounded-lg hover:cursor-pointer"></div>
            {IconOnVideo()}
          </div>
        ) : (
          NoShowReelComponent()
        )}
      </div>
      <VideoModal
        isOpen={isModalOpen}
        videoUrl={`${baseUrl}/hita/show-reel/${username}/stream`}
        title={`${username} Show Reel`}
        onClose={() => setIsModalOpen(false)}
      />
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.SHOW_REEL.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.SHOW_REEL.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.SHOW_REEL.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.SHOW_REEL.DELETE_CANCEL')}
      />
    </Section>
  );
};
