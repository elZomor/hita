import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getRouteProps } from '../../utils/routeUtils';
import { isLoggedIn } from '../../utils/tokenUtils.ts';
import { get_request } from '../../utils/restUtils.ts';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

type MemberStatus =
  | 'ANONYMOUS'
  | 'NOT_REGISTERED'
  | 'PENDING'
  | 'APPROVED'
  | 'PERFORMER';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { path } = getRouteProps(children);

  const PATHS_MAP: Record<string, Set<MemberStatus>> = {
    '/login': new Set(['ANONYMOUS']),
    '/performers/*': new Set(['APPROVED', 'PERFORMER']),
    '/performers/registration': new Set(['APPROVED']),
    '/members/profile': new Set(['PENDING', 'APPROVED', 'PERFORMER']),
    '/members/registration': new Set(['NOT_REGISTERED']),
    '/landing': new Set(['NOT_REGISTERED', 'PENDING', 'APPROVED', 'PERFORMER']),
  };

  const checkPaths = (path: string, memberStatus: MemberStatus) => {
    let allowedSet: Set<MemberStatus>;

    if (path.includes('performers') && !path.includes('registration')) {
      const key = '/performers/*';
      allowedSet = PATHS_MAP[key];
    } else {
      allowedSet = PATHS_MAP[path];
    }
    console.log('******************************');
    console.log(memberStatus);
    console.log(allowedSet);
    console.log(allowedSet.has(memberStatus));
    console.log('******************************');
    setIsAuthorized(allowedSet.has(memberStatus));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth for path:', path || location.pathname);
        if (!isLoggedIn()) {
          checkPaths(path || location.pathname, 'ANONYMOUS');
          return;
        }
        const { data, status } = await get_request('hita/members/status');
        if (status === 200) {
          if (data.data.performer) {
            checkPaths(path || location.pathname, 'PERFORMER');
            return;
          }
          checkPaths(path || location.pathname, data.data.status);
          console.log(data.data.status);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
        navigate('/not-found');
      }
    };

    checkAuth();
  }, [navigate, path, location.pathname]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-600">
            Checking authorization...
          </p>
        </div>
      </div>
    );
  } else if (!isAuthorized) {
    navigate('/not-authorized');
    return null;
  }

  return <>{children}</>;
}
