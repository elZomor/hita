import Section from '../shared/section/Section.tsx';
import { Experience } from '../../models/Performer.ts';
import { useTranslation } from 'react-i18next';

type ExperienceProps = {
  experienceList: Experience[];
};
const ExperienceSection = ({ experienceList }: ExperienceProps) => {
  const { t } = useTranslation();
  console.log(experienceList);
  return (
    <Section title={t('EXPERIENCE')}>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          {experienceList.map((experience, index) => (
            <div key={index} className={`${index !== 0 ? 'mt-10' : ''}`}>
              <h3 className="font-semibold text-gray-900">
                {experience.showName} ({experience.venue} -{' '}
                {experience.duration} {t('NIGHTS')})
              </h3>
              <p className="text-gray-600">
                {t('DIRECTED_BY')}: {experience.director}
              </p>
              <div className="mt-1 text-gray-600">
                <p>{experience.role.map((role) => t(role)).join(' - ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ExperienceSection;
