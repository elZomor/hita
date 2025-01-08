import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const InvitationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] md:w-[25%]">
        <div>{t('HEADER.INVITATION_TEXT')}</div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-4">
          <button
            className="flex items-center justify-center mx-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={onConfirm}
          >
            {t('HEADER.COPY_INVITATION')}
          </button>

          <button
            className="flex items-center mx-3 justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={onClose}
          >
            {t('CANCEL')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
