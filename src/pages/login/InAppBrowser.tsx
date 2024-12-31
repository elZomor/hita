import { useTranslation } from 'react-i18next';

type InAppBrowserProps = {
  onClick: () => void;
};

const InAppBrowser = ({ onClick }: InAppBrowserProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {t('GEN.UNSUPPORTED_BROWSER')}
      </h3>
      <p className="text-gray-600 mb-6">{t('GEN.UNSUPPORTED_BROWSER_MSG')}</p>
      <button
        onClick={onClick}
        className="px-6 py-3 bg-purple-500 text-white rounded-md shadow hover:bg-purple-600 transition-all duration-300"
      >
        {t('GEN.OPEN_IN_BROWSER')}
      </button>
    </div>
  );
};

export default InAppBrowser;
