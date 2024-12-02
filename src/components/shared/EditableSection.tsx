import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

const Section = ({ title, children, headerActions }: SectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {headerActions}
      </div>
      {children}
    </div>
  );
};

export default Section;
