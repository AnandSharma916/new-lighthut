import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getProductImage,
  getProductFormOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  togglePublish,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
// Dropdown options for selecting which category & subcategory to put products into
router.get('/form-options', getProductFormOptions);
router.get('/options', getProductFormOptions);

// Public Image binary stream with immutable CDN caching
router.get('/:id/image/:imageIndex', getProductImage);
router.get('/:id/image', getProductImage);

router.get('/:slug', getProductBySlug);

// Protected Admin Routes
router.get('/id/:id', protectAdmin, getProductById);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.post('/:id/duplicate', protectAdmin, duplicateProduct);
router.patch('/:id/toggle-publish', protectAdmin, togglePublish);

export default router;
