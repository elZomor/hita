import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const schema = z.object({
  email: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof schema>;

type LoginFormDataProps = {
  setShowSignUp: (showSignUp: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setSnackbar: (snackBar: {
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }) => void;
};

const Login = ({
  setShowSignUp,
  isLoading,
  setIsLoading,
  setSnackbar,
}: LoginFormDataProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

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
              placeholder={t('LOGIN_PAGE.EMAIL_OR_USERNAME')}
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

        <div className="flex items-center justify-between">
          {/*<div className="flex items-center">*/}
          {/*  <input*/}
          {/*    id="remember-me"*/}
          {/*    name="remember-me"*/}
          {/*    type="checkbox"*/}
          {/*    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"*/}
          {/*  />*/}
          {/*  <label*/}
          {/*    htmlFor="remember-me"*/}
          {/*    className="ml-2 block text-sm text-gray-700"*/}
          {/*  >*/}
          {/*    Remember me*/}
          {/*  </label>*/}
          {/*</div>*/}

          <button
            type="button"
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            {t('LOGIN_PAGE.FORGOT_PASSWORD')}
          </button>
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
            t('LOGIN_PAGE.SIGN_IN')
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t('LOGIN_PAGE.NO_ACCOUNT')}
        <button
          className="mx-2 font-medium text-purple-600 hover:text-purple-500"
          onClick={() => {
            console.log('here');
            setShowSignUp(true);
          }}
        >
          {t('LOGIN_PAGE.SIGN_UP')}
        </button>
      </p>
    </div>
  );
};

export default Login;
