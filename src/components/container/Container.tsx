import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  classess?: string;
}

const Container = ({ children, classess = '' }: ContainerProps) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${classess}`}>
      {children}
    </div>
  );
};

export default Container;
