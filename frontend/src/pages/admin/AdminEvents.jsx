import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import PageHeader from '../../components/layout/PageHeader';
import EventTable from '../../components/specific/EventTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '', venue: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Participants State
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

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
      addToast(err.message || "Failed to fetch events", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', eventDate: '', venue: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({ 
      title: event.title || '', 
      description: event.description || '', 
      eventDate: event.eventDate || '', 
      venue: event.venue || '' 
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.eventDate || !formData.venue) {
      addToast("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        const updatedEvent = await eventService.updateEvent(editingEvent.id, formData);
        setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
        addToast("Event updated successfully", "success");
      } else {
        const newEvent = await eventService.createEvent(formData);
        setEvents([newEvent, ...events]);
        addToast("Event created successfully", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to save event", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await eventService.deleteEvent(event.id);
        setEvents(events.filter(e => e.id !== event.id));
        addToast("Event deleted successfully", "success");
      } catch (err) {
        console.error(err);
        addToast(err.message || "Failed to delete event", "error");
      }
    }
  };

  const openParticipantsModal = async (event) => {
    setSelectedEventForParticipants(event);
    setIsParticipantsModalOpen(true);
    setLoadingParticipants(true);
    try {
      const response = await eventService.getEventRegistrations(event.id);
      // Assuming response.data contains the array of participants
      setParticipantsList(response.data || []);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to fetch participants", "error");
    } finally {
      setLoadingParticipants(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Event Management" 
        subtitle="Organize sabhas, shibirs, and community gatherings."
        action={<Button onClick={openCreateModal}>Create Event</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <EventTable 
          events={events} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
          onManageParticipants={openParticipantsModal}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create Event"}
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSubmitting}>{editingEvent ? "Update" : "Save"}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input 
            label="Event Name" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            disabled={isSubmitting}
          />
          <Input 
            type="date"
            label="Event Date" 
            value={formData.eventDate} 
            onChange={(e) => setFormData({...formData, eventDate: e.target.value})} 
            disabled={isSubmitting}
          />
          <Input 
            label="Venue" 
            value={formData.venue} 
            onChange={(e) => setFormData({...formData, venue: e.target.value})} 
            disabled={isSubmitting}
          />
          <TextArea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={isSubmitting}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        title={`Participants: ${selectedEventForParticipants?.title || ''}`}
        footer={
          <Button onClick={() => setIsParticipantsModalOpen(false)}>Close</Button>
        }
      >
        {loadingParticipants ? (
          <div className="py-10 flex justify-center"><LoadingSpinner /></div>
        ) : participantsList.length === 0 ? (
          <div className="py-10 text-center text-onSurface-variant">No participants registered yet.</div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 font-medium text-onSurface-variant">User ID</th>
                  <th className="py-3 font-medium text-onSurface-variant">Full Name</th>
                  <th className="py-3 font-medium text-onSurface-variant">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {participantsList.map((p, idx) => (
                  <tr key={idx} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/30">
                    <td className="py-3 text-onSurface">{p.userId}</td>
                    <td className="py-3 text-onSurface">{p.fullName}</td>
                    <td className="py-3 text-onSurface-variant">
                      {new Date(p.registeredAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEvents;
