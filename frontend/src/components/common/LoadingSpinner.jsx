import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * Example usage:
 * <LoadingSpinner size="lg" />
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-primary border-primary/20 ${sizes[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;
