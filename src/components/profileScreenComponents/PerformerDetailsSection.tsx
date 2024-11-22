import { clsx } from 'clsx';
import { GraduationCap } from 'lucide-react';
import { Performer } from '../../models/Performer.ts';
import { useTranslation } from 'react-i18next';
import { FaFemale, FaMale } from 'react-icons/fa';

type PerformerDetailsSectionProps = {
  performer: Performer;
};

const PerformerDetailsSection = ({
  performer,
}: PerformerDetailsSectionProps) => {
  const { t } = useTranslation();
  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'm':
        return <FaMale className="text-blue-500" />;
      case 'f':
        return <FaFemale className="text-pink-500" />;
    }
  };

  const getGradeOrGraduationYear = ({
    grade,
    graduationYear,
    studyType,
  }: Performer) => {
    const gradeYear = graduationYear
      ? `${t('GRADUATED_IN')}: ${graduationYear}`
      : t(`GRADE_${grade}`);
    return `${gradeYear} (${t(studyType)})`;
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-start gap-6">
        <img
          src={performer.profilePicture}
          alt={performer.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getGenderIcon(performer.gender)}
              <h1 className="text-2xl font-bold text-gray-900">
                {performer.name}
              </h1>
              <div
                className={clsx(
                  'w-3 h-3 rounded-full',
                  performer.status.toLowerCase().includes('not_available')
                    ? 'bg-red-500'
                    : 'bg-green-500'
                )}
              />
            </div>
          </div>
          <div>
            {performer.age && (
              <h3 className="text-gray-600">
                {performer.age} {t('YEARS_OLD')}
              </h3>
            )}
          </div>
          <div>
            {performer.height && (
              <h3 className="text-gray-600">
                {performer.height} {t('CM')}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <GraduationCap className="flex-shrink-0 w-4 h-4" />
            <span>
              {t(performer.department)} - {getGradeOrGraduationYear(performer)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {performer.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {t(skill)}
              </span>
            ))}
          </div>
          <p className="mt-4 text-gray-600">{performer.biography}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformerDetailsSection;
