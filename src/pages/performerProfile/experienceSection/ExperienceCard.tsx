import { useTranslation } from 'react-i18next';
import { Experience } from '../../../models/Performer.ts';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  isEditing,
}: ExperienceCardProps) {
  const { t } = useTranslation();
  console.log('experience');
  console.log(experience);

  return (
    <div className="bg-gray-50 rounded-lg p-6 relative group">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {`${experience.showName} (${t('PERFORMER_REG.EXPERIENCE_SECTION.' + experience.showType)} - ${experience.year})`}
          </h3>
          <div className="space-y-2text-gray-600">
            <h2>
              {t('DIRECTOR')}: {experience.director}
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {experience.roles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {t(role)}
                </span>
              ))}
            </div>
            {experience.showType === 'THEATER' && (
              <div className="mt-2">
                <p>
                  {`${experience.venue} - ${experience.duration} ${t('NIGHTS')}`}
                </p>
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
