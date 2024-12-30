import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotRegisteredPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('LANDING_PAGE.WELCOME')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('LANDING_PAGE.WELCOME_MESSAGE')}
        </p>
        <button
          onClick={() => navigate('/members/registration')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {t('LANDING_PAGE.REGISTER_NOW')}
        </button>
      </div>
    </div>
  );
};

export default NotRegisteredPage;
