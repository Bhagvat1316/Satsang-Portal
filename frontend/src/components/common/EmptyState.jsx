import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * EmptyState Component
 * 
 * Example usage:
 * <EmptyState title="No notices found" description="Check back later." />
 */
const EmptyState = ({ 
  icon: Icon = FolderOpen, 
  title = 'No data available', 
  description = 'There is currently no data to display.', 
  action,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="bg-surface-container w-16 h-16 rounded-full flex items-center justify-center mb-4 text-onSurface-variant">
        <Icon size={32} />
      </div>
      <h3 className="text-title-lg font-semibold text-onSurface mb-2">{title}</h3>
      <p className="text-body-md text-onSurface-variant max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
