import { useGoogleLogin } from '@react-oauth/google';
import { get_login_token, getUserId } from '../../utils/restUtils.ts';
import { useNavigate } from 'react-router-dom';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import { useTranslation } from 'react-i18next';

type SocialMediaLoginProps = {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setSnackbar: (snackBar: {
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }) => void;
};

const SocialMediaLogin = ({
  isLoading,
  setIsLoading,
  setSnackbar,
}: SocialMediaLoginProps) => {
  const navigate = useNavigate();
  const { identifyUser } = useAmplitude();
  const { t } = useTranslation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await get_login_token(response.access_token);
        identifyUser(getUserId());
        navigate('/landing');
        setSnackbar({
          open: true,
          message: 'Successfully logged in with Google!',
          type: 'success',
        });
      } catch {
        setSnackbar({
          open: true,
          message: 'Failed to login with Google. Please try again.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to login with Google. Please try again.',
        type: 'error',
      });
      setIsLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleLogin();
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE')}
      </button>
    </div>
  );
};

export default SocialMediaLogin;
