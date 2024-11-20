import { Suspense, useEffect } from 'react';
import './App.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { arSA, enUS } from '@clerk/localizations';
import HomeScreen from './components/homeScreen/HomeScreen.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export const App = () => {
  const { i18n } = useTranslation();
  const localization = i18n.language === 'ar' ? arSA : enUS;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);
  // document
  //     .getElementsByTagName('html')[0]
  //     .setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');

  return (
    <Suspense fallback="Loading...">
      <ClerkProvider
        localization={localization}
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <HomeScreen />
      </ClerkProvider>
    </Suspense>
  );
};
