import { useTranslation } from 'react-i18next';
import {
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaVideo,
  FaYoutube,
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';

interface PublicLinksCardProps {
  link: {
    linkType: string;
    linkInfo: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

const LINK_ICONS: Record<string, any> = {
  PORTFOLIO: { icon: FaGlobe, color: 'text-blue-600 hover:text-blue-700' },
  SHOWREEL: { icon: FaVideo, color: 'text-purple-600 hover:text-purple-700' },
  LINKEDIN: { icon: FaLinkedin, color: 'text-blue-700 hover:text-blue-800' },
  INSTAGRAM: { icon: FaInstagram, color: 'text-pink-600 hover:text-pink-700' },
  TWITTER: { icon: FaTwitter, color: 'text-blue-400 hover:text-blue-500' },
  YOUTUBE: { icon: FaYoutube, color: 'text-red-600 hover:text-red-700' },
};

export function PublicLinksCard({
  link,
  onEdit,
  onDelete,
  isEditing,
}: PublicLinksCardProps) {
  const { t } = useTranslation();
  const linkType = link.linkType.toUpperCase();
  const IconConfig = LINK_ICONS[linkType] || LINK_ICONS.PORTFOLIO;
  const Icon = IconConfig.icon;

  const handleClick = () => {
    window.open(
      link.linkInfo.startsWith('http')
        ? link.linkInfo
        : `https://${link.linkInfo}`,
      '_blank'
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 relative group">
      <div className="flex justify-between items-center">
        <button
          onClick={handleClick}
          className={clsx('flex items-center gap-3 flex-1', IconConfig.color)}
        >
          <Icon size={24} className="flex-shrink-0" />
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900">{t(linkType)}</h3>
            <p className="text-sm text-gray-600 truncate">{link.linkInfo}</p>
          </div>
        </button>
        {!isEditing && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:pointer-events-auto pointer-events-none">
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
