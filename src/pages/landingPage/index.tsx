import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';
import PendingPage from './PendingPage.tsx';
import NotRegisteredPage from './NotRegisteredPage.tsx';
import NotConfirmedPage from './NotConfirmedPage.tsx';
import { AxiosError } from 'axios';
import ErrorPage from './ErrorPage.tsx';

type Status =
  | 'NOT_REGISTERED'
  | 'PENDING'
  | 'APPROVED'
  | 'NOT_CONFIRMED'
  | null;

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
          navigate('/artists');
        }
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error?.response?.data?.code === 'user_inactive'
        ) {
          setStatus('NOT_CONFIRMED');
        } else {
          setError(
            'Failed to check registration status. Please try again later.'
          );
        }
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
    return <ErrorPage error={error} />;
  }

  if (status === 'PENDING') {
    return <PendingPage />;
  }

  if (status === 'NOT_REGISTERED') {
    return <NotRegisteredPage />;
  }

  if (status === 'NOT_CONFIRMED') {
    return <NotConfirmedPage />;
  }
  return null;
}
