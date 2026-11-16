import fs from 'fs';
import path from 'path';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import ProductImage from '../models/ProductImage.js';

// @desc    Upload single file (image or pdf)
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a valid file.',
      });
    }

    let fileUrl = '';
    let publicId = '';

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'lighthut',
        resource_type: 'auto',
      });
      fileUrl = result.secure_url;
      publicId = result.public_id;

      // Delete local temporary file after uploading to Cloudinary
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } else {
      // Ephemeral disk immunity: for images under 5MB, generate a permanent Base64 data URL
      // so the image NEVER 404s when Render/serverless container restarts or sleeps
      const isImage = req.file.mimetype && req.file.mimetype.startsWith('image/');
      if (isImage && req.file.size <= 5 * 1024 * 1024 && fs.existsSync(req.file.path)) {
        const fileBuffer = fs.readFileSync(req.file.path);
        fileUrl = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      } else {
        fileUrl = `/uploads/${req.file.filename}`;
      }
      publicId = req.file.filename;
    }

    // Save image reference in ProductImage media library collection
    const mediaDoc = await ProductImage.create({
      url: fileUrl,
      publicId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      alt: req.body.alt || req.file.originalname.split('.')[0],
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      file: {
        id: mediaDoc._id,
        url: fileUrl,
        publicId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        alt: mediaDoc.alt,
      },
    });
  } catch (error) {
    // Clean up local file on failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      let fileUrl = '';
      let publicId = '';

      if (isCloudinaryConfigured) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'lighthut',
          resource_type: 'auto',
        });
        fileUrl = result.secure_url;
        publicId = result.public_id;

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else {
        // Ephemeral disk immunity: for images under 5MB, generate a permanent Base64 data URL
        const isImage = file.mimetype && file.mimetype.startsWith('image/');
        if (isImage && file.size <= 5 * 1024 * 1024 && fs.existsSync(file.path)) {
          const fileBuffer = fs.readFileSync(file.path);
          fileUrl = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
        } else {
          fileUrl = `/uploads/${file.filename}`;
        }
        publicId = file.filename;
      }

      const mediaDoc = await ProductImage.create({
        url: fileUrl,
        publicId,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        alt: file.originalname.split('.')[0],
      });

      uploadedFiles.push({
        id: mediaDoc._id,
        url: fileUrl,
        publicId,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully.`,
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get media library images
// @route   GET /api/upload/media
// @access  Private (Admin)
export const getMediaLibrary = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await ProductImage.countDocuments();
    const media = await ProductImage.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);

    res.status(200).json({
      success: true,
      count: media.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
      media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media item
// @route   DELETE /api/upload/media/:id
// @access  Private (Admin)
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await ProductImage.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media file not found.',
      });
    }

    // If Cloudinary publicId exists and Cloudinary is configured
    if (isCloudinaryConfigured && media.publicId && !media.url.startsWith('/uploads/')) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    } else if (media.filename) {
      // Remove from local disk
      const localFilePath = path.resolve('uploads', media.filename);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    }

    await media.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Media item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
