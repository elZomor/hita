import { useTranslation } from 'react-i18next';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';
import SocialMediaIcon from '../../../components/shared/SocialMediaIcon.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';

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

  const handleClick = () => {
    if (isEditMode) return;
    const url = link?.linkInfo?.startsWith('http')
      ? link.linkInfo
      : `https://${link?.linkInfo}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="w-16 h-16 bg-purple-100 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group relative"
      role="button"
      onClick={handleClick}
      aria-label={t(linkType)}
    >
      <SocialMediaIcon size={28} linkType={linkType} />
      {!isEditing && (
        <div className="absolute top-1 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
