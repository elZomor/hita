import { useTranslation } from 'react-i18next';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import egyFlag from '../../assets/icons/egypt-flag.svg';
import ukFlag from '../../assets/icons/uk-flag.svg';

type LanguageSelectorProps = {
  closeMenu?: () => void;
};

type LanguageData = {
  language: string;
  icon: string | JSX.Element;
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
  const otherLanguage: Record<string, LanguageData> = {
    ar: {
      language: 'en',
      icon: (
        <>
          {' '}
          <img className="block md:hidden" src={ukFlag} alt="ukFlag" />
          <span className="hidden md:block">English</span>
        </>
      ),
    },
    en: {
      language: 'ar',
      icon: (
        <>
          <img className="block md:hidden" src={egyFlag} alt="egyFlag" />
          <span className="hidden md:block">عربي</span>
        </>
      ),
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
          className={`p-2 rounded-lg text-purple-350 text-lg hover:text-purple-300 text-[17px]`}
        >
          {otherLanguage[i18n.language].icon}
        </button>
      </div>
      <span className="block md:hidden">{t('OTHER_LANGUAGE')}</span>
    </div>
  );
}
