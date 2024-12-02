import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AchievementCard } from './AchievementCard';
import { AchievementForm } from './AchievementForm';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';

interface AchievementSectionProps {
  achievements: {
    rank: string;
    field: string;
    showName: string;
    festivalName: string;
    year: number;
  }[];
  onUpdate?: (
    achievements: {
      rank: string;
      field: string;
      showName: string;
      festivalName: string;
      year: number;
    }[]
  ) => void;
}

export default function AchievementSection({
  achievements: initialAchievements,
  onUpdate,
}: AchievementSectionProps) {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState(initialAchievements);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const newAchievement = {
      rank: '',
      field: '',
      showName: '',
      festivalName: '',
      year: new Date().getFullYear(),
    };
    setIsAdding(true);
    setAchievements([...achievements, newAchievement]);
    setEditingIndex(achievements.length);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (
    index: number,
    updatedAchievement: {
      rank: string;
      field: string;
      showName: string;
      festivalName: string;
      year: number;
    }
  ) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = updatedAchievement;
    setAchievements(updatedAchievements);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedAchievements);
  };

  const handleDelete = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedAchievements);
  };

  const handleCancel = () => {
    if (isAdding) {
      setAchievements(achievements.slice(0, -1));
    }
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('ACHIEVEMENTS')}
      headerActions={
        <div className="flex gap-2">
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      <div className="space-y-6">
        {achievements.map((achievement, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <AchievementForm
                achievement={achievement}
                onSave={(updatedAchievement) =>
                  handleSave(index, updatedAchievement)
                }
                onCancel={handleCancel}
              />
            ) : (
              <AchievementCard
                achievement={achievement}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                isEditing={editingIndex !== null}
              />
            )}
          </div>
        ))}

        {achievements.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('NO_ACHIEVEMENTS')}</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              {t('ADD_FIRST_ACHIEVEMENT')}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
