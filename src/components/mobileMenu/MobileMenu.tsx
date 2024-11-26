import React, { useState } from 'react';
import Account from '../account/Account.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const tabs = [
  {
    id: 1,
    name: <Account />,
    icon: '',
    route: '/login',
  },
  { id: 2, name: 'PROFILE', icon: '', route: 'profile/me' },
];

interface IProps {
  closeMenu: () => void;
}

const MobileMenu: React.FC<IProps> = ({ closeMenu }) => {
  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const clickTabHandler = (index: number, route: string): void => {
    setSelectedTab(index);
    closeMenu();
    navigate(route);
  };

  return (
    <div className="bg-white mobile-menu main-wrapper py-6 absolute top-[57px] left-0 z-[99] flex flex-col justify-between w-full">
      <ul className="flex flex-col gap-2 m-0 mt-12 list-none">
        {tabs.map((tab, index) => {
          return (
            <React.Fragment key={tab.id}>
              <li
                onClick={() => {
                  clickTabHandler(index, tab.route);
                }}
                className={`flex items-center w-full gap-2 py-2 ps-5 cursor-pointer hover:ps-7 transition-all duration-300 ${
                  selectedTab
                    ? 'border-l-[5px] border-primary-500 bg-primary-40 font-extrabold text-primary-500'
                    : 'font-bold text-slate-500'
                }`}
              >
                {tab.icon}
                <span className="px-2 whitespace-nowrap">
                  {typeof tab.name === 'string'
                    ? t('HEADER.' + tab.name)
                    : tab.name}
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default MobileMenu;
