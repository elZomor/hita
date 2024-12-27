import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AgreementModal from './AgreementModal.tsx';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type SignupFormDataProps = {
  setShowSignUp: (showSignUp: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setSnackbar: (snackBar: {
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }) => void;
  tacText: string;
  ppText: string;
};

const schema = z
  .object({
    email: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreeTAC: z.boolean(),
    agreePP: z.boolean(),
  })
  .refine(
    (data) => {
      return data.confirmPassword && data.confirmPassword === data.password;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type LoginFormData = z.infer<typeof schema>;

const Signup = ({
  setShowSignUp,
  isLoading,
  setIsLoading,
  setSnackbar,
  tacText,
  ppText,
}: SignupFormDataProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState('');
  const [ModalTextTitle, setModalTextTitle] = useState<'' | 'TAC' | 'PP'>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });
  const handleConfirmModal = (documentType: 'TAC' | 'PP' | '') => {
    if (documentType === 'TAC') {
      setValue('agreeTAC', true);
    } else if (documentType === 'PP') {
      setValue('agreePP', true);
    }
    setIsModalOpen(false);
  };
  const handleOpenModal = (docType: 'TAC' | 'PP') => {
    setModalTextTitle(docType);
    setModalContent(docType === 'TAC' ? tacText : ppText);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalTextTitle('');
    setIsModalOpen(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log(data);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSnackbar({
        open: true,
        message: 'Successfully logged in!',
        type: 'success',
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Failed to login. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder={t('LOGIN_PAGE.EMAIL')}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('LOGIN_PAGE.PASSWORD')}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('agreeTAC')}
                  className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="mx-2 text-gray-700">
                  {t('LOGIN_PAGE.AGREE_TAC')}
                </span>
              </label>
              <span
                className="text-purple-700 hover:cursor-pointer hover:underline"
                onClick={() => handleOpenModal('TAC')}
              >
                {t('LOGIN_PAGE.CLICK_HERE')}
              </span>
            </div>
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('agreePP')}
                  className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="mx-2 text-gray-700">
                  {t('LOGIN_PAGE.AGREE_PP')}.
                </span>
              </label>
              <span
                className="text-purple-700 hover:cursor-pointer hover:underline"
                onClick={() => handleOpenModal('PP')}
              >
                {t('LOGIN_PAGE.CLICK_HERE')}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            t('LOGIN_PAGE.SIGN_UP')
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t('LOGIN_PAGE.HAVE_ACCOUNT')}
        <button
          className="mx-2 font-medium text-purple-600 hover:text-purple-500"
          onClick={() => {
            console.log('clicked');
            setShowSignUp(false);
          }}
        >
          {t('LOGIN_PAGE.SIGN_IN')}
        </button>
      </p>

      <AgreementModal
        isOpen={isModalOpen}
        textTitle={ModalTextTitle}
        textContent={modalContent}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default Signup;
