import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { eventService } from '../../services/eventService';
import { noticeService } from '../../services/noticeService';
import { journalService } from '../../services/journalService';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/specific/StatCard';
import AttendanceSummaryCard from '../../components/specific/AttendanceSummaryCard';
import AttendanceChart from '../../components/specific/AttendanceChart';
import NoticeCard from '../../components/specific/NoticeCard';
import EventCard from '../../components/specific/EventCard';
import JournalCard from '../../components/specific/JournalCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckSquare, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sessionRegistrations, setSessionRegistrations] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attendanceHistory, events, notices, journalsResponse] = await Promise.all([
          attendanceService.getAttendanceByUser(user.userId),
          eventService.getAllEvents(),
          noticeService.getAllNotices(),
          journalService.getMyJournals(1, 3)
        ]);

        const presentCount = (attendanceHistory?.records || []).filter(a => a.status === 'PRESENT').length;
        const totalSabhas = (attendanceHistory?.records || []).length;
        const percentage = attendanceHistory?.attendancePercentage ?? (totalSabhas > 0 ? Math.round((presentCount / totalSabhas) * 100) : 0);

        setData({
          attendance: {
            presentCount: attendanceHistory?.presentCount ?? presentCount,
            absentCount: attendanceHistory?.absentCount ?? (totalSabhas - presentCount),
            total: totalSabhas,
            percentage
          },
          events: events.slice(0, 3),
          notices: notices.slice(0, 3),
          journals: journalsResponse.data || []
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setError(true);
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchDashboardData();
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      setSessionRegistrations(prev => [...prev, eventId]);
      addToast('Successfully registered for the event', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      if (
        err?.response?.status === 400 &&
        message === 'User is already registered for this event'
      ) {
        setSessionRegistrations(prev => [...prev, eventId]);
        addToast('You are already registered for this event', 'info');
        return;
      }
      addToast(message || 'Registration failed', 'error');
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-title-lg text-error mb-2">Unable to load dashboard</h2>
        <p className="text-body-md text-onSurface-variant">Please try refreshing the page.</p>
      </div>
    );
  }

  const chartData = [
    { month: 'Aug', attendance: 85 },
    { month: 'Sep', attendance: 90 },
    { month: 'Oct', attendance: data.attendance?.percentage || 0 }
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'User'}!`} 
        subtitle="Here is an overview of your recent activity and upcoming events."
      />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Attendance" value={`${data.attendance?.percentage || 0}%`} icon={<CheckSquare />} trend="+2%" trendUp={true} />
        <StatCard title="Journals" value={data.journals?.length || 0} icon={<BookOpen />} />
        <StatCard title="Events Registered" value="2" icon={<Calendar />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AttendanceSummaryCard 
            present={data.attendance?.presentCount || 0}
            absent={data.attendance?.absentCount || 0}
            total={data.attendance?.total || 0}
            percentage={data.attendance?.percentage || 0}
          />
          <AttendanceChart data={chartData} />
        </div>
        
        {/* Notices */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-title-lg font-semibold text-onSurface">Recent Notices</h3>
            <Link to="/notices" className="text-primary text-label-md font-medium">View All</Link>
          </div>
          {data.notices?.map(notice => <NoticeCard key={notice.id} {...notice} content={notice.description} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Upcoming Events */}
        <div>
          <div className="flex justify-between items-center px-2 mb-4">
            <h3 className="text-title-lg font-semibold text-onSurface">Upcoming Events</h3>
            <Link to="/user/events" className="text-primary text-label-md font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.events?.slice(0, 2).map(event => (
              <EventCard 
                key={event.id} 
                title={event.title}
                description={event.description}
                venue={event.venue}
                eventDate={event.eventDate}
                isRegistered={sessionRegistrations.includes(event.id)} 
                onRegister={() => handleRegister(event.id)} 
              />
            ))}
          </div>
        </div>

        {/* Recent Journals */}
        <div>
          <div className="flex justify-between items-center px-2 mb-4">
            <h3 className="text-title-lg font-semibold text-onSurface">Recent Learnings</h3>
            <Link to="/user/journal" className="text-primary text-label-md font-medium">View All</Link>
          </div>
          <div className="flex flex-col gap-4">
            {data.journals?.length > 0 ? (
              data.journals.map(journal => (
                <JournalCard key={journal.id} {...journal} />
              ))
            ) : (
              <div className="text-body-md text-onSurface-variant p-4 bg-surface-container-low rounded-card text-center">
                No recent learnings.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
