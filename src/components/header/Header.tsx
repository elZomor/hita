import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, LogOut, UserCircle, Users } from 'lucide-react';
import logo from '../../assets/images/logo.svg';
import Container from '../container/Container.tsx';
import BurgerMenuBtn from '../burgerMenuBtn/BurgerMenuBtn.tsx';
import MobileMenu from '../mobileMenu/MobileMenu.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { clsx } from 'clsx';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isRTL = i18n.language === 'ar';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
    setShowAccountMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowAccountMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`top-0 z-50 w-full h-16 sticky bg-purple-200 border-b border-gray-200`}
    >
      <Container classess="px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {
            <div className="flex items-center cursor-pointer w-[150px] h-[160px]">
              <img
                src={logo}
                alt="Actogram"
                className="object-cover max-w-full max-h-full"
                onClick={() => navigate('/')}
              />
            </div>
          }

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-6 md:flex">
            {isLoggedIn && (
              <>
                <button
                  onClick={() => navigate('/artists')}
                  className="p-2 transition-colors rounded-lg hover:bg-purple-300"
                  title={t('HEADER.PERFORMERS')}
                >
                  <Users className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => navigate('/members/performer')}
                  className="p-2 transition-colors rounded-lg hover:bg-purple-300"
                  title={t('HEADER.PERFORMER')}
                >
                  <UserCircle className="w-5 h-5 text-gray-700" />
                </button>
                {/*<button*/}
                {/*  className="p-2 transition-colors rounded-lg hover:bg-purple-300"*/}
                {/*  title={t('NOTIFICATIONS')}*/}
                {/*>*/}
                {/*  <Bell className="w-5 h-5 text-gray-700" />*/}
                {/*</button>*/}
              </>
            )}

            <LanguageSelector />
            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="p-2 transition-colors rounded-lg hover:bg-purple-300"
              >
                {isLoggedIn ? (
                  <UserCircle className={`w-5 h-5  text-gray-700`} />
                ) : (
                  <LogIn className={`w-5 h-5 text-gray-700`} />
                )}
              </button>

              {showAccountMenu && (
                <div
                  className={clsx(
                    'absolute mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200',
                    'rtl:left-0 ltr:right-0'
                  )}
                  ref={dropdownRef}
                >
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/members/profile');
                          setShowAccountMenu(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 text-start hover:bg-purple-50"
                      >
                        {t('HEADER.PROFILE')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 text-start hover:bg-purple-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('LOGOUT')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate('/login');
                        setShowAccountMenu(false);
                      }}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 text-start hover:bg-purple-50"
                    >
                      <LogIn className="w-4 h-4" />
                      {t('LOGIN')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <BurgerMenuBtn
              isOpen={showMobileMenu}
              clickHandler={() => setShowMobileMenu(!showMobileMenu)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <MobileMenu
            closeMenu={() => setShowMobileMenu(false)}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}
      </Container>
    </header>
  );
}
