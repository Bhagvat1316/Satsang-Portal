import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { journalService } from '../../services/journalService';
import PageHeader from '../../components/layout/PageHeader';
import JournalCard from '../../components/specific/JournalCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const UserJournal = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [formData, setFormData] = useState({ id: null, title: '', learning: '', sabhaDate: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchJournals(page);
  }, [page, user.userId]);

  const fetchJournals = async (targetPage) => {
    setLoading(true);
    try {
      const response = await journalService.getMyJournals(targetPage, limit);
      setJournals(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load journals", err);
      addToast('Failed to load journals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 3 || formData.title.trim().length > 150) {
      errors.title = 'Title must be between 3 and 150 characters.';
    }
    if (!formData.learning || formData.learning.trim() === '') {
      errors.learning = 'Learning reflection cannot be empty.';
    }
    if (!formData.sabhaDate) {
      errors.sabhaDate = 'Sabha Date is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const payload = {
        title: formData.title.trim(),
        learning: formData.learning.trim(),
        sabhaDate: formData.sabhaDate
      };

      if (formData.id) {
        await journalService.updateJournal(formData.id, payload);
        addToast('Journal entry updated successfully', 'success');
      } else {
        await journalService.createJournal(payload);
        addToast('Journal entry created successfully', 'success');
      }
      
      closeModal();
      fetchJournals(1); // Return to first page to see the new entry
      setPage(1);
    } catch (error) {
      addToast(error.message || 'Failed to save entry', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await journalService.deleteJournal(id);
      addToast('Journal entry deleted', 'success');
      fetchJournals(page);
    } catch (error) {
      addToast(error.message || 'Failed to delete entry', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, title: '', learning: '', sabhaDate: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (journal) => {
    setFormData({
      id: journal.id,
      title: journal.title,
      learning: journal.learning,
      sabhaDate: journal.sabhaDate
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Learning Journal" 
        subtitle="Document your reflections and key takeaways from sabhas." 
        action={<Button onClick={openAddModal}>Add Entry</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : journals.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {journals.map(journal => (
              <JournalCard 
                key={journal.id} 
                date={journal.sabhaDate}
                topic={journal.title}
                content={journal.learning}
                action={
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(journal)}
                      className="p-2 text-onSurface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                      title="Edit Entry"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setIsDeleting(journal.id)}
                      className="p-2 text-onSurface-variant hover:text-error hover:bg-surface-container rounded-full transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button 
                variant="secondary" 
                outline 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3"
              >
                <ChevronLeft size={20} />
              </Button>
              <span className="text-label-lg font-medium text-onSurface">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="secondary" 
                outline 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon={BookOpen}
          title="No entries found" 
          description="Start documenting your spiritual journey by adding a new entry."
        />
      )}

      {/* Add/Edit Entry Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={formData.id ? "Edit Learning Entry" : "Add Learning Entry"}
        footer={
          <>
            <Button variant="secondary" outline onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave}>Save Entry</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <Input 
              label="Topic (Title)" 
              placeholder="e.g. Importance of Seva" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              error={formErrors.title}
            />
            {formErrors.title && <p className="text-error text-label-sm mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <Input 
              type="date"
              label="Sabha Date" 
              value={formData.sabhaDate}
              onChange={(e) => setFormData({...formData, sabhaDate: e.target.value})}
              error={formErrors.sabhaDate}
            />
            {formErrors.sabhaDate && <p className="text-error text-label-sm mt-1">{formErrors.sabhaDate}</p>}
          </div>

          <div>
            <TextArea 
              label="Key Learnings & Reflection" 
              placeholder="Write down what you learned..." 
              rows={5}
              value={formData.learning}
              onChange={(e) => setFormData({...formData, learning: e.target.value})}
              error={formErrors.learning}
            />
            {formErrors.learning && <p className="text-error text-label-sm mt-1">{formErrors.learning}</p>}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        title="Delete Journal Entry"
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(isDeleting)}>Delete</Button>
          </>
        }
      >
        <p className="text-body-md text-onSurface-variant">
          Are you sure you want to delete this journal entry? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default UserJournal;
