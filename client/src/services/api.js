import axios from 'axios';
import {
  getFallbackCategories,
  getFallbackCategoryBySlug,
  getFallbackProducts,
  getFallbackProductBySlug,
} from '../data/catalogData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage if present as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lighthut_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Allow browser to calculate correct multipart/form-data boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on an admin route, clear local token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('lighthut_admin_token');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('lighthut_admin_token', res.data.token);
    }
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('lighthut_admin_token');
    }
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updatePassword: async (passwords) => {
    const res = await api.put('/auth/update-password', passwords);
    return res.data;
  },
};

// Product Service
export const productService = {
  getProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params });
      if (res.data && res.data.success && Array.isArray(res.data.products)) {
        // When admin requests products or search produces results, always trust backend
        if (params.admin || res.data.products.length > 0) {
          return res.data;
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[Catalog] Backend offline or returned empty, using catalog data:', err.message);
    }
    return getFallbackProducts(params);
  },
  getProductBySlug: async (slug) => {
    try {
      const res = await api.get(`/products/${slug}`);
      if (res.data && res.data.success && res.data.product) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Catalog] Product API offline, using fallback:', err.message);
    }
    return getFallbackProductBySlug(slug);
  },
  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/id/${id}`);
      if (res.data && res.data.success && res.data.product) {
        return res.data;
      }
    } catch (err) {
      // ignore
    }
    return getFallbackProductBySlug(id);
  },
  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },
  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  duplicateProduct: async (id) => {
    const res = await api.post(`/products/${id}/duplicate`);
    return res.data;
  },
  togglePublish: async (id) => {
    const res = await api.patch(`/products/${id}/toggle-publish`);
    return res.data;
  },
  getProductFormOptions: async () => {
    try {
      const res = await api.get('/products/form-options');
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Product Service] Form options error:', err.message);
    }
    return null;
  },
};

// Dedicated Catalog Page Service
export const catalogService = {
  getCatalog: async (params = {}) => {
    try {
      const res = await api.get('/catalog', { params });
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Catalog Service] API notice:', err.message);
    }
    return null;
  },
  getCatalogDropdown: async () => {
    try {
      const res = await api.get('/catalog/dropdown');
      if (res.data && res.data.success && Array.isArray(res.data.categories)) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Catalog Dropdown Service] API notice:', err.message);
    }
    return null;
  },
  getCatalogOptions: async () => {
    try {
      const res = await api.get('/catalog/options');
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Catalog Options Service] API notice:', err.message);
    }
    return null;
  },
};

// Category Service
export const categoryService = {
  getCategories: async (params = {}) => {
    try {
      const res = await api.get('/categories', { params });
      if (res.data && res.data.success && Array.isArray(res.data.categories)) {
        if (params.admin || res.data.categories.length > 0) {
          return res.data;
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[Categories] Backend offline or empty, using catalog data:', err.message);
    }
    return getFallbackCategories();
  },
  getCategoryBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/${slug}`);
      if (res.data && res.data.success && res.data.category) {
        return res.data;
      }
    } catch (err) {
      console.warn('[Categories] Category API offline, using fallback:', err.message);
    }
    return getFallbackCategoryBySlug(slug);
  },
  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },
  updateCategory: async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  },
  renameCategory: async (id, data) => {
    const res = await api.patch(`/categories/${id}/rename`, data);
    return res.data;
  },
  deleteCategory: async (id, force = false) => {
    const res = await api.delete(`/categories/${id}${force ? '?force=true' : ''}`);
    return res.data;
  },
  reorderCategories: async (items) => {
    const res = await api.put('/categories/reorder', { items });
    return res.data;
  },
  addSubcategory: async (categoryId, subcategoryData) => {
    const res = await api.post(`/categories/${categoryId}/subcategories`, subcategoryData);
    return res.data;
  },
  updateSubcategory: async (categoryId, subId, subcategoryData) => {
    const res = await api.put(`/categories/${categoryId}/subcategories/${subId}`, subcategoryData);
    return res.data;
  },
  deleteSubcategory: async (categoryId, subId) => {
    const res = await api.delete(`/categories/${categoryId}/subcategories/${subId}`);
    return res.data;
  },
};

// Homepage CMS Service
export const homepageService = {
  getHomepage: async () => {
    try {
      const res = await api.get('/homepage');
      return res.data;
    } catch (err) {
      console.warn('[Homepage API] Failed or offline, using default sections:', err.message);
      return { success: false, sections: [] };
    }
  },
  getAllSections: async () => {
    const res = await api.get('/homepage/sections');
    return res.data;
  },
  updateSection: async (id, sectionData) => {
    const res = await api.put(`/homepage/sections/${id}`, sectionData);
    return res.data;
  },
  reorderSections: async (orderedIds) => {
    const res = await api.put('/homepage/sections/reorder', { orderedIds });
    return res.data;
  },
};

// Settings Service
export const settingsService = {
  getSettings: async () => {
    try {
      const res = await api.get('/settings');
      return res.data;
    } catch (err) {
      console.warn('[Settings API] Failed or offline, using fallback:', err.message);
      return { success: false };
    }
  },
  updateSettings: async (settingsData) => {
    const res = await api.put('/settings', settingsData);
    return res.data;
  },
};

// Inquiry Service
export const inquiryService = {
  createInquiry: async (inquiryData) => {
    const res = await api.post('/inquiries', inquiryData);
    return res.data;
  },
  getInquiries: async (params = {}) => {
    const res = await api.get('/inquiries', { params });
    return res.data;
  },
  updateInquiry: async (id, updateData) => {
    const res = await api.put(`/inquiries/${id}`, updateData);
    return res.data;
  },
  deleteInquiry: async (id) => {
    const res = await api.delete(`/inquiries/${id}`);
    return res.data;
  },
};

// Media / Upload Service
export const uploadService = {
  uploadSingle: async (formData) => {
    const res = await api.post('/upload', formData);
    return res.data;
  },
  uploadMultiple: async (formData) => {
    const res = await api.post('/upload/multiple', formData);
    return res.data;
  },
  getMediaLibrary: async (params = {}) => {
    const res = await api.get('/upload/media', { params });
    return res.data;
  },
  deleteMedia: async (id) => {
    const res = await api.delete(`/upload/media/${id}`);
    return res.data;
  },
};

export default api;
