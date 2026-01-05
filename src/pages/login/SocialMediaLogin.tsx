import { get_login_token, getUserId } from '../../utils/restUtils.ts';
import { useNavigate } from 'react-router-dom';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';

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

  const onSuccessHandler = async (response: any) => {
    setIsLoading(true);
    try {
      await get_login_token(response.credential);
      identifyUser(getUserId());
      const referralLink = sessionStorage.getItem('referralLink');
      if (referralLink) {
        sessionStorage.removeItem('referralLink');
        navigate(referralLink);
      } else {
        navigate('/landing');
      }
      setSnackbar({
        open: true,
        message: t('SUCCESS.GOOGLE_LOGIN_SUCCESS'),
        type: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: t('ERRORS.GOOGLE_LOGIN_FAILED'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onErrorHandler = () => {
    setSnackbar({
      open: true,
      message: t('ERRORS.GOOGLE_LOGIN_FAILED'),
      type: 'error',
    });
    setIsLoading(false);
  };

  const element = document.querySelector('span.nsm7Bb-HzV7m-LgbsSe-BPrWId');
  if (element && element.textContent !== t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE')) {
    element.textContent = t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE');
  }

  return (
    <div className="flex w-full items-center justify-center">
      <GoogleLogin onSuccess={onSuccessHandler} onError={onErrorHandler} />
    </div>
  );
};

export default SocialMediaLogin;
