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
import { useMember } from '../../contexts/MemberContext.tsx';
import { Snackbar } from '../shared/snackBar/SnackBar.tsx';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import InvitationModal from './InvitationModal.tsx';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isRTL = i18n.language === 'ar';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const routeName = pathname?.split('/');
  const { memberData } = useMember();
  const { trackEvent } = useAmplitude();
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
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
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('memberData');
    navigate('/login');
    setShowAccountMenu(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      headerRef.current &&
      !headerRef.current.contains(event.target as Node)
    ) {
      setShowInvitationModal(false);
    }
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
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isStatus = (status: string) => {
    return memberData?.status === status;
  };

  const isPage = () => {
    let page = '';

    if (routeName[1] === 'artists') {
      if (
        routeName[2] === 'registration' ||
        routeName[2] === memberData?.username
      ) {
        page = 'performer';
      } else {
        page = 'performers';
      }
    }

    return page;
  };
  const handleCopyInvitation = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/members/registration?${memberData.invitationCode}`
    );
    setShowMobileMenu(false);
    setShowInvitationModal(false);
    trackEvent('invite');
    setSnackbar({
      open: true,
      message: t('HEADER.INVITATION_LINK_COPIED'),
      type: 'success',
    });
  };

  return (
    <>
      <header
        className={`top-0 z-50 w-full h-20 sticky bg-black shadow-md`}
        ref={headerRef}
      >
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
              {isLoggedIn && isStatus('APPROVED') && (
                <>
                  <button
                    onClick={() => setShowInvitationModal(true)}
                    className={`p-2 text-purple-350 transition-colors hover:text-purple-300 h-full font-semibold text-[17px]`}
                  >
                    {t('HEADER.INVITE')}
                  </button>
                  <button
                    onClick={() => navigate('/artists')}
                    className={`p-2 text-purple-350 transition-colors hover:text-purple-300 h-full font-semibold text-[17px] ${isPage() === 'performers' ? 'border-b-[4px] border-purple-350' : ''}`}
                  >
                    {t('HEADER.PERFORMERS')}
                  </button>
                  <button
                    onClick={() => navigate('/members/performer')}
                    className={`h-full p-2 text-[17px] text-purple-350 transition-colors hover:text-purple-300 font-semibold ${isPage() === 'performer' ? 'border-b-[4px] border-purple-350' : ''}`}
                  >
                    {t('HEADER.PERFORMER')}
                  </button>
                </>
              )}

              <LanguageSelector />
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
                      <span className="text-purple-350">
                        {memberData?.name}
                      </span>
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
                        {!isStatus('NOT_REGISTERED') && (
                          <button
                            onClick={() => {
                              navigate('/members/profile');
                              setShowAccountMenu(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 text-start hover:bg-purple-50"
                          >
                            {t('HEADER.PROFILE')}
                          </button>
                        )}
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
              memberData={memberData}
              isPage={isPage}
              handleCopyInvitation={() => setShowInvitationModal(true)}
            />
          )}
        </Container>
      </header>
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
      <InvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        onConfirm={handleCopyInvitation}
      />
    </>
  );
}
