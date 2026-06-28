import React from 'react';

/**
 * PageHeader Component
 * 
 * Example usage:
 * <PageHeader 
 *   title="User Management" 
 *   subtitle="Manage portal users and their credentials" 
 *   action={<Button>Add User</Button>} 
 * />
 */
const PageHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-headline-lg font-semibold text-onSurface">{title}</h1>
        {subtitle && <p className="text-body-lg text-onSurface-variant mt-1">{subtitle}</p>}
      </div>
      {action && (
        <div className="shrink-0 w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
