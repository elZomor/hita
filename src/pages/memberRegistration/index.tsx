import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, BookOpenIcon, UserIcon } from 'lucide-react';
import {
  Department,
  mapMemberFormDataToRequest,
  MemberFormData,
  StudyType,
} from '../../models/Member.ts';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { RadioField } from '../../components/shared/forms/RadioField.tsx';
import { SelectField } from '../../components/shared/forms/SelectField.tsx';
import { get_request, post_request } from '../../rest_utils.ts';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';

const currentYear = new Date().getFullYear();
const yearRange = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, i) => currentYear - i
);
const gradeRange = [1, 2, 3, 4];

function objectToFormattedString(items: Record<string, any>): string {
  return Object.entries(items)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    nickName: z.string().optional(),
    gender: z.enum(['M', 'F', '']).refine((val) => val !== '', {
      message: 'Gender is required',
    }),
    department: z.string().min(1, 'Department is required'),
    isGraduated: z.boolean(),
    graduationYear: z.number().optional(),
    grade: z.number().optional(),
    studyType: z.string().min(1, 'Study type is required'),
  })
  .refine(
    (data) => {
      if (data.isGraduated) {
        return !!data.graduationYear;
      }
      return !!data.grade;
    },
    {
      message: 'Either graduation year or grade is required',
      path: ['graduationYear'],
    }
  );

export function MemberRegistration() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [studyTypes, setStudyTypes] = useState<StudyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  const { getToken } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<MemberFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nickName: '',
      gender: '',
      department: '',
      isGraduated: false,
      studyType: '',
    },
  });

  const isGraduated = watch('isGraduated');
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await get_request(
          `hita/departments`,
          await getToken({ template: 'eg-theater' })
        );
        const data = await response.json();
        console.log(data);
        const departments: Department[] = data.data.map(
          (department: string, index: number) => ({
            id: index,
            name: department,
          })
        );
        setDepartments(departments);
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      } finally {
        // setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchStudyTypes() {
      try {
        const response = await get_request(
          `hita/study-types`,
          await getToken({ template: 'eg-theater' })
        );
        const data = await response.json();
        const studyTypes: StudyType[] = data.data.map(
          (studyType: string, index: number) => ({
            id: index,
            name: studyType,
          })
        );
        setStudyTypes(studyTypes);
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      } finally {
        // setLoading(false);
      }
    }

    fetchStudyTypes();
  }, []);

  useEffect(() => {
    const subscription = watch(() => {
      if (formError) {
        setFormError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, formError]);

  const onSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);
    try {
      const response = await post_request(
        `hita/members`,
        await getToken({ template: 'eg-theater' }),
        mapMemberFormDataToRequest(data)
      );
      const responseData = await response.json();
      if (responseData.status === 'SUCCESS') {
        setSnackbar({
          open: true,
          message: 'Form submitted successfully!',
          type: 'success',
        });
        navigate('/');
      } else {
        console.error(responseData);
        const errorString = `Please fix The following errors:\n${objectToFormattedString(responseData.data)}`;
        setFormError(errorString);
        setSnackbar({
          open: true,
          message: 'Please fix the errors above.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      setFormError('errorMessage');
      setSnackbar({
        open: true,
        message: 'error',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isDirty) {
      setShowResetModal(true);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    }
  };

  const confirmReset = () => {
    reset();
    setShowResetModal(false);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-4 sm:p-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">
                  {t('MEMBER_REGISTRATION.ERROR')}
                </h4>
                <p className="text-sm text-red-700 mt-1">{formError}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('MEMBER_REGISTRATION.MEMBER_REGISTRATION')}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <UserIcon className="h-5 w-5 text-purple-600" />
                <h3>{t('MEMBER_REGISTRATION.PERSONAL_INFORMATION')}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('MEMBER_REGISTRATION.FIRST_NAME')}
                  error={errors.firstName?.message}
                  required
                >
                  <input
                    type="text"
                    {...register('firstName')}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 px-4 py-3"
                  />
                </FormField>

                <FormField
                  label={t('MEMBER_REGISTRATION.LAST_NAME')}
                  error={errors.lastName?.message}
                  required
                >
                  <input
                    type="text"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm transition-colors
                   focus:border-purple-500 focus:ring-purple-500 px-4 py-3 "
                  />
                </FormField>
              </div>

              <FormField
                label={t('MEMBER_REGISTRATION.NICK_NAME')}
                error={errors.nickName?.message}
              >
                <input
                  type="text"
                  {...register('nickName')}
                  className="mt-1 block w-full md:w-1/2 rounded-lg  border-2 border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 px-4 py-3"
                />
              </FormField>

              <RadioField
                label={t('MEMBER_REGISTRATION.GENDER')}
                error={errors.gender?.message}
                required
              >
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-6">
                      <label className="relative flex cursor-pointer items-center rounded-full p-3 hover:bg-gray-50">
                        <input
                          type="radio"
                          value="M"
                          checked={field.value === 'M'}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="form-radio text-purple-600 transition-all"
                        />
                        <span className="mx-2">
                          {t('MEMBER_REGISTRATION.MALE')}
                        </span>
                      </label>
                      <label className="relative flex cursor-pointer items-center rounded-full p-3 hover:bg-gray-50">
                        <input
                          type="radio"
                          value="F"
                          checked={field.value === 'F'}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="form-radio text-purple-600 transition-all"
                        />
                        <span className="mx-2">
                          {t('MEMBER_REGISTRATION.FEMALE')}
                        </span>
                      </label>
                    </div>
                  )}
                />
              </RadioField>
            </section>

            {/* Academic Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <BookOpenIcon className="h-5 w-5 text-purple-600" />
                <h3>{t('MEMBER_REGISTRATION.ACADEMIC_INFORMATION')}</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <SelectField
                      label={t('MEMBER_REGISTRATION.DEPARTMENT')}
                      error={errors.department?.message}
                      required
                    >
                      <select
                        {...register('department')}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 h-12 px-4"
                      >
                        <option value="">
                          --{t('MEMBER_REGISTRATION.CHOOSE')}--
                        </option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {t(dept.name)}
                          </option>
                        ))}
                      </select>
                    </SelectField>
                  </div>
                  <div className="col-span-4 flex items-end mb-4">
                    <input
                      type="checkbox"
                      {...register('isGraduated')}
                      className="mx-2 rounded border-gray-300 text-purple-600 transition-colors focus:ring-purple-500 h-5 w-5"
                    />
                    {t('MEMBER_REGISTRATION.IS_GRADUATED')}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <SelectField
                      label={
                        isGraduated
                          ? t('MEMBER_REGISTRATION.GRADUATION_YEAR')
                          : t('MEMBER_REGISTRATION.CURRENT_GRADE')
                      }
                      error={
                        isGraduated
                          ? errors.graduationYear?.message
                          : errors.grade?.message
                      }
                      required
                    >
                      <select
                        {...register(isGraduated ? 'graduationYear' : 'grade', {
                          setValueAs: (value) =>
                            value === '' ? undefined : Number(value),
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 h-12 px-4"
                      >
                        <option value="">
                          --{t('MEMBER_REGISTRATION.CHOOSE')}--
                        </option>
                        {(isGraduated ? yearRange : gradeRange).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </SelectField>
                  </div>
                </div>

                <SelectField
                  label={t('MEMBER_REGISTRATION.STUDY_TYPE')}
                  error={errors.studyType?.message}
                  required
                >
                  <select
                    {...register('studyType')}
                    className="mt-1 block w-full max-w-[66.666667%] rounded-lg border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 h-12 px-4"
                  >
                    <option value="">
                      --{t('MEMBER_REGISTRATION.CHOOSE')}--
                    </option>
                    {studyTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {t(type.name)}
                      </option>
                    ))}
                  </select>
                </SelectField>
              </div>
            </section>
          </div>

          {/* Form Actions */}
          <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('MEMBER_REGISTRATION.CANCEL')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-purple-600 hover:text-purple-500 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('MEMBER_REGISTRATION.RESET')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formError !== null}
              className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                t('MEMBER_REGISTRATION.CONFIRM')
              )}
            </button>
          </div>
        </div>
      </form>
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        title="Reset Form"
        message="Are you sure you want to reset the form? All changes will be lost."
        confirmText="Reset"
        cancelText="Cancel"
      />

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="Cancel Form"
        message="Are you sure you want to cancel? All changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="No, Continue"
      />
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
