import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactDetailsCard } from './ContactDetailsCard';
import { ContactDetailsForm } from './ContactDetailsForm';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';

interface ContactDetailsSectionProps {
  contacts: { contactType: string; contactInfo: string }[];
  onUpdate?: (contacts: { contactType: string; contactInfo: string }[]) => void;
}

export default function ContactDetailsSection({
  contacts: initialContacts,
  onUpdate,
}: ContactDetailsSectionProps) {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState(initialContacts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const newContact = {
      contactType: '',
      contactInfo: '',
    };
    setIsAdding(true);
    setContacts([...contacts, newContact]);
    setEditingIndex(contacts.length);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (
    index: number,
    updatedContact: { contactType: string; contactInfo: string }
  ) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = updatedContact;
    setContacts(updatedContacts);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedContacts);
  };

  const handleDelete = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    setEditingIndex(null);
    setIsAdding(false);
    onUpdate?.(updatedContacts);
  };

  const handleCancel = () => {
    if (isAdding) {
      setContacts(contacts.slice(0, -1));
    }
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('CONTACT_DETAILS')}
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
        {contacts.map((contact, index) => (
          <div
            key={index}
            className={editingIndex === index ? 'col-span-full' : ''}
          >
            {editingIndex === index ? (
              <ContactDetailsForm
                contact={contact}
                onSave={(updatedContact) => handleSave(index, updatedContact)}
                onCancel={handleCancel}
              />
            ) : (
              <ContactDetailsCard
                contact={contact}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                isEditing={editingIndex !== null}
              />
            )}
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('NO_CONTACTS')}</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              {t('ADD_FIRST_CONTACT')}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
