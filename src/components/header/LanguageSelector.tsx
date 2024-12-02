import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="relative">
      {i18n.language === 'ar' ? (
        <button
          onClick={() => handleLanguageChange('en')}
          className="p-2 rounded-lg hover:bg-purple-300 transition-colors"
        >
          🇬🇧
        </button>
      ) : (
        <button
          onClick={() => handleLanguageChange('ar')}
          className="p-2 rounded-lg hover:bg-purple-300 transition-colors"
        >
          🇪🇬
        </button>
      )}
    </div>
  );
}
