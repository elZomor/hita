import { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useTranslation } from 'react-i18next';
import HomeScreen from './pages/performersHomeScreen/index.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import PerformerProfile from './pages/performerProfile/index.tsx';
import { MemberRegistration } from './pages/memberRegistration';
import { LoginPage } from './pages/login';
import { AMPLITUDE_API_KEY, GOOGLE_CLIENT_ID } from './constants.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LandingPage } from './pages/landingPage';
import { MemberProfilePage } from './pages/memberProfile';
import { HomePage } from './pages/homePage';
import { NotFoundComponent } from './components/shared/notFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { PerformerLandingPage } from './pages/performerLandingPage';
import { EditModeProvider } from './contexts/EditModeContext.tsx';
import { NewPerformerForm } from './pages/newPerformerRegistration';
import { ScrollToTop } from './hooks/ScrollToTop.tsx';
import { init } from '@amplitude/analytics-browser';

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

  init(AMPLITUDE_API_KEY, { autocapture: true });

  return (
    <Suspense fallback="Loading...">
      <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ScrollToTop />
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
                    <EditModeProvider>
                      <PerformerProfile />
                    </EditModeProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performers/registration"
                element={
                  <ProtectedRoute>
                    <NewPerformerForm />
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
                path="/members/performer"
                element={
                  <ProtectedRoute>
                    <PerformerLandingPage />
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
              <Route
                path="*"
                element={<NotFoundComponent resourceName={'Page'} />}
              />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Suspense>
  );
};
