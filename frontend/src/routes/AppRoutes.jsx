import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import PublicNotices from '../pages/public/PublicNotices';
import PublicGallery from '../pages/public/PublicGallery';

import UserDashboard from '../pages/user/UserDashboard';
import UserAttendance from '../pages/user/UserAttendance';
import UserJournal from '../pages/user/UserJournal';
import UserEvents from '../pages/user/UserEvents';
import UserProfile from '../pages/user/UserProfile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAttendance from '../pages/admin/AdminAttendance';
import AdminNotices from '../pages/admin/AdminNotices';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminEventRegistrations from '../pages/admin/AdminEventRegistrations';
import AdminJournals from '../pages/admin/AdminJournals';
import AdminGallery from '../pages/admin/AdminGallery';
import AdminHeroBanners from '../pages/admin/AdminHeroBanners';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notices" element={<PublicNotices />} />
          <Route path="/gallery" element={<PublicGallery />} />
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="attendance" element={<UserAttendance />} />
            <Route path="journal" element={<UserJournal />} />
            <Route path="events" element={<UserEvents />} />
            <Route path="profile" element={<UserProfile />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="event-registrations" element={<AdminEventRegistrations />} />
            <Route path="journals" element={<AdminJournals />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="hero-banners" element={<AdminHeroBanners />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
