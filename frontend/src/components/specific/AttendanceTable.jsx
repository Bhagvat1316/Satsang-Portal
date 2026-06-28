import React from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * AttendanceTable Component
 * 
 * Example usage:
 * <AttendanceTable records={[{ id: 1, user: 'Ravi', date: 'Oct 20', status: 'Present' }]} />
 */
const AttendanceTable = ({ records = [], onToggleStatus }) => {
  return (
    <Table
      headers={['User', 'Sabha Date', 'Status', 'Actions']}
      data={records}
      renderRow={(record) => (
        <tr key={record.id} className="hover:bg-surface-container-low/50 transition-colors">
          <td className="px-6 py-4 font-medium text-onSurface">{record.user}</td>
          <td className="px-6 py-4 text-onSurface-variant">{record.date}</td>
          <td className="px-6 py-4">
            <Badge variant={record.status === 'Present' ? 'success' : 'danger'}>
              {record.status}
            </Badge>
          </td>
          <td className="px-6 py-4">
            <Button 
              size="sm" 
              variant="secondary" 
              outline 
              onClick={() => onToggleStatus(record)}
            >
              Toggle
            </Button>
          </td>
        </tr>
      )}
    />
  );
};

export default AttendanceTable;
