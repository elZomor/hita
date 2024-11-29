import { ContactDetail, ContactDetailsObject } from '../../models/Performer';
import { useTranslation } from 'react-i18next';
import { FaLock } from 'react-icons/fa6';
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

type ContactDetailsProps = {
  contactDetailsObject: ContactDetailsObject;
};

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

const ContactDetailsSection = ({
  contactDetailsObject,
}: ContactDetailsProps) => {
  const { t } = useTranslation();
  const { data, isLocked } = contactDetailsObject;

  const convertToHTTPS = (info: string) => {
    if (!info) return '';
    return info.substring(0, 4).toUpperCase() === 'HTTP'
      ? info
      : 'https://' + info;
  };

  const handleContactClick = (contact: ContactDetail) => {
    const type = contact.contactType.toUpperCase();
    const info = contact.contactInfo;

    switch (type) {
      case 'EMAIL':
        window.location.href = `mailto:${info}`;
        break;
      case 'PHONE':
        window.location.href = `tel:${info}`;
        break;
      case 'WHATSAPP':
        window.open(`https://wa.me/${info.replace(/\D/g, '')}`, '_blank');
        break;
      default:
        window.open(convertToHTTPS(info), '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t('CONTACT_DETAILS')}
      </h2>

      {isLocked ? (
        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <FaLock className="text-gray-500" size={20} />
          <span className="text-gray-700 text-sm">{t('LOCKED')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data?.map((contact: ContactDetail, index) => {
            const contactType = contact.contactType.toUpperCase();
            const IconConfig =
              CONTACT_ICONS[contactType] || CONTACT_ICONS.WEBSITE;
            const Icon = IconConfig.icon;

            return (
              <button
                key={index}
                onClick={() => handleContactClick(contact)}
                className={clsx(
                  'flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md',
                  IconConfig.color
                )}
                title={contact.contactInfo}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 truncate w-full text-center">
                  {t(contactType)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactDetailsSection;
