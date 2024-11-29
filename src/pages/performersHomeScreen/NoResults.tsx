import { SearchX } from 'lucide-react';

export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <SearchX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No performers found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Try adjusting your search or filter criteria to find more performers.
      </p>
    </div>
  );
}
