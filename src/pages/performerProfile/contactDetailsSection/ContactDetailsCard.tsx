import { useTranslation } from 'react-i18next';
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';

interface ContactDetailsCardProps {
  contact: {
    contactType: string;
    contactInfo: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

const CONTACT_ICONS: Record<string, any> = {
  FACEBOOK: { icon: FaFacebook, color: 'text-blue-600 hover:text-blue-700' },
  TWITTER: { icon: FaTwitter, color: 'text-blue-400 hover:text-blue-500' },
  INSTAGRAM: { icon: FaInstagram, color: 'text-pink-600 hover:text-pink-700' },
  LINKEDIN: { icon: FaLinkedin, color: 'text-blue-700 hover:text-blue-800' },
  YOUTUBE: { icon: FaYoutube, color: 'text-red-600 hover:text-red-700' },
  WEBSITE: { icon: FaGlobe, color: 'text-gray-600 hover:text-gray-700' },
  EMAIL: { icon: FaEnvelope, color: 'text-gray-600 hover:text-gray-700' },
  PHONE: { icon: FaPhone, color: 'text-green-600 hover:text-green-700' },
  WHATSAPP: { icon: FaWhatsapp, color: 'text-green-500 hover:text-green-600' },
  TELEGRAM: { icon: FaTelegram, color: 'text-blue-500 hover:text-blue-600' },
};

export function ContactDetailsCard({
  contact,
  onEdit,
  onDelete,
  isEditing,
}: ContactDetailsCardProps) {
  const { t } = useTranslation();
  const contactType = contact.contactType.toUpperCase();
  const IconConfig = CONTACT_ICONS[contactType] || CONTACT_ICONS.WEBSITE;
  const Icon = IconConfig.icon;

  return (
    <div className="bg-gray-50 rounded-lg p-6 relative group">
      <div className="flex justify-between items-center">
        {/* Contact Icon and Info */}
        <div className={clsx('flex items-center gap-3', IconConfig.color)}>
          <Icon size={24} className="flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {t(contactType)}
            </h3>
            <p className="text-sm text-gray-600">{contact.contactInfo}</p>
          </div>
        </div>

        {/* Edit and Delete Buttons */}
        {!isEditing && (
          <div className="flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
