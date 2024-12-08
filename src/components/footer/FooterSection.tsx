import { FC, ReactNode } from 'react';

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

const FooterSection: FC<FooterSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
};

export default FooterSection;
