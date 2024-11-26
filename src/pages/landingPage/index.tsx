import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';

type Status = 'NOT_REGISTERED' | 'PENDING' | 'APPROVED' | null;

interface StatusResponse {
  status: Status;
}

export function LandingPage() {
  const [status, setStatus] = useState<Status>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await get_request('hita/members/status');
        if (response.status === 401) {
          navigate('/login');
        }
        const responseData: StatusResponse = response.data.data;
        const status: Status = responseData.status;

        setStatus(status);

        if (status === 'APPROVED') {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
        setError(
          'Failed to check registration status. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            {t('LANDING_PAGE.CHECKING_STATUS')}
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {t('LANDING_PAGE.TRY_AGAIN')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'PENDING') {
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
  }

  if (status === 'NOT_REGISTERED') {
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
            onClick={() => navigate('/member/registration')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {t('LANDING_PAGE.REGISTER_NOW')}
          </button>
        </div>
      </div>
    );
  }
  return null;
}
