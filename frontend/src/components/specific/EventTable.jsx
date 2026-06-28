import React from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import { Users, Edit2, Trash2 } from 'lucide-react';

/**
 * EventTable Component
 * 
 * Example usage:
 * <EventTable events={[{ id: 1, title: 'Youth Sabha', date: 'Oct 25', participants: 45 }]} />
 */
const EventTable = ({ events = [], onEdit, onDelete, onManageParticipants }) => {
  return (
    <Table
      headers={['Event Title', 'Event Date', 'Actions']}
      data={events}
      renderRow={(event) => (
        <tr key={event.id} className="hover:bg-surface-container-low/50 transition-colors">
          <td className="px-6 py-4 font-medium text-onSurface">{event.title}</td>
          <td className="px-6 py-4 text-onSurface-variant">{event.eventDate}</td>
          <td className="px-6 py-4 flex gap-2 items-center">
            <button 
              className="text-primary hover:bg-primary-container/50 px-3 py-1 rounded text-sm font-medium transition-colors"
              onClick={() => onManageParticipants(event)}
            >
              Participants
            </button>
            <button 
              className="text-secondary hover:bg-secondary-container p-2 rounded-full transition-colors ml-2"
              onClick={() => onEdit(event)}
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="text-error hover:bg-error-container p-2 rounded-full transition-colors"
              onClick={() => onDelete(event)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      )}
    />
  );
};

export default EventTable;
