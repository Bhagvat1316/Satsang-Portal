import React from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Edit2, Trash2 } from 'lucide-react';

/**
 * NoticeTable Component
 * 
 * Example usage:
 * <NoticeTable notices={[{ id: 1, title: 'Diwali', date: 'Oct 24', priority: 'High' }]} />
 */
const NoticeTable = ({ notices = [], onEdit, onDelete }) => {
  return (
    <Table
      headers={['Title', 'Date Posted', 'Priority', 'Actions']}
      data={notices}
      renderRow={(notice) => (
        <tr key={notice.id} className="hover:bg-surface-container-low/50 transition-colors">
          <td className="px-6 py-4 font-medium text-onSurface">{notice.title}</td>
          <td className="px-6 py-4 text-onSurface-variant">
            {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </td>
          <td className="px-6 py-4">
            <Badge variant={
              notice.priority === 'HIGH' ? 'danger' : 
              notice.priority === 'MEDIUM' ? 'primary' : 
              'default'
            }>
              {notice.priority}
            </Badge>
          </td>
          <td className="px-6 py-4 flex gap-2">
            <button 
              className="text-secondary hover:bg-secondary-container p-2 rounded-full transition-colors"
              onClick={() => onEdit(notice)}
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="text-error hover:bg-error-container p-2 rounded-full transition-colors"
              onClick={() => onDelete(notice)}
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

export default NoticeTable;
