import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import PageHeader from '../../components/layout/PageHeader';
import EventCard from '../../components/specific/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const UserEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionRegistrations, setSessionRegistrations] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      setSessionRegistrations([...sessionRegistrations, eventId]);
      addToast("Successfully registered for the event", "success");
    } catch (error) {
      // Catch specific backend duplicate error natively without showing an error block
      if (error.response?.status === 400 && error.response?.data?.message === 'User is already registered for this event') {
        setSessionRegistrations([...sessionRegistrations, eventId]);
        addToast("You are already registered for this event.", "success");
      } else {
        addToast(error.response?.data?.message || error.message || "Failed to register", "error");
      }
    }
  };

  return (
    <div>
      <PageHeader 
        title="Community Events" 
        subtitle="Discover and register for upcoming shibirs and special sabhas." 
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = sessionRegistrations.includes(event.id);
            return (
              <EventCard 
                key={event.id}
                title={event.title}
                description={event.description}
                eventDate={event.eventDate}
                venue={event.venue}
                isRegistered={isRegistered}
                onRegister={() => handleRegister(event.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={Calendar}
          title="No upcoming events" 
          description="There are currently no events scheduled. Check back later!" 
        />
      )}
    </div>
  );
};

export default UserEvents;
