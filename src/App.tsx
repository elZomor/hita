import { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { PerformerForm } from './pages/performerRegistration';
import { HomePage } from './pages/homePage';
import { NotFoundPage } from './pages/notFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { UnauthorizedPage } from './pages/unauthorizedPage';

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
              <Route path="/" element={<HomePage />} />
              <Route
                path="/performers"
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performers/:username"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performers/registration"
                element={
                  <ProtectedRoute>
                    <PerformerForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/profile"
                element={
                  <ProtectedRoute>
                    <MemberProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <ProtectedRoute>
                    <LoginPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landing"
                element={
                  <ProtectedRoute>
                    <LandingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/registration"
                element={
                  <ProtectedRoute>
                    <MemberRegistration />
                  </ProtectedRoute>
                }
              />
              <Route path="/not-authorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Suspense>
  );
};
