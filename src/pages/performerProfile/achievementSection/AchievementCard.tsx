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
  return (
    <div className="bg-gray-50 rounded-lg p-6 relative group">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {achievement.rank} - {achievement.field} ({achievement.festivalName}
            : {achievement.year} )
          </h2>
          <div className="space-y-2 text-gray-600">
            <h3>{achievement.showName}</h3>
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
