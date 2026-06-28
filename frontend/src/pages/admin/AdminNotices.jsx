import React, { useEffect, useState } from 'react';
import { noticeService } from '../../services/noticeService';
import PageHeader from '../../components/layout/PageHeader';
import NoticeTable from '../../components/specific/NoticeTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeService.getAllNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to fetch notices", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingNoticeId(null);
    setFormData({ title: '', description: '', priority: 'MEDIUM' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNoticeId(notice.id);
    setFormData({ 
      title: notice.title || '', 
      description: notice.description || '', 
      priority: notice.priority || 'MEDIUM' 
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setError('');
    if (!formData.title || !formData.description) {
      setError('Please fill in Title and Description.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingNoticeId) {
        const updatedNotice = await noticeService.updateNotice(editingNoticeId, formData);
        setNotices(notices.map(n => n.id === editingNoticeId ? updatedNotice : n));
        addToast("Notice updated successfully", "success");
      } else {
        const newNotice = await noticeService.createNotice(formData);
        setNotices([newNotice, ...notices]);
        addToast("Notice published successfully", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (notice) => {
    if (window.confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      try {
        await noticeService.deleteNotice(notice.id);
        setNotices(notices.filter(n => n.id !== notice.id));
        addToast("Notice deleted successfully", "success");
      } catch (err) {
        console.error(err);
        addToast(err.message || "Failed to delete notice", "error");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Notice Management" 
        subtitle="Publish and manage community announcements."
        action={<Button onClick={openCreateModal}>Create Notice</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-surface-container">
          <div className="text-onSurface-variant mb-4 font-medium text-lg">No notices found</div>
          <Button outline onClick={openCreateModal}>Publish the first notice</Button>
        </div>
      ) : (
        <NoticeTable notices={notices} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNoticeId ? "Edit Notice" : "Create Notice"}
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSubmitting}>{editingNoticeId ? "Update" : "Publish"}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-error bg-error-container p-3 rounded-button font-medium">
              {error}
            </div>
          )}
          <Input 
            label="Title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            disabled={isSubmitting} 
          />
          <Select
            label="Priority"
            options={[
              { value: 'LOW', label: 'LOW' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'HIGH', label: 'HIGH' }
            ]}
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            disabled={isSubmitting}
          />
          <TextArea 
            label="Description" 
            rows={4}
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={isSubmitting} 
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminNotices;
