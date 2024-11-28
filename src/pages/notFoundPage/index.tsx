import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto">
          <FileQuestion className="h-8 w-8 text-purple-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for. The page might
          have been removed, renamed, or doesn't exist.
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
