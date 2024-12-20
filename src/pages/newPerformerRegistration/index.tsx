import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewPerformerFormData,
  newPerformerFormSchema,
} from '../../types/performer-form';
import { Modal } from '../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { DropDownOptions } from '../../models/shared.ts';
import { get_request, post_request } from '../../utils/restUtils.ts';
import { mapPerformerRegisterToRequest } from '../../models/Performer.ts';
import { useNavigate } from 'react-router-dom';
import { NewPersonalInfoStep } from './NewPersonalInfoStep.tsx';

export function NewPerformerForm() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [skillsOptions, setSkillsOptions] = useState<DropDownOptions[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/skills');
      setSkillsOptions(
        data.data.map(
          (skill: string): DropDownOptions => ({
            value: skill,
            label: skill,
          })
        )
      );
    };
    fetchData();
  }, []);

  const methods = useForm<NewPerformerFormData>({
    resolver: zodResolver(newPerformerFormSchema),
    defaultValues: {
      personalInfo: {
        status: 'AVAILABLE',
        openFor: 'FREE',
      },
    },
    mode: 'onChange',
  });

  const handleSubmit = async (formData: NewPerformerFormData) => {
    try {
      const requestData = mapPerformerRegisterToRequest(formData);
      const { data } = await post_request('hita/performers', requestData);
      setSnackbar({
        open: true,
        message: 'Form submitted successfully!',
        type: 'success',
      });
      navigate(`/performers/${data.data.username}`);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to submit form. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex flex-col lg:flex-row">
              {showMobileNav && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                  onClick={() => setShowMobileNav(false)}
                />
              )}

              <div className="flex-1 p-4 lg:p-8">
                <NewPersonalInfoStep
                  onComplete={handleSubmit}
                  skillsOptions={skillsOptions}
                />
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          onConfirm={() => {
            setShowExitModal(false);
            // Handle exit logic
          }}
          title="Exit Form"
          message="Are you sure you want to exit? All progress will be lost."
          confirmText="Exit"
          cancelText="Stay"
        />

        <Snackbar
          isOpen={snackbar.open}
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      </div>
    </FormProvider>
  );
}
