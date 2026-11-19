import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary:
      'bg-sage-600 hover:bg-sage-700 text-white shadow-warm-sm border border-sage-700/20 dark:bg-sage-600 dark:hover:bg-sage-500',
    secondary:
      'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-warm-sm border border-terracotta-700/20',
    soft: 'bg-sage-100 hover:bg-sage-200/80 text-sage-800 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 dark:text-sage-200 border border-sage-200/80 dark:border-charcoal-700',
    outline:
      'bg-white dark:bg-charcoal-800 border border-taupe-300 dark:border-charcoal-600 text-charcoal-700 dark:text-charcoal-200 hover:bg-ivory-200 dark:hover:bg-charcoal-700 hover:border-taupe-400',
    ghost:
      'bg-transparent hover:bg-taupe-100 dark:hover:bg-charcoal-700/60 text-charcoal-600 dark:text-charcoal-300',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
    icon: 'p-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
