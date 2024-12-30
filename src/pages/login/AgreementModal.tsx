import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  textTitle: 'TAC' | 'PP' | ''; // Text to display in the read-only text area
  textContent: string; // Text to display in the read-only text area
  onClose: () => void; // Function to handle close button click
  onConfirm: (docType: 'TAC' | 'PP' | '') => void; // Function to handle confirm button click
}

const AgreementModal: React.FC<ModalProps> = ({
  isOpen,
  textTitle,
  textContent,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[80%] h-[80%]">
        <textarea
          className="w-full h-[80%] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
          value={textContent}
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          <button
            className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={onClose}
          >
            {t('CANCEL')}
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={() => onConfirm(textTitle)}
          >
            {t('LOGIN_PAGE.APPROVE')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
