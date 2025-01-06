import Container from '../../components/container/Container';
import { useTranslation } from 'react-i18next';
import TeamCard from './TeamCard.tsx';
import Zomor from '../../assets/images/zomor.jpeg';
import Hossam from '../../assets/images/Hossam.jpg';
import Dua from '../../assets/images/Dua.jpeg';
import Sara from '../../assets/images/Sara.jpeg';

const AboutUs = () => {
  const { t } = useTranslation();
  const teamMembers = [
    {
      name: t('ABOUT_US.ZOMOR.NAME'),
      title: t('ABOUT_US.ZOMOR.TITLE'),
      bio: t('ABOUT_US.ZOMOR.BIO'),
      imageUrl: Zomor,
    },
    {
      name: t('ABOUT_US.SARA.NAME'),
      title: t('ABOUT_US.SARA.TITLE'),
      bio: t('ABOUT_US.SARA.BIO'),
      imageUrl: Sara,
    },
    {
      name: t('ABOUT_US.DUA.NAME'),
      title: t('ABOUT_US.DUA.TITLE'),
      bio: t('ABOUT_US.DUA.BIO'),
      imageUrl: Dua,
    },
    {
      name: t('ABOUT_US.HOSSAM.NAME'),
      title: t('ABOUT_US.HOSSAM.TITLE'),
      bio: t('ABOUT_US.HOSSAM.BIO'),
      imageUrl: Hossam,
    },
  ];

  return (
    <div className="w-full p-3">
      <Container classess="w-full">
        <h1 className="text-3xl font-bold border-slate-800 rtl:border-r-8 rtl:pr-5 ltr:border-l-8 ltr:pl-5 mb-7 text-slate-800">
          {t('ABOUT_US.ABOUT_US')}
        </h1>

        <div className="w-full text-lg leading-7 bg-purple-100 p-7 rounded-xl text-slate-600">
          <div>{t('ABOUT_US.DESCRIPTION_ONE')}</div>
          <div>{t('ABOUT_US.DESCRIPTION_TWO')}</div>
          <div>{t('ABOUT_US.DESCRIPTION_THREE')}</div>
        </div>

        <h1 className="mt-10 text-3xl font-bold mb-7 text-slate-800 border-slate-800 rtl:border-r-8 rtl:pr-5 ltr:border-l-8 ltr:pl-5">
          {t('ABOUT_US.ABOUT_TEAM')}
        </h1>
        <div className="grid w-full grid-cols-1 gap-5 p-5 mx-auto bg-purple-100 shadow-md md:grid-cols-4 rounded-xl text-slate-600">
          {teamMembers.map((member) => (
            <TeamCard
              key={member.name}
              name={member.name}
              title={member.title}
              bio={member.bio}
              imageUrl={member.imageUrl}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
