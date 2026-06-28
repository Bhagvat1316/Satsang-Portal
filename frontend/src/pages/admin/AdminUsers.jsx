import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import PageHeader from '../../components/layout/PageHeader';
import UserTable from '../../components/specific/UserTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '' });
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUserId(null);
    setFormData({ fullName: '', username: '', email: '' });
    setGeneratedCreds(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id); // UUID
    setFormData({ 
      fullName: user.fullName || '', 
      username: user.username || '', 
      email: user.email || '' 
    });
    setGeneratedCreds(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    setError('');
    if (!formData.fullName || !formData.username) {
      setError('Please fill in Full Name and Username.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingUserId) {
        // Edit Mode
        const updatedUser = await userService.updateUser(editingUserId, formData);
        setUsers(users.map(u => u.id === editingUserId ? updatedUser : u));
        addToast("User updated successfully!", "success");
        setIsModalOpen(false);
      } else {
        // Create Mode
        const responseData = await userService.createUser(formData.fullName, formData.username, formData.email);
        
        // Defensive checks against unexpected API shape
        if (!responseData || !responseData.user || !responseData.credentials) {
          throw new Error('Received malformed response from the server.');
        }

        const { user, credentials } = responseData;
        setUsers([...users, user]);
        setGeneratedCreds(credentials);
        addToast("User created successfully!", "success");
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = await userService.toggleUserStatus(user.id);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      addToast(`Status updated to ${updatedUser.status} for ${updatedUser.fullName}`, "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}? This cannot be undone.`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      setUsers(users.filter(u => u.id !== user.id));
      addToast(`User ${user.fullName} deleted successfully.`, "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to delete user", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="User Management" 
        subtitle="Manage users, assign roles, and handle credentials."
        action={<Button onClick={openCreateModal}>Create User</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-surface-container">
          <div className="text-onSurface-variant mb-4 font-medium text-lg">No users found</div>
          <Button outline onClick={openCreateModal}>Create the first user</Button>
        </div>
      ) : (
        <UserTable 
          users={users} 
          onEdit={handleEditClick} 
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUserId ? "Edit User" : "Create New User"}
        footer={
          !generatedCreds && (
            <>
              <Button variant="secondary" outline onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleSaveUser} isLoading={isSubmitting}>
                {editingUserId ? "Save Changes" : "Create User"}
              </Button>
            </>
          )
        }
      >
        {!generatedCreds ? (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="text-sm text-error bg-error-container p-3 rounded-button font-medium">
                {error}
              </div>
            )}
            <Input 
              label="Full Name" 
              placeholder="e.g. Jay Patel" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={isSubmitting}
            />
            <Input 
              label="Username" 
              placeholder="e.g. jay.patel" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              disabled={isSubmitting}
            />
            <Input 
              label="Email (Optional)" 
              placeholder="e.g. jay@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center py-4">
            <div className="bg-success-container text-success-onContainer p-4 rounded-button mb-4">
              User created successfully! Please save these credentials.
            </div>
            <div className="text-display-sm text-onSurface font-bold">{generatedCreds.userId}</div>
            <div className="text-title-lg text-primary font-medium">{generatedCreds.password}</div>
            <p className="text-sm text-onSurface-variant mt-2">These credentials will only be shown once.</p>
            <Button className="mt-4" onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
