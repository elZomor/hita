import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import Section from '../../../components/shared/section/Section.tsx';
import { PublicLinksForm } from './PublicLinksForm.tsx';
import { PublicLinksCard } from './PublicLinksCard.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';

interface PublicLinksSectionProps {
  links: { linkType: string; linkInfo: string }[];
  onUpdate?: (links: { linkType: string; linkInfo: string }[]) => void;
}

export function PublicLinksSection({
  links: initialLinks,
  onUpdate,
}: PublicLinksSectionProps) {
  const { isEditMode } = useEditMode();
  const { t } = useTranslation();
  const [links, setLinks] = useState(initialLinks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const newLink = {
      linkType: '',
      linkInfo: '',
    };
    setIsAdding(true);
    setLinks([...links, newLink]);
    setEditingIndex(links.length);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (
    index: number,
    updatedLink: { linkType: string; linkInfo: string }
  ) => {
    const updatedLinks = [...links];
    updatedLinks[index] = updatedLink;
    setLinks(updatedLinks);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedLinks);
  };

  const handleDelete = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedLinks);
  };

  const handleCancel = () => {
    if (isAdding) {
      setLinks(links.slice(0, -1));
    }
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('PUBLIC_LINKS')}
      headerActions={
        <div className="flex gap-2">
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className={editingIndex === index ? 'col-span-full' : ''}
          >
            {editingIndex === index ? (
              <PublicLinksForm
                link={link}
                onSave={(updatedLink) => handleSave(index, updatedLink)}
                onCancel={handleCancel}
              />
            ) : (
              <PublicLinksCard
                link={link}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                isEditing={editingIndex !== null}
              />
            )}
          </div>
        ))}

        {links.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('NO_PUBLIC_LINKS')}</p>
            {isEditMode && (
              <button
                onClick={handleAdd}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('ADD_FIRST_LINK')}
              </button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
