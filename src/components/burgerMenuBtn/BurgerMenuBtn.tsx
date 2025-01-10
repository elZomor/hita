interface BurgerMenuBtnProps {
  clickHandler: () => void;
  isOpen: boolean;
}

const BurgerMenuBtn = ({ clickHandler, isOpen }: BurgerMenuBtnProps) => {
  return (
    <button
      onClick={clickHandler}
      className="transition-colors rounded-lg hover:bg-purple-300"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="relative flex flex-col justify-between w-6 h-5">
        <span
          className={`w-full h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          } ${'bg-gray-700'}`}
        />
        <span
          className={`w-full h-0.5 bg-white transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : ''
          } ${'bg-gray-700'}`}
        />
        <span
          className={`w-full h-0.5 bg-white transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          } ${'bg-gray-700'}`}
        />
      </div>
    </button>
  );
};

export default BurgerMenuBtn;
