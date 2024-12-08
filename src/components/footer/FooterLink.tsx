import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
}

const FooterLink: FC<FooterLinkProps> = ({ href, children, external }) => {
  const className = 'text-gray-600 hover:text-purple-600 transition-colors';

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

export default FooterLink;
