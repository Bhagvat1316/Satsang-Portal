import React from 'react';

/**
 * Badge Component
 * 
 * Example usage:
 * <Badge variant="success">Present</Badge>
 * <Badge variant="warning">New</Badge>
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-container-high text-onSurface',
    primary: 'bg-primary-container text-primary-onContainer',
    secondary: 'bg-secondary-container text-secondary-onContainer',
    tertiary: 'bg-tertiary-container text-tertiary-onContainer',
    success: 'bg-[#C8E6C9] text-[#1B5E20]', // Custom for success logic
    warning: 'bg-[#FFECB3] text-[#F57F17]', // Custom for warning logic
    danger: 'bg-error-container text-error-onContainer',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-md font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
