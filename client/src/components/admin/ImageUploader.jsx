import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ImageUploader = ({ onUploadSuccess, label = 'Upload Images', multiple = false }) => {
  const { addToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    // Validate size (max 10MB per file)
    for (const file of fileList) {
      if (file.size > 10 * 1024 * 1024) {
        addToast(`"${file.name}" exceeds the 10MB limit.`, 'error');
        return;
      }
    }

    try {
      setUploading(true);
      if (multiple && fileList.length > 1) {
        const formData = new FormData();
        fileList.forEach((file) => formData.append('files', file));
        try {
          const data = await uploadService.uploadMultiple(formData);
          if (data.success && data.files && data.files.length > 0) {
            addToast(`${data.files.length} photos uploaded successfully!`, 'success');
            if (onUploadSuccess) {
              onUploadSuccess(data.files.map((f) => f.url), data.files);
            }
            return;
          }
        } catch (multiErr) {
          // If bulk route fails, fall back to individual uploads below
        }
      }

      // Upload sequentially
      const uploadedUrls = [];
      const uploadedDocs = [];
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);
        const data = await uploadService.uploadSingle(formData);
        if (data.success && data.file) {
          uploadedUrls.push(data.file.url);
          uploadedDocs.push(data.file);
        }
      }

      if (uploadedUrls.length > 0) {
        addToast(
          uploadedUrls.length === 1
            ? 'Photo uploaded successfully!'
            : `${uploadedUrls.length} photos uploaded successfully!`,
          'success'
        );
        if (onUploadSuccess) {
          if (multiple) {
            onUploadSuccess(uploadedUrls, uploadedDocs);
          } else {
            onUploadSuccess(uploadedUrls[0], uploadedDocs[0]);
          }
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#DC2626] bg-[#DC2626]/5'
            : 'border-white/10 hover:border-[#DC2626]/50 bg-black/20'
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-2.5">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin mb-1" />
          ) : (
            <UploadCloud className="w-8 h-8 text-[#DC2626] mb-1 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-semibold text-white uppercase tracking-luxury">
            {uploading ? 'Uploading to Server...' : label}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#DC2626]/15 hover:bg-[#DC2626]/25 text-[#DC2626] border border-[#DC2626]/40 text-xs font-semibold shadow-sm transition-all">
            <span>📁 Browse File from PC</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Click to choose or drag & drop image file directly here (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
};
