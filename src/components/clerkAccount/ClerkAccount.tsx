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
    <div className="pt-4 cursor-pointer">
      <SignedOut>
        <a
          onClick={handleLogin}
          className="mx-4 text-lg border-b-2 border-transparent hover:border-b-2 hover:border-indigo-300 transition duration-500"
        >
          {t('LOGIN')}
        </a>
      </SignedOut>
      <SignedIn>
        <a
          onClick={handleLogout}
          className="mx-4 text-lg border-b-2 border-transparent hover:border-b-2 hover:border-indigo-300 transition duration-500"
        >
          {t('LOGOUT')}
        </a>
      </SignedIn>
    </div>
  );
}

export default ClerkAccount;
