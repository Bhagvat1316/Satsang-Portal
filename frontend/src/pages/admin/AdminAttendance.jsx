import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { attendanceService } from '../../services/attendanceService';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminAttendance = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  
  // Sabha Session Details
  const [session, setSession] = useState({
    date: new Date().toISOString().split('T')[0],
    name: 'Weekly Sabha',
    startTime: '17:00',
    endTime: '19:00'
  });

  // Modals and notifications
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'Present' or 'Absent'
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      // Only show active users for attendance usually, but we'll show all for mock simplicity or filter active
      setUsers(data.filter(u => u.status === 'ACTIVE' && u.role !== 'ADMIN'));
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.userId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.userId));
    }
  };

  const handleCheckboxChange = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const initiateAction = (type) => {
    if (selectedUserIds.length === 0) return;
    setActionType(type);
    setIsConfirmModalOpen(true);
  };

  const confirmAction = async () => {
    setIsConfirmModalOpen(false);
    setLoading(true);
    try {
      const selectedUsers = users.filter(u => selectedUserIds.includes(u.userId));
      
      if (actionType === 'Present') {
        await attendanceService.markBulkPresent(selectedUserIds, session);
      } else {
        await attendanceService.markBulkAbsent(selectedUserIds, session);
      }
      
      addToast(`Successfully marked ${selectedUserIds.length} users as ${actionType} for ${session.date}`, "success");
      setSelectedUserIds([]);
    } catch (err) {
      console.error(err);
      addToast("Error saving attendance.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Bulk Attendance Management" 
        subtitle="Manage attendance for sabha sessions efficiently."
      />

      {/* Session Configuration */}
      <Card>
        <Card.Header title="Sabha Session Details" />
        <Card.Body className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Sabha Name" value={session.name} onChange={(e) => setSession({...session, name: e.target.value})} />
          <Input type="date" label="Date" value={session.date} onChange={(e) => setSession({...session, date: e.target.value})} />
          <Input type="time" label="Start Time" value={session.startTime} onChange={(e) => setSession({...session, startTime: e.target.value})} />
          <Input type="time" label="End Time" value={session.endTime} onChange={(e) => setSession({...session, endTime: e.target.value})} />
        </Card.Body>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-card border border-surface-container-highest">
        <div className="flex gap-2 items-center">
          <Button variant="secondary" outline onClick={handleSelectAll}>
            {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-onSurface-variant text-label-md ml-2">
            {selectedUserIds.length} selected
          </span>
        </div>
        
        <div className="flex-grow max-w-md w-full">
          <Input placeholder="Search users by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white flex-grow md:flex-grow-0" 
            onClick={() => initiateAction('Present')}
            disabled={selectedUserIds.length === 0}
          >
            Mark Present
          </Button>
          <Button 
            variant="danger" 
            className="flex-grow md:flex-grow-0"
            onClick={() => initiateAction('Absent')}
            disabled={selectedUserIds.length === 0}
          >
            Mark Absent
          </Button>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : (
        <div className="bg-surface-container-lowest rounded-card border border-surface-container-highest overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4 text-label-md uppercase tracking-wider text-onSurface-variant">User ID</th>
                <th className="px-6 py-4 text-label-md uppercase tracking-wider text-onSurface-variant">Full Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {filteredUsers.map(user => (
                <tr key={user.userId} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-surface-container-highest text-primary focus:ring-primary"
                      checked={selectedUserIds.includes(user.userId)}
                      onChange={() => handleCheckboxChange(user.userId)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-onSurface">{user.userId}</td>
                  <td className="px-6 py-4 text-onSurface">{user.fullName}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-onSurface-variant">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Attendance"
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </>
        }
      >
        <p className="text-body-lg text-onSurface">
          Are you sure you want to mark <strong>{selectedUserIds.length}</strong> users as <strong>{actionType}</strong> for the session on <strong>{session.date}</strong>?
        </p>
      </Modal>

    </div>
  );
};

export default AdminAttendance;
