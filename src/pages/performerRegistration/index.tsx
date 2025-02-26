import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StepIndicator } from './StepIndicator';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ExperiencesStep } from './ExperiencesStep';
import { AchievementsStep } from './AchievementsStep';
import { ContactDetailsStep } from './ContactDetailsStep';
import { ProfileImagesStep } from './ProfileImagesStep';
import { PublicLinksStep } from './PublicLinksStep';
import {
  FormStep,
  PerformerFormData,
  performerFormSchema,
  STEPS,
} from '../../types/performer-form';
import { Modal } from '../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { DropDownOptions } from '../../models/shared.ts';
import {
  get_request,
  post_files,
  post_request,
} from '../../utils/restUtils.ts';
import { mapPerformerRegisterToRequest } from '../../models/Performer.ts';
import { useNavigate } from 'react-router-dom';

export function PerformerForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal-info');
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
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
  const [contactTypes, setContactTypes] = useState<DropDownOptions[]>([]);
  const [publicLinkTypes, setPublicLinkTypes] = useState<DropDownOptions[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/contact-types');
      setContactTypes(
        data.data.map(
          (contactType: string): DropDownOptions => ({
            value: contactType,
            label: contactType,
          })
        )
      );
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/public-channels/types');
      setPublicLinkTypes(
        data.data.map(
          (publicLinkType: string): DropDownOptions => ({
            value: publicLinkType,
            label: publicLinkType,
          })
        )
      );
    };
    fetchData();
  }, []);

  const methods = useForm<PerformerFormData>({
    resolver: zodResolver(performerFormSchema),
    defaultValues: {
      personalInfo: {
        status: 'AVAILABLE',
        openFor: 'FREE',
      },
      experiences: [],
      achievements: [],
      contactSection: {
        details: [],
        keepProtected: false,
      },
      gallerySection: {
        images: [],
        keepProtected: false,
      },
      publicLinks: [],
    },
    mode: 'onChange',
  });

  const { trigger } = methods;
  const validateStep = async (step: FormStep): Promise<boolean> => {
    switch (step) {
      case 'personal-info':
        return await trigger('personalInfo');
      case 'experiences':
        return await trigger('experiences');
      case 'achievements':
        return await trigger('achievements');
      case 'contact-details':
        return await trigger('contactSection');
      case 'profile-images':
        return await trigger('gallerySection');
      case 'public-links':
        return await trigger('publicLinks');
      default:
        return true;
    }
  };

  const handleStepComplete = async (step: FormStep) => {
    const isValid = await validateStep(step);

    if (!isValid) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors before proceeding',
        type: 'error',
      });
      return;
    }

    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }

    const currentIndex = STEPS.findIndex((s) => s.id === step);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
      setShowMobileNav(false);
    }
  };

  const handleStepClick = async (step: FormStep) => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    const targetIndex = STEPS.findIndex((s) => s.id === step);

    // Allow going back without validation
    if (targetIndex < currentIndex) {
      setCurrentStep(step);
      setShowMobileNav(false);
      return;
    }

    // For forward navigation, validate all steps in between
    for (let i = currentIndex; i < targetIndex; i++) {
      const isValid = await validateStep(STEPS[i].id);
      if (!isValid) {
        setSnackbar({
          open: true,
          message: `Please complete ${STEPS[i].label} before proceeding`,
          type: 'error',
        });
        return;
      }
    }

    setCurrentStep(step);
    setShowMobileNav(false);
  };

  const handlePreviousStep = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const handleNextStep = async () => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    const isValid = await validateStep(currentStep);

    if (!isValid) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors before proceeding',
        type: 'error',
      });
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const handleSubmit = async (formData: PerformerFormData) => {
    try {
      const requestData = mapPerformerRegisterToRequest(formData);
      const response = await post_request('hita/performers', requestData);
      if (response.status === 201) {
        const { data } = await post_files(
          'hita/performers/gallery',
          formData.gallerySection.images
        );
        setSnackbar({
          open: true,
          message: 'Form submitted successfully!',
          type: 'success',
        });
        navigate(`/artists/${data.data.user}`);
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to submit form. Please try again.',
        type: 'error',
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return (
          <PersonalInfoStep
            onComplete={() => handleStepComplete('personal-info')}
            skillsOptions={skillsOptions}
          />
        );
      case 'experiences':
        return (
          <ExperiencesStep
            onComplete={() => handleStepComplete('experiences')}
            skillsOptions={skillsOptions}
          />
        );
      case 'achievements':
        return (
          <AchievementsStep
            onComplete={() => handleStepComplete('achievements')}
          />
        );
      case 'contact-details':
        return (
          <ContactDetailsStep
            onComplete={() => handleStepComplete('contact-details')}
            contactTypes={contactTypes}
          />
        );
      case 'profile-images':
        return (
          <ProfileImagesStep
            onComplete={() => handleStepComplete('profile-images')}
          />
        );
      case 'public-links':
        return (
          <PublicLinksStep
            publicLinkTypes={publicLinkTypes}
            onComplete={handleSubmit}
            isLastStep
          />
        );
      default:
        return null;
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="lg:hidden p-4 border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
                <span className="font-medium">
                  {STEPS.find((s) => s.id === currentStep)?.label}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousStep}
                  disabled={isFirstStep}
                  className={`p-2 rounded-lg ${
                    isFirstStep
                      ? 'text-gray-300'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={isLastStep}
                  className={`p-2 rounded-lg ${
                    isLastStep
                      ? 'text-gray-300'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              <div
                className={`
                lg:block
                ${showMobileNav ? 'block' : 'hidden'}
                lg:relative fixed inset-0 z-40 bg-white lg:bg-transparent
                lg:w-64 w-full
                overflow-y-auto
              `}
              >
                <StepIndicator
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              </div>

              {showMobileNav && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                  onClick={() => setShowMobileNav(false)}
                />
              )}

              <div className="flex-1 p-4 lg:p-8">{renderStep()}</div>
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
