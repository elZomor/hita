import { useNavigate } from 'react-router-dom';
import { Home, ShieldAlert } from 'lucide-react';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="bg-red-100 rounded-full p-3 w-fit mx-auto">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">Access Denied</h1>

        <p className="mt-4 text-gray-600">
          Sorry, you don't have permission to access this page. Please make sure
          you're logged in with the correct account.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 w-full rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
        >
          <Home className="h-5 w-5" />
          Return Home
        </button>
      </div>
    </div>
  );
}
