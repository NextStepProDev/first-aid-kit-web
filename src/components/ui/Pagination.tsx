import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage < 3) {
        pages.push(0, 1, 2, '...', totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0, '...', totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1);
      }
    }

    return pages;
  };

  const buttonBase = cn(
    'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <button
        className={cn(buttonBase, 'text-gray-400 hover:bg-dark-700 hover:text-gray-200')}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="w-10 h-10 flex items-center justify-center text-gray-500">
              ...
            </span>
          ) : (
            <button
              className={cn(
                buttonBase,
                page === currentPage
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
              )}
              onClick={() => onPageChange(page as number)}
            >
              {(page as number) + 1}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className={cn(buttonBase, 'text-gray-400 hover:bg-dark-700 hover:text-gray-200')}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
