import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { compressImageFile } from '../../utils/imageCompressor';

export const ImageUploader = ({ onUploadSuccess, label = 'Upload Images', multiple = false }) => {
  const { addToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    try {
      setUploading(true);

      // STEP 1: Immediately compress to Base64 data URLs for instant preview
      const compressedResults = await Promise.all(
        fileList.map((file) => compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 }))
      );

      const base64Urls = compressedResults.map((r) => r.dataUrl);

      // Immediately notify parent with lightweight Base64 URLs so user sees preview without 404 risk
      if (onUploadSuccess) {
        if (multiple) {
          onUploadSuccess(base64Urls);
        } else {
          onUploadSuccess(base64Urls[0]);
        }
      }

      // STEP 2: Background upload to server
      if (multiple && fileList.length > 1) {
        const formData = new FormData();
        compressedResults.forEach((r) => formData.append('files', r.file));
        try {
          const data = await uploadService.uploadMultiple(formData);
          if (data.success && data.files && data.files.length > 0) {
            addToast(`${data.files.length} photo(s) stored in media library!`, 'success');
            if (onUploadSuccess) {
              onUploadSuccess(data.files.map((f) => f.url), data.files);
            }
            return;
          }
        } catch (multiErr) {
          // If bulk route fails, fall back to sequential upload below
        }
      }

      // Upload sequentially
      const uploadedUrls = [];
      const uploadedDocs = [];
      for (const res of compressedResults) {
        const formData = new FormData();
        formData.append('file', res.file);
        try {
          const data = await uploadService.uploadSingle(formData);
          if (data.success && data.file) {
            uploadedUrls.push(data.file.url);
            uploadedDocs.push(data.file);
          }
        } catch (singleErr) {
          console.warn('Single file upload warning:', singleErr.message);
        }
      }

      if (uploadedUrls.length > 0) {
        addToast(
          uploadedUrls.length === 1
            ? 'Photo saved to media library!'
            : `${uploadedUrls.length} photos saved to media library!`,
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
      console.error('[ImageUploader] Processing error:', err);
      addToast(err.response?.data?.message || 'Error processing image file.', 'error');
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
