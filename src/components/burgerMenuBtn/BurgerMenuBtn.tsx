import { useLocation } from 'react-router-dom';

interface BurgerMenuBtnProps {
  clickHandler: () => void;
  isOpen: boolean;
}

const BurgerMenuBtn = ({ clickHandler, isOpen }: BurgerMenuBtnProps) => {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <button
      onClick={clickHandler}
      className="p-2 transition-colors rounded-lg hover:bg-purple-300"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="relative flex flex-col justify-between w-6 h-5">
        <span
          className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          } ${isHomePage ? 'bg-purple-300' : 'bg-gray-700'}`}
        />
        <span
          className={`w-full h-0.5 bg-gray-700 transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : ''
          } ${isHomePage ? 'bg-purple-300' : 'bg-gray-700'}`}
        />
        <span
          className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          } ${isHomePage ? 'bg-purple-300' : 'bg-gray-700'}`}
        />
      </div>
    </button>
  );
};

export default BurgerMenuBtn;
