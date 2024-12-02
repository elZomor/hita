import { useTranslation } from 'react-i18next';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';

interface AchievementCardProps {
  achievement: {
    rank: string;
    field: string;
    showName: string;
    festivalName: string;
    year: number;
  };
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export function AchievementCard({
  achievement,
  onEdit,
  onDelete,
  isEditing,
}: AchievementCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-lg p-6 relative group">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {achievement.rank} - {achievement.field}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              {t('SHOW_NAME')}: {achievement.showName}
            </p>
            <p>
              {t('FESTIVAL_NAME')}: {achievement.festivalName}
            </p>
            <p>
              {t('YEAR')}: {achievement.year}
            </p>
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
