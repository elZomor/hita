import Account from '../account/Account.tsx';
import Container from '../container/Container.tsx';
import { useState } from 'react';
import MobileMenu from '../mobileMenu/MobileMenu.tsx';
import BurgerMenuBtn from '../burgerMenuBtn/BurgerMenuBtn.tsx';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.jpeg';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const changeLanguage = () => {
    if (i18n.language === 'ar') {
      i18n.changeLanguage('en');
      localStorage.setItem('language', 'en');
    } else {
      i18n.changeLanguage('ar');
      localStorage.setItem('language', 'ar');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-purple-100 border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center h-full cursor-pointer">
            <img
              src={logo}
              alt="Actogram"
              className="w-full h-full object-cover"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button> */}
            <button
              onClick={() => navigate('/members/profile')}
              className="hidden md:block items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('HEADER.PROFILE')}
            </button>
            <button
              onClick={() => navigate('/performers')}
              className="hidden md:block items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('HEADER.PERFORMERS')}
            </button>
            <button className="hidden px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg md:block hover:bg-purple-700">
              <Account />
            </button>
            <button
              onClick={changeLanguage}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('OTHER_LANGUAGE')}
            </button>
            <div className="md:hidden">
              <BurgerMenuBtn
                isOpen={showMobileMenu}
                clickHandler={() => {
                  setShowMobileMenu((prev) => !prev);
                }}
              />
            </div>
          </div>

          {showMobileMenu && (
            <MobileMenu closeMenu={() => setShowMobileMenu(false)} />
          )}
        </div>
      </Container>
    </header>
  );
}
