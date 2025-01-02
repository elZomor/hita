import { useTranslation } from 'react-i18next';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';

type LanguageSelectorProps = {
  closeMenu?: () => void;
};

export function LanguageSelector({ closeMenu }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const { trackEvent } = useAmplitude();

  const handleLanguageChange = (lang: string) => {
    trackEvent('lang_' + lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    if (closeMenu !== undefined) {
      closeMenu();
    }
  };
  const otherLanguage: Record<string, Record<string, string>> = {
    ar: {
      language: 'en',
      icon: '🇬🇧',
    },
    en: {
      language: 'ar',
      icon: '🇪🇬',
    },
  };

  return (
    <div
      className="flex flex-row items-center transition-colors hover:cursor-pointer"
      onClick={() =>
        handleLanguageChange(otherLanguage[i18n.language].language)
      }
    >
      <div className="relative">
        <button
          className={`p-2 rounded-lg text-purple-350 text-lg hover:text-purple-300 text-[17px] font-semibold`}
        >
          {otherLanguage[i18n.language].icon}
        </button>
      </div>
      <span className="block md:hidden">{t('OTHER_LANGUAGE')}</span>
    </div>
  );
}
