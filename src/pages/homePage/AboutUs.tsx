import React from 'react';
import Container from '../../components/container/Container';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="w-full p-3 bg-[#f5f5f5]">
      <Container>
        <h1 className="text-3xl font-bold mb-7 text-slate-800">
          {t('ABOUTUS.ABOUTUS')}
        </h1>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex items-center justify-center p-5 text-center bg-white shadow-md rounded-xl text-slate-600">
            We are a passionate team of creators, dreamers, and innovators from
            diverse backgrounds united by a shared love for theater. Our mission
            is to shine a spotlight on the incredible talents that bring stories
            to life on stage.
          </div>
          <div className="flex items-center justify-center p-5 text-center bg-white shadow-md rounded-xl text-slate-600">
            From seasoned developers to theater enthusiasts and storytellers,
            our team came together with one goal: to bridge the gap between
            exceptional talents and those seeking to create unforgettable
            productions. We believe in the power of collaboration and the magic
            that happens when creative minds unite.
          </div>
          <div className="flex items-center justify-center p-5 text-center bg-white shadow-md rounded-xl text-slate-600">
            With this platform, we aim to celebrate the artistry, dedication,
            and hard work of everyone behind the curtain—bringing them closer to
            the opportunities they deserve. Welcome to a community where talent
            meets possibility!
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
