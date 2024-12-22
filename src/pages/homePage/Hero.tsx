import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroImage1 from '../../assets/images/heroBg1.jpg';
import HeroImage2 from '../../assets/images/heroBg2.jpg';
import HeroImage3 from '../../assets/images/heroBg3.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Container from '../../components/container/Container';

export function Hero() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <Container classess="w-screen h-full mt-10">
      <div className="relative w-full max-w-full h-full overflow-hidden rounded-[20px]">
        <div className="w-[90%] md:w-auto absolute z-10 flex items-center transform -translate-x-1/2 left-1/2 top-[25%] md:-translate-x-0 md:left-auto md:ltr:left-12 md:rtl:right-12 md:top-[70px]">
          <div className="relative pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="h-full">
              <div
                className={`text-center ${i18n.language === 'ar' ? 'md:text-right' : 'md:text-left'}`}
              >
                <h1 className="flex flex-col gap-5 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">{t('GEN.APP_NAME')}</span>
                  <span className="block text-purple-300">
                    {t('GEN.SLOGAN')}
                  </span>
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

        <Swiper
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          key={i18n.language}
          pagination={true}
          // navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
          modules={[Pagination, Autoplay]}
          className="h-full "
          // spaceBetween={50}
          slidesPerView={1}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide key="slide_1">
            <div
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(18, 22, 23, 0.5) 13.12%, rgba(18, 22, 23, 0.9) 100%), url(${HeroImage1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative flex items-center justify-center h-[500px] text-3xl"
            >
              {/* <img
                className="absolute top-0 left-0 w-full h-full"
                src={HeroImage1}
                alt="hero1"
              /> */}
            </div>
          </SwiperSlide>
          <SwiperSlide key="slide_2">
            <div
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(18, 22, 23, 0.3) 13.12%, rgba(18, 22, 23, 0.9) 100%), url(${HeroImage2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative flex items-center justify-center h-[500px] text-3xl "
            >
              {/* <img
                className="absolute top-0 left-0 w-full h-full"
                src={HeroImage2}
                alt="hero1"
              /> */}
            </div>
          </SwiperSlide>
          <SwiperSlide key="slide_3">
            <div
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(18, 22, 23, 0.3) 13.12%, rgba(18, 22, 23, 0.9) 100%), url(${HeroImage3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative flex items-center justify-center h-[500px] text-3xl "
            >
              {/* <img
                className="absolute top-0 left-0 w-full h-full"
                src={HeroImage3}
                alt="hero1"
              /> */}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </Container>
  );
}
