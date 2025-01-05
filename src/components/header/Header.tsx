import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import logo from '../../assets/images/logo.svg';
import arrowDown from '../../assets/icons/arrowDown.svg';
import Container from '../container/Container.tsx';
import BurgerMenuBtn from '../burgerMenuBtn/BurgerMenuBtn.tsx';
import MobileMenu from '../mobileMenu/MobileMenu.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { clsx } from 'clsx';
import { useMember } from '../../contexts/memberContext.tsx';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isRTL = i18n.language === 'ar';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const routName = pathname?.split('/');
  const { memberName } = useMember();

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
    <header className={`top-0 z-50 w-full h-20 sticky bg-black shadow-md`}>
      <Container classess="px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="flex items-center justify-between w-full h-full">
          {/* Logo */}
          {
            <div className="flex items-center cursor-pointer w-[150px]">
              <img
                src={logo}
                alt="Actogram"
                className="object-cover max-w-full max-h-full"
                onClick={() => navigate('/')}
              />
            </div>
          }

          {/* Desktop Navigation */}
          <div className="items-center hidden h-full gap-6 md:flex">
            {isLoggedIn && (
              <>
                <button
                  onClick={() => navigate('/artists')}
                  className={`p-2 text-purple-350 transition-colors hover:text-purple-300 h-full font-semibold text-[17px] ${routName[1] === 'artists' && !routName[2] ? 'border-b-[4px] border-purple-350' : ''}`}
                  // title={t('HEADER.PERFORMERS')}
                >
                  {t('HEADER.PERFORMERS')}
                  {/* <Users className="w-5 h-5 text-gray-700" /> */}
                </button>
                <button
                  onClick={() => navigate('/members/performer')}
                  className={`h-full p-2 text-[17px] text-purple-350 transition-colors hover:text-purple-300 font-semibold ${routName[2] ? 'border-b-[4px] border-purple-350' : ''}`}
                >
                  {t('HEADER.PERFORMER')}
                  {/* <UserCircle className="w-5 h-5 text-gray-700" /> */}
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
                className="p-2 transition-colors rounded-lg"
              >
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <UserCircle
                      className={`w-5 h-5  text-purple-350 hover:text-purple-300`}
                    />
                    <span className="text-purple-350">{memberName}</span>
                    <img src={arrowDown} alt="arrow" />
                  </div>
                ) : (
                  <LogIn className={`w-5 h-5 text-purple-350`} />
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
