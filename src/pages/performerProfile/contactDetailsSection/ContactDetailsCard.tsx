import { useTranslation } from 'react-i18next';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';
import { ContactDetail } from '../../../models/Performer.ts';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import SocialMediaIcon from '../../../components/shared/SocialMediaIcon.tsx';

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

  const handleClick = () => {
    if (isEditMode) return;
    const url = contact?.contactInfo?.startsWith('http')
      ? contact.contactInfo
      : `https://${contact?.contactInfo}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="w-16 h-16 bg-purple-100 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group relative"
      role="button"
      onClick={handleClick}
      aria-label={t(contactType)}
    >
      <SocialMediaIcon size={28} linkType={contactType} />
      {!isEditing && (
        <div className="absolute top-1 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
