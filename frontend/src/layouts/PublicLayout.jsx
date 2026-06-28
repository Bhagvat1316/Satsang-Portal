import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface p-4 border-b border-surface-container-highest">
        <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center">
          <div className="text-primary font-bold text-xl tracking-tight">Satsang Portal</div>
          <nav className="flex gap-4">
            <a href="/" className="text-onSurface-variant hover:text-primary transition-colors">Home</a>
            <a href="/notices" className="text-onSurface-variant hover:text-primary transition-colors">Notices</a>
            <a href="/gallery" className="text-onSurface-variant hover:text-primary transition-colors">Gallery</a>
            <a href="/login" className="btn-primary">Login</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow max-w-[1280px] mx-auto w-full p-6">
        <Outlet />
      </main>
      
      <footer className="bg-surface-container-low p-6 text-center text-onSurface-variant border-t border-surface-container-highest">
        <p>&copy; {new Date().getFullYear()} Satsang Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
