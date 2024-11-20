import React from 'react';

interface IProps {
  clickHandler: () => void;
  isOpen: boolean;
}

const BurgerMenuBtn: React.FC<IProps> = ({
  clickHandler = () => '',
  isOpen,
}) => {
  return (
    <div
      onClick={clickHandler}
      className="flex flex-col justify-between w-9 h-7"
    >
      <div
        className={`relative w-full h-1 transition-all duration-500 bg-purple-700 ${
          isOpen ? 'rotate-45 top-3' : 'rotate-0 top-0'
        }`}
      ></div>
      <div
        className={`w-full h-1 bg-purple-700 ${isOpen ? 'opacity-0 duration-500 transition-all' : ''}`}
      ></div>
      <div
        className={`relative w-full h-1 transition-all duration-500 bg-purple-700
           ${isOpen ? 'rotate-[-45deg] bottom-3' : 'rotate-0 bottom-0'}`}
      ></div>
    </div>
  );
};

export default BurgerMenuBtn;
