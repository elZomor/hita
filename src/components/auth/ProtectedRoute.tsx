import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getRouteProps } from '../../utils/routeUtils';
import { isLoggedIn } from '../../utils/tokenUtils.ts';
import { get_request } from '../../utils/restUtils.ts';
import { UnauthorizedPage } from '../shared/unauthorized';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useMember } from '../../contexts/MemberContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

type MemberStatus =
  | 'ANONYMOUS'
  | 'NOT_CONFIRMED'
  | 'NOT_REGISTERED'
  | 'PENDING'
  | 'APPROVED'
  | 'PERFORMER';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { path } = getRouteProps(children);
  const { t } = useTranslation();
  const { setMemberData } = useMember();

  const PATHS_MAP: Record<string, Set<MemberStatus>> = {
    '/login': new Set(['ANONYMOUS']),
    '/artists/*': new Set(['APPROVED', 'PERFORMER']),
    '/artists/registration': new Set(['APPROVED']),
    '/members/profile': new Set(['PENDING', 'APPROVED', 'PERFORMER']),
    '/members/registration': new Set(['NOT_REGISTERED']),
    '/members/performer': new Set(['APPROVED', 'PERFORMER']),
    '/landing': new Set([
      'ANONYMOUS',
      'NOT_REGISTERED',
      'NOT_CONFIRMED',
      'PENDING',
      'APPROVED',
      'PERFORMER',
    ]),
  };

  const checkPaths = (path: string, memberStatus: MemberStatus) => {
    if (path.includes('landing') && memberStatus === 'ANONYMOUS') {
      navigate('/login');
    }
    if (path.includes('login') && memberStatus !== 'ANONYMOUS') {
      navigate('/landing');
    }
    let allowedSet: Set<MemberStatus>;
    if (path.includes('artists') && !path.includes('registration')) {
      const key = '/artists/*';
      allowedSet = PATHS_MAP[key];
    } else {
      allowedSet = PATHS_MAP[path];
    }
    setIsAuthorized(allowedSet.has(memberStatus));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isLoggedIn()) {
          checkPaths(path || location.pathname, 'ANONYMOUS');
          return;
        }
        const { data, status } = await get_request('hita/members/status');
        if (status === 200) {
          const { name, status, username } = data.data;
          setMemberData({ status, name, username });
          localStorage.setItem(
            'memberData',
            JSON.stringify({ status, name, username })
          );
          if (data.data.performer) {
            checkPaths(path || location.pathname, 'PERFORMER');
            return;
          }
          checkPaths(path || location.pathname, data.data.status);
          return;
        } else {
          navigate('/login');
        }
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error?.response?.data?.code === 'user_inactive'
        ) {
          checkPaths(path || location.pathname, 'NOT_CONFIRMED');
          return;
        } else {
          setIsAuthorized(false);
        }
      }
    };

    checkAuth();
  }, [navigate, path, location.pathname]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto text-purple-600 animate-spin" />
          <p className="mt-2 text-sm text-gray-600">{t('GEN.CHECKING_AUTH')}</p>
        </div>
      </div>
    );
  } else if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
