import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      <Sidebar role="ADMIN" onLogout={handleLogout} className="hidden md:flex flex-shrink-0" />
      
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
          <div className="relative w-64 h-full z-50 transform transition-transform shadow-2xl">
            <button 
              className="absolute top-4 right-[-48px] p-2 bg-inverse-surface text-inverse-onSurface rounded-r-button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <Sidebar role="ADMIN" onLogout={handleLogout} className="w-full flex" onNavClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-inverse-surface p-4 md:hidden flex items-center gap-4">
          <button 
            className="text-inverse-onSurface p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="text-inverse-primary font-bold text-xl">Admin Portal</div>
        </header>
        <main className="p-6 md:p-10 flex-grow max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
