import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, LogOut, UserCircle, Users } from 'lucide-react';
import { LanguageSelector } from '../header/LanguageSelector.tsx';

interface MobileMenuProps {
  closeMenu: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MobileMenu = ({ closeMenu, isLoggedIn, onLogout }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={closeMenu} />

      <div className="fixed inset-y-0 start-auto end-0 w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => handleNavigation('/performers')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <Users className="h-5 w-5" />
                    {t('HEADER.PERFORMERS')}
                  </button>
                  <button
                    onClick={() => handleNavigation('/members/performer')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <UserCircle className="h-5 w-5" />
                    {t('HEADER.PERFORMER')}
                  </button>
                  <button
                    onClick={() => handleNavigation('/members/profile')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <UserCircle className="h-5 w-5" />
                    {t('HEADER.PROFILE')}
                  </button>

                  {/*<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50">*/}
                  {/*  <Bell className="h-5 w-5" />*/}
                  {/*  {t('HEADER.NOTIFICATIONS')}*/}
                  {/*</button>*/}
                </>
              )}

              <div className="px-1 py-2">
                <LanguageSelector closeMenu={closeMenu} />
              </div>
              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                >
                  <LogOut className="h-5 w-5" />
                  {t('LOGOUT')}
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                >
                  <LogIn className="h-5 w-5" />
                  {t('LOGIN')}
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
