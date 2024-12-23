import Container from '../../components/container/Container';
import { useTranslation } from 'react-i18next';
import TeamCard from './TeamCard.tsx';
import Zomor from '../../assets/images/zomor.jpeg';
import Hossam from '../../assets/images/Hossam.jpg';
import Dua from '../../assets/images/Dua.jpeg';

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
    <div className="w-full p-3 bg-[#f5f5f5]">
      <Container>
        <h1 className="text-3xl font-bold mb-7 text-slate-800">
          {t('ABOUT_US.ABOUT_US')}
        </h1>

        <div className="p-5 bg-purple-100 w-full mx-auto shadow-md rounded-xl text-slate-600">
          <div>{t('ABOUT_US.DESCRIPTION_ONE')}</div>
          <div>{t('ABOUT_US.DESCRIPTION_TWO')}</div>
          <div>{t('ABOUT_US.DESCRIPTION_THREE')}</div>
        </div>

        <h1 className="mt-10 text-3xl font-bold mb-7 text-slate-800">
          {t('ABOUT_US.ABOUT_TEAM')}
        </h1>
        <div className="p-5  gap-5 grid grid-cols-1 md:grid-cols-3 bg-purple-100 w-full mx-auto shadow-md rounded-xl text-slate-600">
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
