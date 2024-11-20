import { Search, Star } from 'lucide-react';
import ClerkAccount from '../clerkAccount/ClerkAccount.tsx';
import Container from '../container/Container.tsx';
import { useState } from 'react';
import MobileMenu from '../mobileMenu/MobileMenu.tsx';
import BurgerMenuBtn from '../burgerMenuBtn/BurgerMenuBtn.tsx';
import { useTranslation } from 'react-i18next';
import useIsEng from '../../hooks/useIsEng.tsx';

export default function Header() {
  const [showMOblieMenu, setShowMOblieMenu] = useState(false);
  const { i18n } = useTranslation();
  const { isEng } = useIsEng();

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-purple-600" />
            <span className="ml-2 text-xl font-bold">ActorsList</span>
          </div>

          <div className="hidden max-w-2xl mx-8 md:flex">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by name, specialty, or location..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button> */}
            <button className="hidden px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg md:block hover:bg-purple-700">
              <ClerkAccount />
            </button>
            <button
              onClick={changeLanguage}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isEng() ? 'AR' : 'EN'}
            </button>
            <div className="md:hidden">
              <BurgerMenuBtn
                isOpen={showMOblieMenu}
                clickHandler={() => {
                  setShowMOblieMenu((prev) => !prev);
                }}
              />
            </div>
          </div>

          {showMOblieMenu && (
            <MobileMenu closeMenu={() => setShowMOblieMenu(false)} />
          )}
        </div>
      </Container>
    </header>
  );
}
