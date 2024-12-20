import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroImage from '../../assets/images/heroBg.jpg';

export function Hero() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="relative h-full overflow-hidden bg-purple-900">
      {/* <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(18, 22, 23, 0.3) 13.12%, rgba(18, 22, 23, 0.9) 100%), url(${HeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="relative h-full overflow-hidden"
    > */}
      <div className="flex items-center mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="h-full px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div
              className={`text-center ${i18n.language === 'ar' ? 'md:text-right' : 'md:text-left'}`}
            >
              <h1 className="flex flex-col gap-4 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">{t('GEN.APP_NAME')}</span>
                <span className="block text-purple-300">{t('GEN.SLOGAN')}</span>
              </h1>
              <p className="mt-3 text-base text-purple-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {t('GEN.APP_DESCRIPTION')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/landing')}
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
                >
                  {t('GEN.JOIN_NOW')}
                  {i18n.language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  ) : (
                    <ArrowRight className="w-5 h-5 ml-2" />
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
