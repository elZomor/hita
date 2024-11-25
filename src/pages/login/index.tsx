import { useState } from 'react';
// import { useForm } from 'react-hook-form';
import { useGoogleLogin } from '@react-oauth/google';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { useNavigate } from 'react-router-dom';
import { get_request_with_token } from '../../rest_utils.ts';
import { useTranslation } from 'react-i18next';

// const schema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
// });

// type LoginFormData = z.infer<typeof schema>;

export function LoginPage() {
  // const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginFormData>({
  //   resolver: zodResolver(schema),
  // });
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await get_request_with_token(
          'auth/google/login/callback',
          response.access_token
        );
        const data = await res.json();
        const tokens: Record<string, string> = data?.data;
        localStorage.setItem('accessToken', tokens['ACCESS_TOKEN']);
        localStorage.setItem('refreshToken', tokens['REFRESH_TOKEN']);
        navigate('/');
        setSnackbar({
          open: true,
          message: 'Successfully logged in with Google!',
          type: 'success',
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          open: true,
          message: 'Failed to login with Google. Please try again.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to login with Google. Please try again.',
        type: 'error',
      });
      setIsLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleLogin();
  };

  // const onSubmit = async (data: LoginFormData) => {
  //   setIsLoading(true);
  //   console.log(data);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     setSnackbar({
  //       open: true,
  //       message: 'Successfully logged in!',
  //       type: 'success',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to login. Please try again.',
  //       type: 'error',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('LOGIN_PAGE.WELCOME_BACK')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('LOGIN_PAGE.PLEASE_SIGN_IN')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('LOGIN_PAGE.CONTINUE_WITH_GOOGLE')}
            </button>

            {/*<div className="mt-6">*/}
            {/*  <div className="relative">*/}
            {/*    <div className="absolute inset-0 flex items-center">*/}
            {/*      <div className="w-full border-t border-gray-300" />*/}
            {/*    </div>*/}
            {/*    <div className="relative flex justify-center text-sm">*/}
            {/*      <span className="px-2 bg-white text-gray-500">*/}
            {/*        Or continue with*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>*/}
            {/*  <div>*/}
            {/*    <div className="relative">*/}
            {/*      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
            {/*        <Mail className="h-5 w-5 text-gray-400" />*/}
            {/*      </div>*/}
            {/*      <input*/}
            {/*        {...register('email')}*/}
            {/*        type="email"*/}
            {/*        placeholder="Email address"*/}
            {/*        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*    {errors.email && (*/}
            {/*      <p className="mt-1.5 text-sm text-red-600">*/}
            {/*        {errors.email.message}*/}
            {/*      </p>*/}
            {/*    )}*/}
            {/*  </div>*/}

            {/*  <div>*/}
            {/*    <div className="relative">*/}
            {/*      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
            {/*        <Lock className="h-5 w-5 text-gray-400" />*/}
            {/*      </div>*/}
            {/*      <input*/}
            {/*        {...register('password')}*/}
            {/*        type={showPassword ? 'text' : 'password'}*/}
            {/*        placeholder="Password"*/}
            {/*        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"*/}
            {/*      />*/}
            {/*      <button*/}
            {/*        type="button"*/}
            {/*        onClick={() => setShowPassword(!showPassword)}*/}
            {/*        className="absolute inset-y-0 right-0 pr-3 flex items-center"*/}
            {/*      >*/}
            {/*        {showPassword ? (*/}
            {/*          <EyeOff className="h-5 w-5 text-gray-400" />*/}
            {/*        ) : (*/}
            {/*          <Eye className="h-5 w-5 text-gray-400" />*/}
            {/*        )}*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*    {errors.password && (*/}
            {/*      <p className="mt-1.5 text-sm text-red-600">*/}
            {/*        {errors.password.message}*/}
            {/*      </p>*/}
            {/*    )}*/}
            {/*  </div>*/}

            {/*  <div className="flex items-center justify-between">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <input*/}
            {/*        id="remember-me"*/}
            {/*        name="remember-me"*/}
            {/*        type="checkbox"*/}
            {/*        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"*/}
            {/*      />*/}
            {/*      <label*/}
            {/*        htmlFor="remember-me"*/}
            {/*        className="ml-2 block text-sm text-gray-700"*/}
            {/*      >*/}
            {/*        Remember me*/}
            {/*      </label>*/}
            {/*    </div>*/}

            {/*    <button*/}
            {/*      type="button"*/}
            {/*      className="text-sm font-medium text-purple-600 hover:text-purple-500"*/}
            {/*    >*/}
            {/*      Forgot password?*/}
            {/*    </button>*/}
            {/*  </div>*/}

            {/*  <button*/}
            {/*    type="submit"*/}
            {/*    disabled={isLoading}*/}
            {/*    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"*/}
            {/*  >*/}
            {/*    {isLoading ? (*/}
            {/*      <svg*/}
            {/*        className="animate-spin h-5 w-5 text-white"*/}
            {/*        xmlns="http://www.w3.org/2000/svg"*/}
            {/*        fill="none"*/}
            {/*        viewBox="0 0 24 24"*/}
            {/*      >*/}
            {/*        <circle*/}
            {/*          className="opacity-25"*/}
            {/*          cx="12"*/}
            {/*          cy="12"*/}
            {/*          r="10"*/}
            {/*          stroke="currentColor"*/}
            {/*          strokeWidth="4"*/}
            {/*        />*/}
            {/*        <path*/}
            {/*          className="opacity-75"*/}
            {/*          fill="currentColor"*/}
            {/*          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"*/}
            {/*        />*/}
            {/*      </svg>*/}
            {/*    ) : (*/}
            {/*      'Sign in'*/}
            {/*    )}*/}
            {/*  </button>*/}
            {/*</form>*/}

            {/*<p className="mt-6 text-center text-sm text-gray-600">*/}
            {/*  Don't have an account?{' '}*/}
            {/*  <button className="font-medium text-purple-600 hover:text-purple-500">*/}
            {/*    Sign up*/}
            {/*  </button>*/}
            {/*</p>*/}
          </div>
        </div>
      </div>

      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
