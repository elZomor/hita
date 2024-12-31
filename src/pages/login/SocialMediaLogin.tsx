import { get_login_token, getUserId } from '../../utils/restUtils.ts';
import { useNavigate } from 'react-router-dom';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';

type SocialMediaLoginProps = {
  setIsLoading: (state: boolean) => void;
  setSnackbar: (snackBar: {
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }) => void;
};

const SocialMediaLogin = ({
  setIsLoading,
  setSnackbar,
}: SocialMediaLoginProps) => {
  const navigate = useNavigate();
  const { identifyUser } = useAmplitude();
  const { t } = useTranslation();

  // const onSuccessHandler = async (response: any) => {
  //   setIsLoading(true);
  //   try {
  //     await get_login_token(response.credential);
  //     identifyUser(getUserId());
  //     navigate('/landing');
  //     setSnackbar({
  //       open: true,
  //       message: 'Successfully logged in with Google!',
  //       type: 'success',
  //     });
  //   } catch {
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to login with Google. Please try again.',
  //       type: 'error',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onErrorHandler = () => {
    setSnackbar({
      open: true,
      message: 'Failed to login with Google. Please try again.',
      type: 'error',
    });
    setIsLoading(false);
  };

  const element = document.querySelector('span.nsm7Bb-HzV7m-LgbsSe-BPrWId');
  if (element && element.textContent !== t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE')) {
    element.textContent = t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE');
  }

  const handleRedirectCallback = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        throw new Error('Authorization code not found.');
      }

      await get_login_token(code); // Exchange the code for a session token
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
  };

  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      handleRedirectCallback();
    }
  }, []);

  return (
    <div className="flex w-full items-center justify-center">
      <GoogleLogin
        onSuccess={() => {}}
        onError={onErrorHandler}
        ux_mode="redirect"
        login_uri={'https://hita.eg-theater.online/auth/callback'}
      />
    </div>
  );
};

export default SocialMediaLogin;
