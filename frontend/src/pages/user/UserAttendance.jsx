import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import PageHeader from '../../components/layout/PageHeader';
import AttendanceSummaryCard from '../../components/specific/AttendanceSummaryCard';
import AttendanceChart from '../../components/specific/AttendanceChart';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // getAttendanceByUser aliases getUserAttendanceHistory -> GET /api/attendance/user/:userId
        const data = await attendanceService.getAttendanceByUser(user.userId);
        setRecords(data?.records || []);
      } catch (err) {
        console.error('Failed to fetch attendance', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) fetchAttendance();
  }, [user.userId]);

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  // Backend returns attendancePercentage directly; compute locally as fallback
  const presentCount = records.filter(a => a.status === 'PRESENT').length;
  const totalSabhas = records.length;
  const percentage = totalSabhas > 0 ? Math.round((presentCount / totalSabhas) * 100) : 0;

  const chartData = [
    { month: 'Jul', attendance: 80 },
    { month: 'Aug', attendance: 85 },
    { month: 'Sep', attendance: 90 },
    { month: 'Oct', attendance: percentage }
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="My Attendance" 
        subtitle="Track your sabha attendance and participation." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceSummaryCard 
          present={presentCount}
          absent={totalSabhas - presentCount}
          total={totalSabhas}
          percentage={percentage}
        />
        <AttendanceChart data={chartData} title="Monthly Trend" />
      </div>

      <div className="mt-8">
        <h3 className="text-title-lg font-semibold text-onSurface mb-4">Attendance History</h3>
        <Table 
          headers={['Sabha Date', 'Sabha Name', 'Status']}
          data={records}
          renderRow={(record) => (
            <tr key={record.id || record.sabhaDate} className="hover:bg-surface-container-low/50">
              <td className="px-6 py-4 font-medium text-onSurface">{record.sabhaDate}</td>
              <td className="px-6 py-4 text-onSurface-variant">{record.sabhaName || '—'}</td>
              <td className="px-6 py-4">
                <Badge variant={record.status === 'PRESENT' ? 'success' : 'danger'}>
                  {record.status}
                </Badge>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default UserAttendance;
