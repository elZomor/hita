import Section from '../../../components/shared/section/Section.tsx';
import { Experience } from '../../../models/Performer.ts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { ExperienceCard } from './ExperienceCard.tsx';
import { ExperienceForm } from './ExperienceForm.tsx';

interface ExperienceSectionProps {
  experiences: Experience[];
  onUpdate?: (experiences: Experience[]) => void;
}

export default function ExperienceSection({
  experiences: initialExperiences,
  onUpdate,
}: ExperienceSectionProps) {
  const { t } = useTranslation();
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperiences);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const newExperience: Experience = {
      showName: '',
      showType: 'THEATER',
      director: '',
      year: new Date().getFullYear(),
      roles: [],
      venue: '',
      duration: undefined,
    };
    setIsAdding(true);
    setExperiences([...experiences, newExperience]);
    setEditingIndex(experiences.length);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedExperience: Experience) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = updatedExperience;
    setExperiences(updatedExperiences);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedExperiences);
  };

  const handleDelete = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedExperiences);
  };

  const handleCancel = () => {
    if (isAdding) {
      setExperiences(experiences.slice(0, -1));
    }
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('EXPERIENCES')}
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
        {experiences.map((experience, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <ExperienceForm
                experience={experience}
                onSave={(updatedExperience) =>
                  handleSave(index, updatedExperience)
                }
                onCancel={handleCancel}
              />
            ) : (
              <ExperienceCard
                experience={experience}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                isEditing={editingIndex !== null}
              />
            )}
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('NO_EXPERIENCES')}</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              {t('ADD_FIRST_EXPERIENCE')}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
