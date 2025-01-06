import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, LogOut, UserCircle, Users } from 'lucide-react';
import { LanguageSelector } from '../header/LanguageSelector.tsx';
import { IData } from '../../contexts/MemberContext.tsx';

interface MobileMenuProps {
  closeMenu: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  memberData: IData;
}

const MobileMenu = ({
  closeMenu,
  isLoggedIn,
  onLogout,
  memberData,
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={closeMenu} />

      <div className="fixed inset-y-0 w-64 bg-white shadow-xl start-auto end-0">
        <div className="flex flex-col h-full">
          <div className="py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {isLoggedIn && memberData?.status === 'APPROVED' && (
                <>
                  <button
                    onClick={() => handleNavigation('/artists')}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <Users className="w-5 h-5" />
                    {t('HEADER.PERFORMERS')}
                  </button>
                  <button
                    onClick={() => handleNavigation('/members/performer')}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <UserCircle className="w-5 h-5" />
                    {t('HEADER.PERFORMER')}
                  </button>
                  <button
                    onClick={() => handleNavigation('/members/profile')}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                  >
                    <UserCircle className="w-5 h-5" />
                    {t('HEADER.PROFILE')}
                  </button>

                  {/*<button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50">*/}
                  {/*  <Bell className="w-5 h-5" />*/}
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
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                >
                  <LogOut className="w-5 h-5" />
                  {t('LOGOUT')}
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50"
                >
                  <LogIn className="w-5 h-5" />
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
