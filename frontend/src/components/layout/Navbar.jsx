import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import Button from '../common/Button';

/**
 * Navbar Component
 * 
 * Example usage:
 * <Navbar 
 *   isAuthenticated={true} 
 *   user={{name: 'John'}} 
 *   onLogout={() => {}} 
 *   onMenuClick={() => {}} 
 * />
 */
const Navbar = ({ 
  isAuthenticated = false, 
  user = null, 
  onLogout, 
  onMenuClick,
  className = '' 
}) => {
  return (
    <header className={`bg-surface p-4 border-b border-surface-container-highest ${className}`}>
      <div className="max-w-container-max mx-auto w-full flex justify-between items-center h-10">
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button 
              onClick={onMenuClick} 
              className="md:hidden text-onSurface-variant hover:text-onSurface p-1 rounded-full hover:bg-surface-container"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="text-primary font-bold text-xl tracking-tight">
            <a href="/">Satsang Portal</a>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <a href="/" className="hidden md:block text-onSurface-variant hover:text-primary transition-colors font-medium text-body-md">Home</a>
              <a href="/notices" className="hidden md:block text-onSurface-variant hover:text-primary transition-colors font-medium text-body-md">Notices</a>
              <a href="/gallery" className="hidden md:block text-onSurface-variant hover:text-primary transition-colors font-medium text-body-md">Gallery</a>
              <Button onClick={() => window.location.href = '/login'}>Login</Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-onSurface-variant text-body-md">
                <User size={18} />
                <span>{user?.name || 'User'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-onSurface-variant hover:text-error p-2 rounded-full hover:bg-error-container transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
