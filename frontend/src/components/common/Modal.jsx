import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal Component
 * 
 * Example usage:
 * <Modal isOpen={true} onClose={() => setOpen(false)} title="Add User">
 *   <div>Form goes here</div>
 * </Modal>
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm p-4">
      <div className={`bg-surface-container-lowest w-full ${sizes[size]} rounded-card shadow-modal overflow-hidden flex flex-col max-h-[90vh]`}>
        
        <div className="flex justify-between items-center p-6 border-b border-surface-container">
          <h2 className="text-title-lg font-semibold text-onSurface">{title}</h2>
          <button 
            onClick={onClose}
            className="text-onSurface-variant hover:text-onSurface hover:bg-surface-container p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
        
        {footer && (
          <div className="p-6 border-t border-surface-container bg-surface-container-lowest flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
