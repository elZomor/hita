import { useTranslation } from 'react-i18next';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';
import SocialMediaIcon from '../../../components/shared/SocialMediaIcon.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import { useEffect, useRef, useState } from 'react';

interface PublicLinksCardProps {
  link: {
    linkType: string;
    linkInfo: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export function PublicLinksCard({
  link,
  onEdit,
  onDelete,
  isEditing,
}: PublicLinksCardProps) {
  const { t } = useTranslation();
  const linkType = link?.linkType?.toUpperCase() || 'PORTFOLIO';
  const { isEditMode } = useEditMode();
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setShowInfo(false);
    }
  };

  const handleClick = () => {
    if (isEditMode) return;
    setShowInfo((prev) => !prev);
  };

  const handleUrlClick = (event: React.MouseEvent) => {
    event.preventDefault();

    let url = '';

    switch (link.linkType.toUpperCase()) {
      case 'WHATSAPP':
        url = `https://wa.me/${link.linkInfo.replace(/\D/g, '')}`;
        break;
      case 'TELEGRAM':
        url = `https://t.me/${link.linkInfo}`;
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
        url = link.linkInfo.startsWith('http')
          ? link.linkInfo
          : `https://${link.linkInfo}`;
        break;
      default:
        return;
    }
    if (url) {
      window.open(url, '_blank');
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
      aria-label={t(linkType)}
      ref={cardRef}
    >
      <SocialMediaIcon size={28} linkType={linkType} />
      {!isEditing && (
        <div className="absolute top-1 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      )}
      {showInfo && link.linkInfo && (
        <div className="absolute bottom-[-3.5rem] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg text-xs flex items-center gap-2 z-10">
          <a
            href="#"
            onClick={handleUrlClick}
            className="text-blue-500 hover:underline"
          >
            {link.linkInfo}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(link.linkInfo)}
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
