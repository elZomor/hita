import { ClipboardCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PendingPage = () => {
  const { t } = useTranslation();
  // const handleResendConfirmationMail = () => {};
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="bg-yellow-100 rounded-full p-3 w-fit mx-auto">
          <ClipboardCheck className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {t('LANDING_PAGE.WAITING_CONFIRMATION')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('LANDING_PAGE.WAITING_CONFIRMATION_MESSAGE')}
        </p>
        {/*<button*/}
        {/*  onClick={handleResendConfirmationMail}*/}
        {/*  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"*/}
        {/*>*/}
        {/*  {t('LANDING_PAGE.RESEND_MAIL')}*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default PendingPage;
