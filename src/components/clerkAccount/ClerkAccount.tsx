import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';

function ClerkAccount() {
  const clerk = useClerk();
  const { t } = useTranslation();

  const handleLogin = () => {
    clerk.openSignIn();
  };
  const handleLogout = async () => {
    await clerk.signOut();
  };
  return (
    <div>
      <SignedOut>
        <a onClick={handleLogin}>{t('LOGIN')}</a>
      </SignedOut>
      <SignedIn>
        <a onClick={handleLogout}>{t('LOGOUT')}</a>
      </SignedIn>
    </div>
  );
}

export default ClerkAccount;
