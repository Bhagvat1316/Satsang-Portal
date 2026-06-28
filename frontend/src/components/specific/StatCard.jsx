import React from 'react';
import Card from '../common/Card';

/**
 * StatCard Component
 * 
 * Example usage:
 * <StatCard title="Total Users" value="1,234" icon={<Users />} trend="+5%" trendUp={true} />
 */
const StatCard = ({ title, value, icon, trend, trendUp = true }) => {
  return (
    <Card className="h-full">
      <Card.Body className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-body-md text-onSurface-variant font-medium mb-1">{title}</p>
            <h3 className="text-headline-lg font-bold text-onSurface">{value}</h3>
            
            {trend && (
              <div className="mt-2 flex items-center">
                <span className={`text-label-md font-medium ${trendUp ? 'text-[#1B5E20]' : 'text-error'}`}>
                  {trend}
                </span>
                <span className="text-label-md text-onSurface-variant ml-2">vs last month</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="bg-surface-container w-12 h-12 rounded-full flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
