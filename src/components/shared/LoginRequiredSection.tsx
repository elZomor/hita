import { useTranslation } from 'react-i18next';
import { FaLock } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const LoginRequiredSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center border rounded-2xl shadow-md p-4 bg-gray-100 w-full">
      <FaLock className="text-purple-500 mx-3" size={16} />
      <span className="text-lg font-semibold text-purple-700">
        {t('GEN.LOGIN_REQUIRED')}
      </span>
      <span
        className="underline text-purple-700 italic mx-3 font-bold hover:cursor-pointer"
        onClick={() => navigate('/login')}
      >
        {t('LOGIN')}
      </span>
    </div>
  );
};

export default LoginRequiredSection;
