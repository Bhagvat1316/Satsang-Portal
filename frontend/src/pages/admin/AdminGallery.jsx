import React, { useEffect, useState, useRef } from 'react';
import { galleryService } from '../../services/galleryService';
import PageHeader from '../../components/layout/PageHeader';
import GalleryGrid from '../../components/specific/GalleryGrid';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Upload } from 'lucide-react';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ eventName: '', title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await galleryService.getGallery();
      setImages(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to fetch gallery", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        addToast("File size must be less than 5MB", "error");
        return;
      }
      if (!file.type.startsWith('image/')) {
        addToast("Only image files are allowed", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!formData.eventName) {
      addToast("Event Name is required", "error");
      return;
    }
    if (!selectedFile) {
      addToast("Please select an image file to upload", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('eventName', formData.eventName);
      if (formData.title) uploadData.append('title', formData.title);
      if (formData.description) uploadData.append('description', formData.description);
      uploadData.append('image', selectedFile);

      const newImage = await galleryService.uploadImage(uploadData);
      setImages(prev => [newImage, ...prev]);
      setIsModalOpen(false);
      setFormData({ eventName: '', title: '', description: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      addToast("Photo uploaded successfully", "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to upload photo", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    if (window.confirm(`Are you sure you want to delete this photo?`)) {
      try {
        await galleryService.deleteImage(image.id);
        setImages(prev => prev.filter(img => img.id !== image.id));
        addToast("Photo deleted successfully", "success");
      } catch (err) {
        console.error(err);
        addToast(err.message || "Failed to delete photo", "error");
      }
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({ eventName: '', title: '', description: '' });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Gallery Management" 
        subtitle="Upload and manage photos from community events."
        action={<Button onClick={() => setIsModalOpen(true)}>Upload Photo</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <GalleryGrid images={images} isAdmin={true} onDelete={handleDelete} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !uploading && resetForm()}
        title="Upload Photo"
        footer={
          <>
            <Button variant="secondary" outline onClick={resetForm} disabled={uploading}>Cancel</Button>
            <Button onClick={handleUpload} isLoading={uploading}>Upload</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input 
            label="Event Name *" 
            placeholder="e.g. Diwali 2026"
            value={formData.eventName} 
            onChange={(e) => setFormData({...formData, eventName: e.target.value})} 
            disabled={uploading}
            required
          />
          <Input 
            label="Photo Title (Optional)" 
            placeholder="e.g. Main Aarti"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            disabled={uploading}
          />
          <TextArea 
            label="Description (Optional)" 
            placeholder="Add a brief description..."
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            disabled={uploading}
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-medium text-onSurface">Image File * (Max 5MB)</label>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                outline 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                type="button"
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                {selectedFile ? 'Change File' : 'Select File'}
              </Button>
              <span className="text-body-sm text-onSurface-variant truncate max-w-[200px]">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGallery;
