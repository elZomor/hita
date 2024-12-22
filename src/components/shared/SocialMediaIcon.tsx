import {
  FaFacebook,
  FaGlobe,
  FaGoogleDrive,
  FaInstagram,
  FaLinkedin,
  FaMobileAlt,
  FaPinterest,
  FaSnapchatGhost,
  FaSoundcloud,
  FaTelegram,
  FaTiktok,
  FaVideo,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBehance, SiDribbble, SiGithub, SiMedium } from 'react-icons/si';
import { clsx } from 'clsx';

type SocialMediaIconProps = {
  linkType: string;
  size: number;
  className?: string;
};

const LINK_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  PORTFOLIO: { icon: FaGlobe, color: 'text-blue-600 hover:text-blue-700' },
  SHOWREEL: { icon: FaVideo, color: 'text-purple-600 hover:text-purple-700' },
  LINKEDIN: { icon: FaLinkedin, color: 'text-blue-700 hover:text-blue-800' },
  INSTAGRAM: { icon: FaInstagram, color: 'text-pink-500 hover:text-pink-600' },
  TWITTER: { icon: FaXTwitter, color: 'text-black hover:text-gray-700' },
  YOUTUBE: { icon: FaYoutube, color: 'text-red-600 hover:text-red-700' },
  FACEBOOK: { icon: FaFacebook, color: 'text-blue-600 hover:text-blue-700' },
  TIK_TOK: { icon: FaTiktok, color: 'text-black hover:text-gray-700' },
  PINTEREST: { icon: FaPinterest, color: 'text-red-500 hover:text-red-600' },
  SNAPCHAT: {
    icon: FaSnapchatGhost,
    color: 'text-yellow-400 hover:text-yellow-500',
  },
  BEHANCE: { icon: SiBehance, color: 'text-blue-500 hover:text-blue-600' },
  DRIBBBLE: { icon: SiDribbble, color: 'text-pink-400 hover:text-pink-500' },
  MEDIUM: { icon: SiMedium, color: 'text-gray-700 hover:text-gray-900' },
  GITHUB: { icon: SiGithub, color: 'text-gray-900 hover:text-gray-700' },
  GOOGLE_DRIVE: {
    icon: FaGoogleDrive,
    color: 'text-green-500 hover:text-green-600',
  },
  WHATSAPP: { icon: FaWhatsapp, color: 'text-green-600 hover:text-green-700' },
  TELEGRAM: { icon: FaTelegram, color: 'text-blue-400 hover:text-blue-500' },
  SOUND_CLOUD: {
    icon: FaSoundcloud,
    color: 'text-orange-500 hover:text-orange-600',
  },
  MOBILE: { icon: FaMobileAlt, color: 'text-gray-600 hover:text-gray-700' },
};

const SocialMediaIcon = ({
  linkType,
  size,
  className,
}: SocialMediaIconProps) => {
  const IconConfig = LINK_ICONS[linkType] || LINK_ICONS.PORTFOLIO;
  const Icon = IconConfig.icon;

  return (
    <Icon
      size={size}
      className={`${clsx(IconConfig.color, 'transition-colors')} ${className}`}
    />
  );
};

export default SocialMediaIcon;
