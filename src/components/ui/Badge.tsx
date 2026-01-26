import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-500/20 text-success-400 border-success-500/30',
  warning: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
  danger: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
  info: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  default: 'bg-dark-600 text-gray-300 border-dark-500',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
