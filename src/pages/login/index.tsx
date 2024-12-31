import { useEffect, useState } from 'react';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';
import SocialMediaLogin from './SocialMediaLogin.tsx';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import InAppBrowser from './InAppBrowser.tsx';
// import Login from './Login.tsx';
// import Signup from './Signup.tsx';

export function LoginPage() {
  const [tacText, setTacText] = useState('');
  const [ppText, setPPText] = useState('');
  // const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const isInAppBrowser =
    /FBAN|FBAV|Instagram|Messenger|WhatsApp|Snapchat|Twitter/i.test(
      navigator.userAgent
    );
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const { trackEvent } = useAmplitude();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    console.log(isLoading);
    const fetchData = async () => {
      if (tacText === '') {
        const { data } = await get_request('auth/policy/terms-and-conditions');
        setTacText(data['content']);
      }
      if (ppText === '') {
        const { data } = await get_request('auth/policy/privacy-policy');
        setPPText(data['content']);
      }
    };
    fetchData().then();
  }, []);

  const openExternalBrowser = () => {
    if (isInAppBrowser) {
      const currentUrl = window.location.href;
      if (isIOS) {
        trackEvent('ios_login');
        const a = document.createElement('a');
        a.href = currentUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();

        setTimeout(() => {
          const copyToClipboard = async () => {
            try {
              await navigator.clipboard.writeText(currentUrl);
              alert(t('GEN.PAGE_DID_NOT_OPEN'));
            } catch {
              alert(
                "The link didn't open automatically. Please open this page in Safari manually."
              );
            }
          };
          copyToClipboard();
        }, 1000);
      } else {
        const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
        trackEvent('android_login');
        window.open(intentUrl, '_blank');
      }
    }
  };
  if (isInAppBrowser) {
    return <InAppBrowser onClick={openExternalBrowser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[75%]">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('LOGIN_PAGE.WELCOME_BACK')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('LOGIN_PAGE.PLEASE_SIGN_IN')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full md:max-w-[65%]">
          <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <SocialMediaLogin
              setIsLoading={setIsLoading}
              setSnackbar={setSnackbar}
            />
            {/*<div className="mt-6">*/}
            {/*  <div className="relative">*/}
            {/*    <div className="absolute inset-0 flex items-center">*/}
            {/*      <div className="w-full border-t border-gray-300" />*/}
            {/*    </div>*/}
            {/*    <div className="relative flex justify-center text-sm">*/}
            {/*      <span className="px-2 bg-white text-gray-500">*/}
            {/*        {t('LOGIN_PAGE.CONTINUE_WITH')}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*{showSignUp ? (*/}
            {/*  <Signup*/}
            {/*    setShowSignUp={setShowSignUp}*/}
            {/*    isLoading={isLoading}*/}
            {/*    setIsLoading={setIsLoading}*/}
            {/*    setSnackbar={setSnackbar}*/}
            {/*    tacText={tacText}*/}
            {/*    ppText={ppText}*/}
            {/*  />*/}
            {/*) : (*/}
            {/*  <Login*/}
            {/*    setShowSignUp={setShowSignUp}*/}
            {/*    isLoading={isLoading}*/}
            {/*    setIsLoading={setIsLoading}*/}
            {/*    setSnackbar={setSnackbar}*/}
            {/*  />*/}
            {/*)}*/}
          </div>
        </div>
      </div>

      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
