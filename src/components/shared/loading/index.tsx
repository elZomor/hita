import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingComponent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
        <p className="mt-2 text-sm text-gray-600">{t('GEN.LOADING')}</p>
      </div>
    </div>
  );
};

export default LoadingComponent;
