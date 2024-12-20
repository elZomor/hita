import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="relative bg-purple-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div
              className={`text-center ${i18n.language === 'ar' ? 'md:text-right' : 'md:text-left'}`}
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">{t('GEN.APP_NAME')}</span>
                <span className="block text-purple-300">{t('GEN.SLOGAN')}</span>
              </h1>
              <p className="mt-3 text-base text-purple-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {t('GEN.APP_DESCRIPTION')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/landing')}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
                >
                  {t('GEN.JOIN_NOW')}
                  {i18n.language === 'ar' ? (
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
