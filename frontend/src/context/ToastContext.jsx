import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-card shadow-lg min-w-[300px] max-w-md transform transition-all duration-300
              ${toast.type === 'success' ? 'bg-success-container text-success-onContainer' : 'bg-error-container text-error-onContainer'}
            `}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-[#1B5E20] flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-[#B3261E] flex-shrink-0" />
            )}
            
            <p className="text-body-md font-medium flex-grow">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-full hover:bg-black/5 transition-colors`}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
