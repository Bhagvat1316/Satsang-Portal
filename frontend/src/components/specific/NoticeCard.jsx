import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Calendar } from 'lucide-react';

/**
 * NoticeCard Component
 * 
 * Example usage:
 * <NoticeCard 
 *   title="Diwali Celebration" 
 *   date="Oct 24, 2026" 
 *   summary="Join us for the annual..." 
 *   priority="High" 
 * />
 */
const NoticeCard = ({ title, date, content, priority }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <Card.Body className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-onSurface-variant text-label-md gap-1.5">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <Badge variant={
            priority === 'HIGH' ? 'danger' : 
            priority === 'MEDIUM' ? 'primary' : 
            'default'
          }>
            {priority === 'HIGH' ? 'Important' : priority}
          </Badge>
        </div>
        
        <h4 className="text-title-lg font-semibold text-onSurface mb-2 line-clamp-1">{title}</h4>
        <p className="text-body-md text-onSurface-variant line-clamp-2">{content}</p>
      </Card.Body>
    </Card>
  );
};

export default NoticeCard;
