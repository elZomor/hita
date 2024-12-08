import { Award, Globe, Image, Phone, Trophy, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface PageNavProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const PageNav = ({ activeSection, onSectionClick }: PageNavProps) => {
  const { t } = useTranslation();
  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_PAGE.NAVIGATION.' + text);
  };
  const sections = [
    { id: 'profile', label: addTranslationPrefix('PROFILE'), icon: User },
    { id: 'gallery', label: addTranslationPrefix('GALLERY'), icon: Image },
    { id: 'contact', label: addTranslationPrefix('CONTACT'), icon: Phone },
    { id: 'publicLinks', label: addTranslationPrefix('CHANNELS'), icon: Globe },
    {
      id: 'experience',
      label: addTranslationPrefix('EXPERIENCES'),
      icon: Award,
    },
    {
      id: 'achievements',
      label: addTranslationPrefix('ACHIEVEMENTS'),
      icon: Trophy,
    },
  ];

  return (
    <nav className="bg-white rounded-xl shadow-sm p-4">
      <ul className="space-y-1">
        {sections.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => onSectionClick(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeSection === id
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageNav;
