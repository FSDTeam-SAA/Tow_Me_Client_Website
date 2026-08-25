import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import './ImagePlaceholder.css';

/**
 * ImagePlaceholder Component
 * --------------------------
 * Use this placeholder for any image container slot.
 * When you provide your images later, replace this component or pass an image URL prop.
 */
export default function ImagePlaceholder({ 
  src, 
  alt = 'Image Placeholder', 
  height = '100%', 
  width = '100%',
  className = '',
  label = 'מקומות לתמונה (Image Slot)' 
}) {
  if (src) {
    return <img src={src} alt={alt} className={`real-image ${className}`} style={{ width, height, objectFit: 'cover' }} />;
  }

  return (
    <div 
      className={`image-placeholder-box ${className}`} 
      style={{ width, height }}
      title="Insert Image Here"
    >
      <div className="placeholder-content">
        <ImageIcon className="placeholder-icon" />
        <span className="placeholder-label">{label}</span>
        <span className="placeholder-subtext">[ הכנס תמונה כאן / Put Image Here ]</span>
      </div>
    </div>
  );
}
