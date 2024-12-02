interface BurgerMenuBtnProps {
  clickHandler: () => void;
  isOpen: boolean;
}

const BurgerMenuBtn = ({ clickHandler, isOpen }: BurgerMenuBtnProps) => {
  return (
    <button
      onClick={clickHandler}
      className="p-2 rounded-lg hover:bg-purple-300 transition-colors"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        <span
          className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`w-full h-0.5 bg-gray-700 transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  );
};

export default BurgerMenuBtn;
