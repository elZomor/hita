import { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { arSA, enUS } from '@clerk/localizations';
import HomeScreen from './pages/homeScreen/HomeScreen.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import Profile from './pages/profile/index.tsx';

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

  document
    .getElementsByTagName('html')[0]
    .setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');

  return (
    <Suspense fallback="Loading...">
      <BrowserRouter>
        <ClerkProvider
          localization={localization}
          publishableKey={PUBLISHABLE_KEY}
          afterSignOutUrl="/"
        >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/profile/:name" element={<Profile />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </Suspense>
  );
};
