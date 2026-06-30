import React from 'react';
import { Home, Calendar, BookOpen, Bell, Image as ImageIcon, Users, CheckSquare, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar Component
 * 
 * Example usage:
 * <Sidebar role="USER" onLogout={() => {}} />
 */
const Sidebar = ({ role = 'USER', onLogout, onNavClick, className = '' }) => {
  const userRoutes = [
    { name: 'Dashboard', path: '/user/dashboard', icon: Home },
    { name: 'My Attendance', path: '/user/attendance', icon: CheckSquare },
    { name: 'Learning Journal', path: '/user/journal', icon: BookOpen },
    { name: 'Events', path: '/user/events', icon: Calendar },
  ];

  const adminRoutes = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: CheckSquare },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Event Registrations', path: '/admin/event-registrations', icon: Users },
    { name: 'Journals', path: '/admin/journals', icon: BookOpen },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Hero Banners', path: '/admin/hero-banners', icon: ImageIcon },
    { name: 'Reports', path: '/admin/reports', icon: BookOpen },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const routes = role === 'ADMIN' ? adminRoutes : userRoutes;
  const isInverse = role === 'ADMIN';

  return (
    <aside className={`
      w-64 flex flex-col h-full overflow-y-auto
      ${isInverse ? 'bg-inverse-surface text-inverse-onSurface' : 'bg-surface text-onSurface border-r border-surface-container-highest'}
      ${className}
    `}>
      <div className="p-6">
        <div className={`font-bold text-xl tracking-tight mb-8 ${isInverse ? 'text-inverse-primary' : 'text-primary'}`}>
          {role === 'ADMIN' ? 'Admin Portal' : 'Satsang Portal'}
        </div>
        
        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={onNavClick}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-button font-medium text-body-md transition-colors
                  ${isActive 
                    ? (isInverse ? 'bg-inverse-primary text-onSurface font-semibold' : 'bg-primary-container text-primary-onContainer font-semibold')
                    : (isInverse ? 'text-inverse-onSurface hover:bg-surface-variant hover:text-onSurface' : 'text-onSurface-variant hover:bg-surface-container hover:text-onSurface')
                  }
                `}
              >
                <Icon size={20} />
                {route.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-surface-container/20">
        <button 
          onClick={onLogout}
          aria-label="Logout"
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-button font-medium text-body-md transition-colors
            ${isInverse 
              ? 'text-error hover:bg-error hover:text-error-on' 
              : 'text-error hover:bg-error-container hover:text-error-onContainer'}
          `}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
