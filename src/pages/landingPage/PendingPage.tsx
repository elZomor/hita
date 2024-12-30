import { ClipboardCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PendingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="bg-yellow-100 rounded-full p-3 w-fit mx-auto">
          <ClipboardCheck className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {t('LANDING_PAGE.APPLICATION_UNDER_REVIEW')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('LANDING_PAGE.PENDING_MESSAGE')}
        </p>
      </div>
    </div>
  );
};

export default PendingPage;
