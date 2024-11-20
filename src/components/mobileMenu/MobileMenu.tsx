import React, { useState } from 'react';

const tabs = [
  {
    id: 1,
    name: 'Login',
    icon: '',
    route: '/login',
  },

  { id: 2, name: 'Profile', icon: '', route: '/performer' },
];

interface IProps {
  closeMenu: () => void;
}
const MobileMenu: React.FC<IProps> = ({ closeMenu }) => {
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const clickTabHandler = (index: number, route: string): void => {
    setSelectedTab(index);
    closeMenu();
    console.log(route);
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
                <span className="px-2 whitespace-nowrap">{tab.name}</span>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default MobileMenu;
