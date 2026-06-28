import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

/**
 * GalleryGrid Component
 * 
 * Example usage:
 * <GalleryGrid 
 *   images={[{ id: 1, url: 'img.jpg', title: 'Diwali' }]} 
 *   isAdmin={true} 
 * />
 */
const GalleryGrid = ({ images = [], isAdmin = false, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div key={image.id} className="group relative rounded-card overflow-hidden bg-surface-container-low border border-surface-container-highest aspect-square">
          <img 
            src={image.imageUrl || `https://ui-avatars.com/api/?name=${image.eventName}&background=f4a261&color=fff&size=512`} 
            alt={image.title || image.eventName} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-inverse-surface/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-inverse-onSurface text-sm">
            <h4 className="font-semibold truncate text-base">{image.eventName}</h4>
            {image.title && <p className="truncate opacity-90">{image.title}</p>}
            {image.description && <p className="truncate opacity-75 text-xs mt-1">{image.description}</p>}
            {image.uploadedAt && (
              <p className="opacity-60 text-xs mt-2">
                {new Date(image.uploadedAt).toLocaleDateString('en-US')}
              </p>
            )}
            
            <div className="flex gap-2 mt-4">
              <a 
                href={image.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-surface/20 hover:bg-surface/40 p-2 rounded-button backdrop-blur-sm transition-colors flex-grow flex justify-center"
                title="View Full"
              >
                <ExternalLink size={18} />
              </a>
              
              {isAdmin && (
                <button 
                  className="bg-error/80 hover:bg-error text-error-on p-2 rounded-button backdrop-blur-sm transition-colors"
                  onClick={() => onDelete && onDelete(image)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
