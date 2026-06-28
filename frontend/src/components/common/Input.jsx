import React, { forwardRef } from 'react';

/**
 * Input Component
 * 
 * Example usage:
 * <Input label="Full Name" placeholder="Enter your name" id="name" />
 * <Input label="Email" type="email" error="Invalid email address" />
 */
const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md text-onSurface-variant font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`
          bg-surface-container-lowest border rounded-button px-4 py-2 w-full text-body-lg text-onSurface
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

Input.displayName = 'Input';

export default Input;
