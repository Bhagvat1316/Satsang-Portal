import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Component
 * 
 * Example usage:
 * <Breadcrumb 
 *   items={[
 *     { label: 'Admin', path: '/admin' },
 *     { label: 'Users', path: '/admin/users' },
 *     { label: 'Add User' } // Active item, no path
 *   ]} 
 * />
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`flex text-body-md ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-onSurface-variant hover:text-primary transition-colors">
            <Home size={16} className="mr-2" />
            Home
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRight size={16} className="text-surface-container-highest mx-1" />
                {isLast || !item.path ? (
                  <span className="text-onSurface font-medium ml-1 md:ml-2">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="text-onSurface-variant hover:text-primary transition-colors ml-1 md:ml-2"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
