import React, { forwardRef } from 'react';

/**
 * TextArea Component
 * 
 * Example usage:
 * <TextArea label="Description" placeholder="Enter details..." rows={4} />
 */
const TextArea = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md text-onSurface-variant font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={`
          bg-surface-container-lowest border rounded-button px-4 py-2 w-full text-body-lg text-onSurface resize-y
          focus:outline-none focus:ring-2 focus:border-transparent transition-all
          placeholder:text-onSurface-variant/50
          ${error 
            ? 'border-error focus:ring-error-container' 
            : 'border-surface-container-highest focus:ring-primary-container focus:border-primary'}
        `}
        {...props}
      />
      {error && (
        <span className="text-label-md text-error mt-0.5">{error}</span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
