import React from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Edit2, Power, Trash2 } from 'lucide-react';

/**
 * UserTable Component
 */
const UserTable = ({ users = [], onEdit, onToggleStatus, onDelete }) => {
  return (
    <Table
      headers={['SAT ID', 'Full Name', 'Username', 'Email', 'Role', 'Status', 'Actions']}
      data={users}
      renderRow={(user) => (
        <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
          <td className="px-6 py-4 font-medium text-onSurface">{user.userId}</td>
          <td className="px-6 py-4 text-onSurface">{user.fullName}</td>
          <td className="px-6 py-4 text-onSurface-variant">{user.username}</td>
          <td className="px-6 py-4 text-onSurface-variant">{user.email || '-'}</td>
          <td className="px-6 py-4 text-onSurface-variant">{user.role || 'USER'}</td>
          <td className="px-6 py-4">
            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'default'}>
              {user.status}
            </Badge>
          </td>
          <td className="px-6 py-4 flex gap-2">
            <button className="text-primary hover:text-primary-hover p-1 rounded-full hover:bg-primary/10 transition-colors" onClick={() => onEdit(user)} title="Edit User">
              <Edit2 size={18} />
            </button>
            <button className="text-secondary hover:text-secondary-hover p-1 rounded-full hover:bg-secondary/10 transition-colors" onClick={() => onToggleStatus(user)} title="Toggle Status">
              <Power size={18} />
            </button>
            <button className="text-error hover:text-error-hover p-1 rounded-full hover:bg-error/10 transition-colors" onClick={() => onDelete(user)} title="Delete User">
              <Trash2 size={18} />
            </button>
          </td>
        </tr>
      )}
    />
  );
};

export default UserTable;
