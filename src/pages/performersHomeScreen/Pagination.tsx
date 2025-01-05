import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { trackEvent } = useAmplitude();
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const { i18n } = useTranslation();

  type paginationType = 'forward' | 'backward' | 'number';
  const handleClick = (navigateTo: number, navigationType: paginationType) => {
    trackEvent('navigate_' + navigationType);
    onPageChange(navigateTo);
  };

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => handleClick(currentPage - 1, 'backward')}
        disabled={currentPage === 1}
        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {i18n.language === 'en' ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() =>
            typeof page === 'number' && handleClick(page, 'number')
          }
          disabled={page === '...'}
          className={clsx(
            'min-w-[32px] h-8 flex items-center justify-center text-sm rounded-full',
            {
              'bg-blue-500 text-white': currentPage === page,
              'text-gray-600 hover:bg-gray-100':
                currentPage !== page && page !== '...',
              'text-gray-400 cursor-default': page === '...',
            }
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1, 'forward')}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {i18n.language === 'en' ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </nav>
  );
}
