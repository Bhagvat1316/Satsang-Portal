import React from 'react';
import Card from '../common/Card';

/**
 * AttendanceSummaryCard Component
 * 
 * Example usage:
 * <AttendanceSummaryCard 
 *   present={8} 
 *   absent={2} 
 *   total={10} 
 *   percentage={80} 
 * />
 */
const AttendanceSummaryCard = ({ present, absent, total, percentage }) => {
  return (
    <Card>
      <Card.Header title="Attendance Summary" subtitle="Your recent attendance record" />
      <Card.Body>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {/* Simple CSS Circle for placeholder chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-headline-md font-bold text-onSurface">{percentage}%</span>
            </div>
          </div>
          
          <div className="flex-grow grid grid-cols-2 gap-4 w-full">
            <div className="bg-surface-container-low p-4 rounded-button border border-surface-container-highest">
              <p className="text-label-md text-onSurface-variant uppercase tracking-wider mb-1">Present</p>
              <p className="text-headline-md font-bold text-[#1B5E20]">{present}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-button border border-surface-container-highest">
              <p className="text-label-md text-onSurface-variant uppercase tracking-wider mb-1">Absent</p>
              <p className="text-headline-md font-bold text-error">{absent}</p>
            </div>
            <div className="col-span-2 bg-surface-container-low p-4 rounded-button border border-surface-container-highest flex justify-between items-center">
              <p className="text-body-md text-onSurface-variant font-medium">Total Sabhas</p>
              <p className="text-title-lg font-bold text-onSurface">{total}</p>
            </div>
          </div>
          
        </div>
      </Card.Body>
    </Card>
  );
};

export default AttendanceSummaryCard;
