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
import { get_request, post_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';

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

export function MemberRegistration() {
  const [departments, setdepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Department[]>([]);
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

  const { t } = useTranslation();
  const schema = z
    .object({
      firstName: z
        .string()
        .min(1, t('MEMBER_REGISTRATION.FIRST_NAME_REQ'))
        .regex(/^[\u0621-\u064A\s]+$/, t('MEMBER_REGISTRATION.FIRST_NAME_AR')),
      lastName: z
        .string()
        .min(1, t('MEMBER_REGISTRATION.LAST_NAME_REQ'))
        .regex(/^[\u0621-\u064A\s]+$/, t('MEMBER_REGISTRATION.LAST_NAME_AR')),
      nickName: z.string().optional(),
      gender: z.enum(['M', 'F', '']).refine((val) => val !== '', {
        message: t('MEMBER_REGISTRATION.GENDER_REQ'),
      }),
      faculty: z.string().min(1, t('MEMBER_REGISTRATION.FACULTY_REQ')),
      department: z.string().min(1, t('MEMBER_REGISTRATION.DEP_REQ')),
      isGraduated: z.boolean(),
      isPostGrad: z.boolean(),
      graduationYear: z.number().optional(),
      grade: z.number().optional(),
      studyType: z.string().min(1, t('MEMBER_REGISTRATION.STUDY_TYPE_REQ')),
    })
    .refine(
      (data) => {
        if (data.isGraduated) {
          return !!data.graduationYear;
        }
        return !!data.grade;
      },
      {
        message: t('MEMBER_REGISTRATION.GRAD_OR_GRADE_REQ'),
        path: ['graduationYear'],
      }
    );
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
      faculty: '',
      department: '',
      isGraduated: false,
      studyType: '',
      isPostGrad: false,
    },
  });

  const isGraduated = watch('isGraduated');
  const navigate = useNavigate();
  const { trackEvent } = useAmplitude();
  const faculty = watch('faculty');

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const { data } = await get_request(`hita/faculties`);
        const faculties: Department[] = data.data.map(
          (faculty: string, index: number) => ({
            id: index,
            name: faculty,
          })
        );
        setFaculties(faculties);
      } catch {
        // No Implementation
      }
    }

    fetchFaculties();
  }, []);

  useEffect(() => {
    if (faculty === '') {
      return;
    }

    async function fetchDepartments() {
      try {
        const { data } = await get_request(
          `hita/departments?faculty=${faculty}`
        );
        const departments: Department[] = data.data.map(
          (department: string, index: number) => ({
            id: index,
            name: department,
          })
        );
        setdepartments(departments);
      } catch {
        // No Implementation
      }
    }

    fetchDepartments();
  }, [faculty]);

  useEffect(() => {
    async function fetchStudyTypes() {
      try {
        const { data } = await get_request(`hita/study-types`);
        const studyTypes: StudyType[] = data.data.map(
          (studyType: string, index: number) => ({
            id: index,
            name: studyType,
          })
        );
        setStudyTypes(studyTypes);
      } catch {
        // No Implementation
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

  const onSubmit = async (formData: MemberFormData) => {
    setIsSubmitting(true);
    const invitationCode = location.search.replace('?', '');
    try {
      const { data } = await post_request(
        `hita/members`,
        mapMemberFormDataToRequest(formData, invitationCode)
      );
      const responseData = data.data;
      if (data.status === 'SUCCESS') {
        setSnackbar({
          open: true,
          message: 'Form submitted successfully!',
          type: 'success',
        });
        trackEvent('member_created');
        navigate('/landing');
      } else {
        const errorString = `Please fix The following errors:\n${objectToFormattedString(responseData.data)}`;
        setFormError(errorString);
        setSnackbar({
          open: true,
          message: 'Please fix the errors above.',
          type: 'error',
        });
      }
    } catch {
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
    navigate('/landing');
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
                <span className="text-sm font-medium text-gray-500">
                  {t('MEMBER_REGISTRATION.NICK_NAME_HINT')}
                </span>
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
                      label={t('MEMBER_REGISTRATION.FACULTY')}
                      error={errors.faculty?.message}
                      required
                    >
                      <select
                        {...register('faculty')}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500 h-12 px-4"
                      >
                        <option value="">
                          --{t('MEMBER_REGISTRATION.CHOOSE')}--
                        </option>
                        {faculties.map((fac) => (
                          <option key={fac.id} value={fac.name}>
                            {t('FACULTIES.' + fac.name)}
                          </option>
                        ))}
                      </select>
                    </SelectField>
                  </div>
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
                            {t('DEPARTMENTS.' + dept.name)}
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
                      {isGraduated && (
                        <div className="col-span-4 flex items-end mb-4">
                          <input
                            type="checkbox"
                            {...register('isPostGrad')}
                            className="mx-2 rounded border-gray-300 text-purple-600 transition-colors focus:ring-purple-500 h-5 w-5"
                          />
                          {t('MEMBER_REGISTRATION.IS_POST_GRAD')}
                        </div>
                      )}
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
                  {t('GEN.SUBMITTING')}
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
        title={t('MEMBER_REGISTRATION.RESET_TITLE')}
        message={t('MEMBER_REGISTRATION.RESET_FORM')}
        confirmText={t('MEMBER_REGISTRATION.RESET_CONFIRM')}
        cancelText={t('MEMBER_REGISTRATION.RESET_CANCEL')}
      />

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title={t('MEMBER_REGISTRATION.CANCEL_TITLE')}
        message={t('MEMBER_REGISTRATION.CANCEL_FORM')}
        confirmText={t('MEMBER_REGISTRATION.CANCEL_CONFIRM')}
        cancelText={t('MEMBER_REGISTRATION.CANCEL_CANCEL')}
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
