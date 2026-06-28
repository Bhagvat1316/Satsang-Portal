import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { MapPin, Clock } from 'lucide-react';

/**
 * EventCard Component
 * 
 * Example usage:
 * <EventCard 
 *   title="Youth Sabha" 
 *   date="Sunday, Oct 25" 
 *   time="10:00 AM" 
 *   location="Main Hall" 
 *   isRegistered={false} 
 * />
 */
const EventCard = ({ title, eventDate, description, venue, isRegistered, onRegister }) => {
  return (
    <Card className="flex flex-col h-full">
      <Card.Body className="p-5 flex-grow">
        <div className="text-primary font-medium text-label-md uppercase tracking-wider mb-2">
          {new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <h4 className="text-title-lg font-semibold text-onSurface mb-3">{title}</h4>
        <p className="text-body-md text-onSurface-variant line-clamp-2 mb-4 flex-grow">{description}</p>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-onSurface-variant text-body-md gap-2">
            <MapPin size={16} />
            <span>{venue}</span>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="p-5 pt-0 bg-transparent border-none">
        {isRegistered ? (
          <Button variant="ghost" disabled className="w-full text-[#1B5E20] bg-[#C8E6C9]/30">Registered</Button>
        ) : (
          <Button onClick={onRegister} className="w-full">Register</Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default EventCard;
