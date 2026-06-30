import React, { useEffect, useState, useRef } from 'react';
import { bannerService } from '../../services/bannerService';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { GripVertical, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBannerRow = ({ banner, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 p-4 bg-surface-container-lowest border border-surface-container-highest rounded-card mb-3 shadow-sm ${isDragging ? 'ring-2 ring-primary' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-onSurface-variant p-2">
        <GripVertical size={20} />
      </div>
      <div className="w-32 h-16 rounded-md overflow-hidden bg-surface-container flex-shrink-0 relative">
        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
        {!banner.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <EyeOff className="text-white" size={16} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-title-md font-semibold text-onSurface truncate">{banner.title}</h4>
        <p className="text-body-sm text-onSurface-variant truncate">{banner.subtitle}</p>
        <div className="flex gap-2 mt-1">
          <Badge variant={banner.isActive ? 'success' : 'default'} size="sm">
            {banner.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {(banner.startDate || banner.endDate) && (
             <Badge variant="warning" size="sm">Scheduled</Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(banner)}><Edit2 size={16} /></Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(banner)} className="text-error"><Trash2 size={16} /></Button>
      </div>
    </div>
  );
};

const AdminHeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    startDate: '',
    endDate: '',
    isActive: true,
    imageFile: null,
    imagePreview: null
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllBannersAdmin();
      setBanners(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b.id === active.id);
      const newIndex = banners.findIndex((b) => b.id === over.id);
      
      const newOrdered = arrayMove(banners, oldIndex, newIndex);
      setBanners(newOrdered);

      try {
        await bannerService.reorderBanners(newOrdered.map(b => b.id));
        addToast('Banners reordered successfully', 'success');
      } catch (err) {
        addToast(err.message || 'Failed to save new order', 'error');
        fetchBanners(); // revert
      }
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '', subtitle: '', buttonText: '', buttonLink: '', startDate: '', endDate: '', isActive: true, imageFile: null, imagePreview: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
      isActive: banner.isActive,
      imageFile: null,
      imagePreview: banner.imageUrl
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (banner) => {
    setBannerToDelete(banner);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      setIsSubmitting(true);
      await bannerService.deleteBanner(bannerToDelete.id);
      setBanners(banners.filter(b => b.id !== bannerToDelete.id));
      addToast('Banner deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete banner', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size must be less than 5MB', 'error');
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        addToast('Only JPG, PNG, and WEBP formats are allowed', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageFile: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.subtitle.trim()) {
      addToast('Title and Subtitle are required.', 'error');
      return;
    }
    if (!editingBanner && !formData.imageFile) {
      addToast('A banner image is required for new banners.', 'error');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    if (formData.buttonText) data.append('buttonText', formData.buttonText);
    if (formData.buttonLink) data.append('buttonLink', formData.buttonLink);
    if (formData.startDate) data.append('startDate', new Date(formData.startDate).toISOString());
    if (formData.endDate) data.append('endDate', new Date(formData.endDate).toISOString());
    data.append('isActive', formData.isActive);
    if (formData.imageFile) data.append('image', formData.imageFile);

    try {
      if (editingBanner) {
        const updated = await bannerService.updateBanner(editingBanner.id, data);
        setBanners(banners.map(b => b.id === editingBanner.id ? updated : b));
        addToast('Banner updated successfully', 'success');
      } else {
        const created = await bannerService.createBanner(data);
        setBanners([...banners, created]);
        addToast('Banner created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save banner', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Hero Banner Management" 
        subtitle="Manage the animated homepage hero slider. Drag and drop to reorder."
        action={
          <Button 
            onClick={openCreateModal} 
            disabled={banners.length >= 10 || loading}
            title={banners.length >= 10 ? "Maximum of 10 banners allowed" : ""}
          >
            Create Banner
          </Button>
        }
      />

      {banners.length >= 10 && (
        <div className="bg-warning-container text-warning-onContainer p-4 rounded-card text-sm font-medium">
          Maximum of 10 Hero Banners allowed. You cannot add more unless you delete an existing banner.
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-surface-container">
          <ImageIcon size={48} className="text-onSurface-variant opacity-50 mb-4" />
          <div className="text-onSurface-variant mb-4 font-medium text-lg">No banners created yet.</div>
          <Button outline onClick={openCreateModal}>Create your first banner</Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col">
              {banners.map(banner => (
                <SortableBannerRow key={banner.id} banner={banner} onEdit={openEditModal} onDelete={confirmDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSubmitting}>{editingBanner ? "Update Banner" : "Save Banner"}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          {/* Live Preview */}
          <div>
            <label className="block text-label-md font-semibold text-onSurface-variant mb-2">Live Preview</label>
            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden bg-surface-container-highest border border-surface-container shadow-inner">
              {formData.imagePreview ? (
                <>
                  <img src={formData.imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-8 md:px-12 text-left">
                    <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 max-w-lg">{formData.title || "Banner Title"}</h2>
                    <p className="text-white/90 text-sm md:text-base max-w-md mb-6">{formData.subtitle || "Banner subtitle text appears here."}</p>
                    {formData.buttonText && formData.buttonLink && (
                      <div className="mt-2 inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-on rounded-full font-medium shadow-md">
                        {formData.buttonText}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-onSurface-variant">
                  <span className="flex items-center gap-2"><ImageIcon size={20} /> Upload an image to see preview</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-label-md font-semibold text-onSurface mb-2">Banner Image (Required) <span className="font-normal text-onSurface-variant ml-2 text-xs">1920x700 JPG/PNG/WEBP (Max 5MB)</span></label>
              <div className="flex items-center gap-4">
                <Button variant="secondary" outline onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                  Choose File
                </Button>
                <span className="text-sm text-onSurface-variant">{formData.imageFile ? formData.imageFile.name : (formData.imagePreview ? 'Current Image Maintained' : 'No file chosen')}</span>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Input label="Title (Required)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} disabled={isSubmitting} placeholder="e.g. Guru Purnima Mahotsav 2026" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <TextArea label="Subtitle (Required)" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} disabled={isSubmitting} rows={2} placeholder="Join us for divine celebrations and seva." />
            </div>

            <Input label="Button Text (Optional)" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} disabled={isSubmitting} placeholder="e.g. Register Now" />
            <Input label="Button Link (Optional)" value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})} disabled={isSubmitting} placeholder="e.g. /events" />

            <Input type="datetime-local" label="Start Date (Optional)" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} disabled={isSubmitting} />
            <Input type="datetime-local" label="End Date (Optional)" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} disabled={isSubmitting} />
            
            <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} disabled={isSubmitting} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-label-md font-medium text-onSurface">Active (Visible to public if within dates)</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
        title="Delete Hero Banner?"
        footer={
          <>
            <Button variant="secondary" outline onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleDelete} isLoading={isSubmitting} className="bg-error text-error-on hover:bg-error/90 border-error">Delete</Button>
          </>
        }
      >
        <p className="text-body-md text-onSurface-variant mb-4">
          Are you sure you want to delete the banner <strong>"{bannerToDelete?.title}"</strong>? 
          This will permanently remove the image from storage. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminHeroBanners;
