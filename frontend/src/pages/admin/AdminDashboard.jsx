import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { eventService } from '../../services/eventService';
import { noticeService } from '../../services/noticeService';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/specific/StatCard';
import AttendanceChart from '../../components/specific/AttendanceChart';
import NoticeCard from '../../components/specific/NoticeCard';
import EventCard from '../../components/specific/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, UserCheck, Calendar as CalendarIcon, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // attendanceService.getAllAttendance() has no backend equivalent.
        // Dashboard loads users, events, and notices only.
        const [users, events, notices] = await Promise.all([
          userService.getAllUsers(),
          eventService.getAllEvents(),
          noticeService.getAllNotices()
        ]);

        const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

        setData({
          users: { total: users.length, active: activeUsers },
          events: events.slice(0, 3),
          notices: notices.slice(0, 3)
        });
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
        // Set safe defaults so the dashboard renders rather than crashing
        setData({
          users: { total: 0, active: 0 },
          events: [],
          notices: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  // Static chart data — attendance analytics require the Reports page
  const chartData = [
    { month: 'Jan', attendance: 0 },
    { month: 'Feb', attendance: 0 },
    { month: 'Mar', attendance: 0 },
    { month: 'Apr', attendance: 0 },
    { month: 'May', attendance: 0 },
    { month: 'Jun', attendance: 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Overview of portal activity and metrics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={data.users.total} icon={<Users />} />
        <StatCard title="Active Users" value={data.users.active} icon={<UserCheck />} trend="+5%" trendUp={true} />
        <StatCard title="Total Events" value={data.events.length} icon={<CalendarIcon />} />
        <StatCard title="Recent Notices" value={data.notices.length} icon={<Bell />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceChart data={chartData} title="Community Attendance Trends" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-title-lg font-semibold text-onSurface">Recent Notices</h3>
          {data.notices.length > 0
            ? data.notices.map(notice => <NoticeCard key={notice.id} {...notice} />)
            : <p className="text-body-md text-onSurface-variant">No recent notices.</p>
          }
        </div>
      </div>

      <div>
        <h3 className="text-title-lg font-semibold text-onSurface mb-4">Upcoming Events</h3>
        {data.events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.events.map(event => (
              <EventCard key={event.id} {...event} isRegistered={false} onRegister={() => {}} />
            ))}
          </div>
        ) : (
          <p className="text-body-md text-onSurface-variant">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
