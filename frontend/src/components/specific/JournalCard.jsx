import React from 'react';
import Card from '../common/Card';
import { BookOpen } from 'lucide-react';

/**
 * JournalCard Component
 * 
 * Example usage:
 * <JournalCard 
 *   date="Oct 20, 2026" 
 *   topic="Importance of Seva" 
 *   content="Today we learned about..." 
 *   action={<button>Edit</button>}
 * />
 */
const JournalCard = ({ date, topic, content, action }) => {
  return (
    <Card className="hover:shadow-md transition-shadow relative">
      <Card.Body className="p-5">
        <div className="flex items-start gap-4">
          <div className="bg-primary-container/20 p-3 rounded-xl text-primary shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="flex-grow pr-12">
            <div className="text-onSurface-variant text-label-md mb-1">{date}</div>
            <h4 className="text-title-lg font-semibold text-onSurface mb-2">{topic}</h4>
            <p className="text-body-md text-onSurface-variant line-clamp-3">{content}</p>
          </div>
        </div>
        {action && (
          <div className="absolute top-4 right-4">
            {action}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default JournalCard;
