import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { reportService } from '../../services/reportService';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/specific/StatCard';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Calendar, Users, CheckSquare, XSquare } from 'lucide-react';

const COLORS = ['#2b6485', '#e76f51'];

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    report: null,
    monthly: [],
    topAttendees: []
  });
  const { addToast } = useToast();
  
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchAnalytics();
  }, [filterMonth, filterYear]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [reportData, monthlyData, topAttendeesData] = await Promise.all([
        reportService.getAttendanceReport(filterMonth, filterYear),
        reportService.getMonthlyAttendanceAnalytics(filterYear),
        reportService.getTopAttendees(filterMonth, filterYear)
      ]);

      setData({
        report: reportData,
        monthly: monthlyData,
        topAttendees: topAttendeesData
      });
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to load reports data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data.report) return <LoadingSpinner size="lg" className="py-20" />;

  const presentVsAbsent = data.report ? [
    { name: 'Present', value: data.report.presentCount },
    { name: 'Absent', value: data.report.absentCount }
  ] : [];

  // Recharts LineChart works best with short month names if there's limited space
  const formattedMonthly = data.monthly.map(m => ({
    ...m,
    name: m.month.substring(0, 3)
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-container-highest pb-6 mb-2">
        <div className="flex-grow">
          <h1 className="text-display-sm font-bold text-onSurface mb-2">Reports & Analytics</h1>
          <p className="text-body-lg text-onSurface-variant">Comprehensive insights into community engagement based on attendance.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-2 bg-surface-container-low p-4 rounded-card border border-surface-container-highest">
        <Select 
          label="Year" 
          value={filterYear} 
          onChange={(e) => setFilterYear(e.target.value)}
          options={[
            {value: '2026', label: '2026'}, 
            {value: '2025', label: '2025'},
            {value: 'All', label: 'All Time'}
          ]}
        />
        <Select 
          label="Month" 
          value={filterMonth} 
          onChange={(e) => setFilterMonth(e.target.value)}
          options={[
            {value: 'All', label: 'All Months'},
            {value: '01', label: 'January'},
            {value: '02', label: 'February'},
            {value: '03', label: 'March'},
            {value: '04', label: 'April'},
            {value: '05', label: 'May'},
            {value: '06', label: 'June'},
            {value: '07', label: 'July'},
            {value: '08', label: 'August'},
            {value: '09', label: 'September'},
            {value: '10', label: 'October'},
            {value: '11', label: 'November'},
            {value: '12', label: 'December'}
          ]}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Records" value={data.report?.totalRecords || 0} icon={<Users />} />
        <StatCard title="Avg. Attendance" value={`${data.report?.overallAttendancePercentage || 0}%`} icon={<Calendar />} />
        <StatCard title="Present Count" value={data.report?.presentCount || 0} icon={<CheckSquare />} />
        <StatCard title="Absent Count" value={data.report?.absentCount || 0} icon={<XSquare />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Monthly Attendance Trend (Line Chart) */}
        <Card className="lg:col-span-2">
          <Card.Header title="Monthly Attendance Trends" />
          <Card.Body className="h-80 pt-0">
            {loading ? (
              <LoadingSpinner className="h-full flex items-center justify-center" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedMonthly} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae8e4" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#534439' }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#534439' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="percentage" stroke="#2b6485" strokeWidth={3} dot={{ r: 4, fill: '#2b6485', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>

        {/* Present vs Absent (Pie Chart) */}
        <Card>
          <Card.Header title="Overall Presence Ratio" />
          <Card.Body className="h-80 pt-0 flex justify-center items-center">
            {loading ? (
              <LoadingSpinner className="h-full flex items-center justify-center" />
            ) : data.report?.totalRecords === 0 ? (
              <div className="text-onSurface-variant opacity-60">No records found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={presentVsAbsent}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {presentVsAbsent.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Top Attendees List */}
      <div className="mt-2">
        <Card>
          <Card.Header title="Top Attendees" />
          <Card.Body className="p-0 overflow-hidden">
            {loading ? (
              <LoadingSpinner className="py-10" />
            ) : data.topAttendees.length === 0 ? (
              <div className="py-10 text-center text-onSurface-variant opacity-60">No top attendees found for this period.</div>
            ) : (
              <Table 
                headers={['Rank', 'User ID', 'Full Name', 'Total Events', 'Present Count', 'Attendance %']}
                data={data.topAttendees}
                renderRow={(user, idx) => (
                  <tr key={user.userId} className="hover:bg-surface-container-low/50">
                    <td className="px-6 py-4 text-onSurface-variant font-medium">#{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-onSurface">{user.userId}</td>
                    <td className="px-6 py-4 text-onSurface">{user.fullName}</td>
                    <td className="px-6 py-4 text-onSurface-variant">{user.totalEvents}</td>
                    <td className="px-6 py-4 text-primary font-bold">{user.presentCount}</td>
                    <td className="px-6 py-4 text-onSurface">{user.attendancePercentage}%</td>
                  </tr>
                )}
              />
            )}
          </Card.Body>
        </Card>
      </div>

    </div>
  );
};

export default AdminReports;
