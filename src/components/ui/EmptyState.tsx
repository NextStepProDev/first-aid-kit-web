import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="text-gray-500 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
