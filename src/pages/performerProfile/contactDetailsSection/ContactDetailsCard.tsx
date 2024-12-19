import { useTranslation } from 'react-i18next';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';
import { ContactDetail } from '../../../models/Performer.ts';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import SocialMediaIcon from '../../../components/shared/SocialMediaIcon.tsx';
import { useEffect, useRef, useState } from 'react';

interface ContactDetailsCardProps {
  contact: ContactDetail;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export function ContactDetailsCard({
  contact,
  onEdit,
  onDelete,
  isEditing,
}: ContactDetailsCardProps) {
  const { t } = useTranslation();
  const contactType = contact.contactType.toUpperCase();
  const { isEditMode } = useEditMode();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleClick = () => {
    if (isEditMode) return;
    setShowInfo((prev) => !prev);
  };

  const handleUrlClick = (event: React.MouseEvent) => {
    event.preventDefault();

    let url = '';

    switch (contactType) {
      case 'WHATSAPP':
        url = `https://wa.me/${contact.contactInfo.replace(/\D/g, '')}`;
        break;
      case 'TELEGRAM':
        url = `https://t.me/${contact.contactInfo}`;
        break;
      case 'FACEBOOK':
      case 'TWITTER':
      case 'INSTAGRAM':
      case 'TIK_TOK':
      case 'YOUTUBE':
      case 'VIMEO':
      case 'BEHANCE':
      case 'GOOGLE_DRIVE':
      case 'SOUND_CLOUD':
        url = contact.contactInfo.startsWith('http')
          ? contact.contactInfo
          : `https://${contact.contactInfo}`;
        break;
      case 'MOBILE':
        if (isMobileDevice) {
          url = `tel:${contact.contactInfo}`;
        }
        break;
      default:
        return;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setShowInfo(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div
      className="w-16 h-16 bg-purple-100 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group relative"
      role="button"
      onClick={handleClick}
      aria-label={t(contactType)}
      ref={cardRef}
    >
      <SocialMediaIcon size={28} linkType={contactType} />
      {!isEditing && (
        <div className="absolute top-1 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      )}
      {showInfo && contact.contactInfo && (
        <div className="absolute bottom-[-3.5rem] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg text-xs flex items-center gap-2 z-10">
          <a
            href="#"
            onClick={handleUrlClick}
            className="text-blue-500 hover:underline"
          >
            {contact.contactInfo}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(contact.contactInfo)}
            className="text-gray-500 hover:text-gray-700"
            title="Copy"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}
