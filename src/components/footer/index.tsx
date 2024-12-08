import { useTranslation } from 'react-i18next';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-purple-200 p-5 h-16">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} {t('GEN.COPY_RIGHTS')}
          </p>
          <p className="text-sm text-gray-500">
            {t('GEN.FOR_DETAILS')}: info@eg-theater.online
          </p>
        </div>
        {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-8">*/}
        {/*  <FooterSection title="Company">*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/about">About Us</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/careers">Careers</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/press">Press</FooterLink>*/}
        {/*    </li>*/}
        {/*  </FooterSection>*/}

        {/*  <FooterSection title="Resources">*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/blog">Blog</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/documentation">Documentation</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/help">Help Center</FooterLink>*/}
        {/*    </li>*/}
        {/*  </FooterSection>*/}

        {/*  <FooterSection title="Legal">*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/privacy">Privacy Policy</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/terms">Terms of Service</FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="/cookies">Cookie Policy</FooterLink>*/}
        {/*    </li>*/}
        {/*  </FooterSection>*/}

        {/*  <FooterSection title="Connect">*/}
        {/*    <li>*/}
        {/*      <FooterLink href="https://twitter.com/youraccount" external>*/}
        {/*        <span className="flex items-center gap-2">*/}
        {/*          <Twitter size={16} /> Twitter*/}
        {/*        </span>*/}
        {/*      </FooterLink>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <FooterLink href="https://github.com/youraccount" external>*/}
        {/*        <span className="flex items-center gap-2">*/}
        {/*          <Github size={16} /> GitHub*/}
        {/*        </span>*/}
        {/*      </FooterLink>*/}
        {/*    </li>*/}
        {/*  </FooterSection>*/}
        {/*</div>*/}
      </div>
    </footer>
  );
};

export default Footer;
