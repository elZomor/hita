import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Account() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    setIsLoggedIn(token !== null);
  }, [token]);

  const handleLogin = () => {
    navigate('/login');
  };
  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  return (
    <div>
      {isLoggedIn ? (
        <a onClick={handleLogout}>{t('LOGOUT')}</a>
      ) : (
        <a onClick={handleLogin}>{t('LOGIN')}</a>
      )}
    </div>
  );
}

export default Account;
