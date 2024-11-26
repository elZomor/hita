import { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useTranslation } from 'react-i18next';
import HomeScreen from './pages/homeScreen/index.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import Profile from './pages/performerProfile/index.tsx';
import { MemberRegistration } from './pages/memberRegistration';
import { LoginPage } from './pages/login';
import { GOOGLE_CLIENT_ID } from './constants.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LandingPage } from './pages/landingPage';
import { MemberProfilePage } from './pages/memberProfile';

export const App = () => {
  const { i18n } = useTranslation();

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
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/performers/:username" element={<Profile />} />
              <Route path="/profile/me" element={<MemberProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route
                path="/member/registration"
                element={<MemberRegistration />}
              />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Suspense>
  );
};
