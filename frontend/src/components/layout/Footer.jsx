import React from 'react';

/**
 * Footer Component
 * 
 * Example usage:
 * <Footer />
 */
const Footer = ({ className = '' }) => {
  return (
    <footer className={`bg-surface-container-low p-6 text-center text-onSurface-variant border-t border-surface-container-highest ${className}`}>
      <div className="max-w-container-max mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-body-md">&copy; {new Date().getFullYear()} Satsang Portal. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors text-body-md">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors text-body-md">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors text-body-md">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
