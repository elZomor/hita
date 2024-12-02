import { clsx } from 'clsx';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaFemale, FaMale } from 'react-icons/fa';
import { useState } from 'react';
import { PerformerDetailsForm } from './PerformerDetailsForm';
import { Performer } from '../../../models/Performer.ts';
import Section from '../../../components/shared/section/Section.tsx';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { ImageModal } from '../../../components/shared/imageModal';

type PerformerDetailsSectionProps = {
  performer: Performer;
  onUpdate?: (performer: Performer) => void;
};

export default function PerformerDetailsSection({
  performer: initialPerformer,
  onUpdate,
}: PerformerDetailsSectionProps) {
  const { t } = useTranslation();
  const [performer, setPerformer] = useState(initialPerformer);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'm':
        return <FaMale className="text-blue-500 h-5 w-5" />;
      case 'f':
        return <FaFemale className="text-pink-500 h-5 w-5" />;
      default:
        return null;
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedPerformer: Performer) => {
    setPerformer(updatedPerformer);
    setIsEditing(false);
    onUpdate?.(updatedPerformer);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!performer.profilePicture) {
    return null;
  }

  return (
    <Section
      headerActions={
        <EditButton
          onClick={handleEdit}
          className={isEditing ? 'invisible' : ''}
        />
      }
    >
      {isEditing ? (
        <PerformerDetailsForm
          performer={performer}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Profile Image */}
          <div
            className="relative cursor-pointer group flex-shrink-0 w-40 h-40 md:w-48 md:h-48"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={performer.profilePicture}
              alt={performer.name}
              className="w-full h-full rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('VIEW_IMAGE')}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              {getGenderIcon(performer.gender)}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                {performer.name}
              </h1>
              <div
                className={clsx(
                  'w-3 h-3 rounded-full flex-shrink-0',
                  performer.status.toLowerCase().includes('not_available')
                    ? 'bg-red-500'
                    : 'bg-green-500'
                )}
                title={
                  performer.status.toLowerCase().includes('not_available')
                    ? t('NOT_AVAILABLE')
                    : t('AVAILABLE')
                }
              />
            </div>

            <div className="mt-4 space-y-2 text-gray-600">
              {performer.age && (
                <p className="text-sm md:text-base">
                  {performer.age} {t('YEARS_OLD')}
                  {performer.height && ` • ${performer.height} ${t('CM')}`}
                </p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">
                  {t(performer.department)} -{' '}
                  {getGradeOrGraduationYear(performer)}
                </span>
              </div>
            </div>

            {performer.skills && performer.skills?.length > 0 && (
              <div className="mt-4 md:mt-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {performer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {t(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {performer.biography && (
              <div className="mt-4 md:mt-6">
                <div className="rounded-lg p-4">
                  <p className="text-sm md:text-base text-gray-600 whitespace-pre-wrap break-all">
                    {performer.biography}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ImageModal
        isOpen={showImageModal}
        imageUrl={performer.profilePicture}
        altText={performer.name}
        onClose={() => setShowImageModal(false)}
      />
    </Section>
  );
}
