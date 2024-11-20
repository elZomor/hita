import React from 'react';

interface IProps {
  children: JSX.Element;
  classess?: string;
}

const Container: React.FC<IProps> = ({ children, classess = '' }) => {
  return <div className={`appContainer w-full ${classess}`}>{children}</div>;
};

export default Container;
