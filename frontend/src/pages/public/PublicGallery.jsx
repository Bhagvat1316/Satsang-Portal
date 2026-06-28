import React, { useEffect, useState } from 'react';
import { galleryService } from '../../services/galleryService';
import PageHeader from '../../components/layout/PageHeader';
import GalleryGrid from '../../components/specific/GalleryGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ImageIcon } from 'lucide-react';

const PublicGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryService.getGallery(1, 100);
        setImages(data || []);
      } catch (error) {
        console.error(error);
        // We could add a toast here, but for public pages, we might just show empty state
        // if it completely fails.
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div>
      <PageHeader 
        title="Photo Gallery" 
        subtitle="Memories from our recent events, shibirs, and community gatherings." 
      />
      
      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : images.length > 0 ? (
        <GalleryGrid images={images} isAdmin={false} />
      ) : (
        <EmptyState 
          icon={ImageIcon}
          title="Gallery is empty" 
          description="Check back later for photos from our events." 
        />
      )}
    </div>
  );
};

export default PublicGallery;
