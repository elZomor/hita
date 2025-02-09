import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginRequiredSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center border rounded-2xl shadow-md p-4 bg-gray-100 w-full">
      <span className="text-sm md:text-lg font-semibold text-purple-700">
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
