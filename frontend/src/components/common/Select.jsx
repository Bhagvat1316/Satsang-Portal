import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select Component
 * 
 * Example usage:
 * <Select label="Role" options={[{label: 'Admin', value: 'admin'}]} />
 */
const Select = forwardRef(({ label, id, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md text-onSurface-variant font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={`
            appearance-none bg-surface-container-lowest border rounded-button px-4 py-2 w-full text-body-lg text-onSurface
            focus:outline-none focus:ring-2 focus:border-transparent transition-all
            ${error 
              ? 'border-error focus:ring-error-container' 
              : 'border-surface-container-highest focus:ring-primary-container focus:border-primary'}
          `}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-onSurface-variant">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && (
        <span className="text-label-md text-error mt-0.5">{error}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
