import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

/**
 * PasswordInput Component
 * 
 * Example usage:
 * <PasswordInput label="Password" id="password" />
 */
const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-[34px] text-onSurface-variant hover:text-onSurface focus:outline-none"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
