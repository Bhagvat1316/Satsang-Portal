import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

/**
 * AttendanceChart Component
 * 
 * Example usage:
 * const data = [{ month: 'Jan', attendance: 80 }, { month: 'Feb', attendance: 90 }];
 * <AttendanceChart data={data} />
 */
const AttendanceChart = ({ data = [], title = "Attendance Trends" }) => {
  return (
    <Card className="h-full">
      <Card.Header title={title} />
      <Card.Body className="h-64 sm:h-80 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2b6485" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2b6485" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae8e4" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#534439', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#534439', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}
              cursor={{ stroke: '#867468', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="attendance" 
              stroke="#2b6485" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAttendance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default AttendanceChart;
