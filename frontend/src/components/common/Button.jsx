import React from 'react';

/**
 * Button Component
 * 
 * Example usage:
 * <Button variant="primary" onClick={() => alert('Clicked')}>Submit</Button>
 * <Button variant="secondary" outline>Cancel</Button>
 * <Button isLoading={true}>Loading</Button>
 */
const Button = ({
  children,
  variant = 'primary',
  outline = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-button focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: outline 
      ? 'border border-primary text-primary hover:bg-primary-container hover:text-primary-onContainer'
      : 'bg-primary text-primary-on hover:bg-primary-container hover:text-primary-onContainer',
    secondary: outline
      ? 'border border-secondary text-secondary hover:bg-secondary-container hover:text-secondary-onContainer'
      : 'bg-secondary text-secondary-on hover:bg-secondary-container hover:text-secondary-onContainer',
    danger: outline
      ? 'border border-error text-error hover:bg-error-container hover:text-error-onContainer'
      : 'bg-error text-error-on hover:bg-error-container hover:text-error-onContainer',
    ghost: 'bg-transparent text-onSurface hover:bg-surface-container',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const sizeClass = props.size ? sizes[props.size] : sizes.md;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
