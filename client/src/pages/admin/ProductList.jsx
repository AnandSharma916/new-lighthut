import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  X,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Link as LinkIcon,
  Sparkles,
  Star,
  SlidersHorizontal,
  Upload,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';
import { productService, categoryService, uploadService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { CategorySelectorWithOptions } from '../../components/admin/CategorySelectorWithOptions';

const PRESET_MEDIA_OPTIONS = [
  { label: 'Chandelier Default (/categories/chandelier.jpg)', url: '/categories/chandelier.jpg' },
  { label: 'Wall Light Default (/categories/wall.jpg)', url: '/categories/wall.jpg' },
  { label: 'Ceiling Light Default (/categories/ceiling.jpg)', url: '/categories/ceiling.jpg' },
  { label: 'Outdoor Light Default (/categories/outdoor.jpg)', url: '/categories/outdoor.jpg' },
  { label: 'Commercial Light Default (/categories/commercial.jpg)', url: '/categories/commercial.jpg' },
  { label: 'Pendant / Hanging Light (/categories/hanging.jpg)', url: '/categories/hanging.jpg' },
  { label: 'Grand Palace Staircase Chandelier (/philosophy-grand-chandelier.jpg)', url: '/philosophy-grand-chandelier.jpg' },
  { label: 'Craft Workshop (/craft-main.jpg)', url: '/craft-main.jpg' },
  { label: 'Showroom Hero Gallery (/showroom-hero-hd.jpg)', url: '/showroom-hero-hd.jpg' },
];

export const ProductList = () => {
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deletion Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Add / Edit Modal with Specifications & Multi-Image Gallery
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');

  // Media Library & Browser Direct Upload
  const [mediaLibraryItems, setMediaLibraryItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [browserUploading, setBrowserUploading] = useState(false);
  const browseInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    subcategoryName: '',
    description: '',
    price: '',
    images: [], // array of { url, isCover, alt }
    specifications: {
      dimensions: '',
      wattage: '',
      colorTemperature: '',
      finish: '',
      material: '',
      voltage: '',
      ipRating: '',
      installationType: '',
    },
    customSpecs: [], // array of { key: '', value: '' }
  });

  // Load Categories for background assignment & dropdown options
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories({ admin: 'true' });
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch Products for Catalog
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search: searchTerm || undefined,
        admin: 'true',
        sort: '-createdAt',
      };

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || res.pagination?.pages || 1);
        setTotalCount(res.total || res.pagination?.total || 0);
      }
    } catch (err) {
      addToast('Failed to load catalog products.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, addToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  // Open Modal to Add New Product
  const handleOpenAdd = () => {
    const defaultCat = categories[0]?._id || '';
    setEditingProduct(null);
    setForm({
      name: '',
      category: defaultCat,
      subcategory: '',
      subcategoryName: '',
      description: '',
      price: '',
      images: [],
      specifications: {
        dimensions: '',
        wattage: '',
        colorTemperature: '',
        finish: '',
        material: '',
        voltage: '',
        ipRating: '',
        installationType: '',
      },
      customSpecs: [],
    });
    setManualImageUrl('');
    setModalOpen(true);
  };

  // Open Modal to Edit Product
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);

    // Collect all product images into structured gallery items
    const productImages = [];
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      prod.images.forEach((img, idx) => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) {
          productImages.push({
            url,
            isCover: typeof img === 'object' ? Boolean(img.isCover) : idx === 0,
            alt: typeof img === 'object' ? (img.alt || prod.name) : prod.name,
          });
        }
      });
    } else if (prod.mainImage) {
      productImages.push({
        url: prod.mainImage,
        isCover: true,
        alt: prod.name || 'Cover Photo',
      });
    }

    if (productImages.length > 0 && !productImages.some((img) => img.isCover)) {
      productImages[0].isCover = true;
    }

    // Standard specs keys
    const knownKeys = [
      'dimensions',
      'wattage',
      'colorTemperature',
      'finish',
      'material',
      'voltage',
      'ipRating',
      'installationType',
    ];

    const specs = prod.specifications || {};
    const standardSpecs = {
      dimensions: specs.dimensions || prod.dimensions || prod.size || '',
      wattage: specs.wattage || '',
      colorTemperature: specs.colorTemperature || '',
      finish: specs.finish || '',
      material: specs.material || '',
      voltage: specs.voltage || '',
      ipRating: specs.ipRating || '',
      installationType: specs.installationType || '',
    };

    // Extract any extra custom specifications
    const customSpecs = [];
    if (specs && typeof specs === 'object') {
      Object.entries(specs).forEach(([k, v]) => {
        if (!knownKeys.includes(k) && v && typeof v === 'string') {
          customSpecs.push({ key: k, value: v });
        }
      });
    }

    setForm({
      name: prod.name || prod.title || '',
      category: prod.category?._id || prod.category || categories[0]?._id || '',
      subcategory: prod.subcategory || '',
      subcategoryName: prod.subcategoryName || '',
      description: prod.description || prod.shortDescription || '',
      price: prod.price !== undefined && prod.price !== null ? prod.price : '',
      images: productImages,
      specifications: standardSpecs,
      customSpecs,
    });
    setManualImageUrl('');
    setModalOpen(true);
  };

  // Multiple Image Helpers
  const handleAddImageUrl = () => {
    if (!manualImageUrl.trim()) return;
    const urls = manualImageUrl
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) return;

    setForm((prev) => {
      const current = [...(prev.images || [])];
      urls.forEach((url) => {
        if (!current.some((img) => img.url === url)) {
          current.push({
            url,
            isCover: current.length === 0,
            alt: prev.name.trim() || 'Product Photo',
          });
        }
      });
      return { ...prev, images: current };
    });
    setManualImageUrl('');
    addToast(`${urls.length} photo(s) added!`, 'info');
  };

  const handleUploadImagesSuccess = (uploaded) => {
    const urls = Array.isArray(uploaded) ? uploaded : [uploaded];
    setForm((prev) => {
      const current = [...(prev.images || [])];
      urls.forEach((url) => {
        if (url && !current.some((img) => img.url === url)) {
          current.push({
            url,
            isCover: current.length === 0,
            alt: prev.name.trim() || 'Product Photo',
          });
        }
      });
      return { ...prev, images: current };
    });
  };

  const handleSetCoverImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).map((img, idx) => ({
        ...img,
        isCover: idx === index,
      })),
    }));
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const remaining = (prev.images || []).filter((_, idx) => idx !== index);
      if (remaining.length > 0 && !remaining.some((img) => img.isCover)) {
        remaining[0].isCover = true;
      }
      return { ...prev, images: remaining };
    });
  };

  // Load media library assets from server
  const loadMediaLibrary = useCallback(async () => {
    try {
      setLoadingMedia(true);
      const res = await uploadService.getMediaLibrary({ limit: 100 });
      if (res && res.success) {
        setMediaLibraryItems(res.files || res.media || []);
      }
    } catch (err) {
      console.warn('[ProductList] Could not load media library:', err.message);
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    if (modalOpen) {
      loadMediaLibrary();
    }
  }, [modalOpen, loadMediaLibrary]);

  // Collect all unique images used across existing products
  const existingProductPhotos = useMemo(() => {
    const urls = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.images)) {
        p.images.forEach((img) => {
          const u = typeof img === 'string' ? img : img?.url;
          if (u) urls.add(u);
        });
      }
      if (p.mainImage) urls.add(p.mainImage);
    });
    return Array.from(urls);
  }, [products]);

  // Handle direct file selection from browser / PC
  const handleNativeFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        addToast(`"${file.name}" exceeds the 10MB limit.`, 'error');
        return;
      }
    }

    try {
      setBrowserUploading(true);
      let uploadedUrls = [];

      if (files.length > 1) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        try {
          const res = await uploadService.uploadMultiple(formData);
          if (res && res.success && res.files && res.files.length > 0) {
            uploadedUrls = res.files.map((f) => f.url);
          }
        } catch (multiErr) {
          console.warn('Batch upload fallback:', multiErr);
        }
      }

      if (uploadedUrls.length === 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await uploadService.uploadSingle(formData);
          if (res && res.success && res.file && res.file.url) {
            uploadedUrls.push(res.file.url);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        handleUploadImagesSuccess(uploadedUrls);
        addToast(`${uploadedUrls.length} photo(s) uploaded successfully from computer!`, 'success');
        loadMediaLibrary();
      } else {
        addToast('No images were uploaded.', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload selected images.', 'error');
    } finally {
      setBrowserUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Add selected image from Media dropdown into product gallery
  const handleAddFromMediaDropdown = () => {
    if (!selectedMediaUrl) {
      addToast('Please select an image from the dropdown first.', 'warning');
      return;
    }
    const url = selectedMediaUrl.trim();
    setForm((prev) => {
      const current = [...(prev.images || [])];
      if (!current.some((img) => img.url === url)) {
        current.push({
          url,
          isCover: current.length === 0,
          alt: prev.name.trim() || 'Product Photo',
        });
        addToast('Media image added to gallery!', 'success');
      } else {
        addToast('This image is already in the gallery.', 'info');
      }
      return { ...prev, images: current };
    });
    setSelectedMediaUrl('');
  };

  // Specifications Helpers
  const handleSpecChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleAddCustomSpec = () => {
    setForm((prev) => ({
      ...prev,
      customSpecs: [...(prev.customSpecs || []), { key: '', value: '' }],
    }));
  };

  const handleCustomSpecChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...(prev.customSpecs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customSpecs: updated };
    });
  };

  const handleRemoveCustomSpec = (index) => {
    setForm((prev) => ({
      ...prev,
      customSpecs: (prev.customSpecs || []).filter((_, i) => i !== index),
    }));
  };

  // Save Product (Category, Subcategory, Name, Description, Price, Multi-Photos, Specifications)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      addToast('Please enter the Product Heading / Name.', 'error');
      return;
    }

    try {
      setSavingProduct(true);

      const chosenCatId = form.category || categories[0]?._id;

      // Handle images: ensure valid array and valid cover image
      const validImages = (form.images || []).filter((img) => img.url && img.url.trim());
      if (validImages.length > 0 && !validImages.some((img) => img.isCover)) {
        validImages[0].isCover = true;
      }

      const coverImg =
        validImages.find((img) => img.isCover)?.url ||
        validImages[0]?.url ||
        '/categories/chandelier.jpg';

      // Compile specifications
      const compiledSpecs = {
        dimensions: form.specifications.dimensions?.trim() || '',
        wattage: form.specifications.wattage?.trim() || '',
        colorTemperature: form.specifications.colorTemperature?.trim() || '',
        finish: form.specifications.finish?.trim() || '',
        material: form.specifications.material?.trim() || '',
        voltage: form.specifications.voltage?.trim() || '',
        ipRating: form.specifications.ipRating?.trim() || '',
        installationType: form.specifications.installationType?.trim() || '',
      };

      (form.customSpecs || []).forEach((cs) => {
        if (cs.key && cs.key.trim() && cs.value && cs.value.trim()) {
          compiledSpecs[cs.key.trim()] = cs.value.trim();
        }
      });

      const payload = {
        name: form.name.trim(),
        title: form.name.trim(),
        category: chosenCatId,
        subcategory: (form.subcategory || '').trim().toLowerCase(),
        subcategoryName: (form.subcategoryName || '').trim(),
        description: form.description.trim(),
        shortDescription: form.description.trim().slice(0, 160),
        price: form.price !== '' ? Number(form.price) : 0,
        mainImage: coverImg,
        images: validImages.length > 0 ? validImages : [{ url: coverImg, isCover: true, alt: form.name.trim() }],
        specifications: compiledSpecs,
        isPublished: true,
      };

      if (editingProduct) {
        const res = await productService.updateProduct(editingProduct._id, payload);
        if (res.success) {
          addToast('Product updated successfully with specifications and gallery!', 'success');
        }
      } else {
        const res = await productService.createProduct(payload);
        if (res.success) {
          addToast('Product added to catalog successfully!', 'success');
        }
      }

      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      addToast(err.response?.data?.message || 'Error saving product.', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteClick = (prod) => {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setActionLoading(true);
      const res = await productService.deleteProduct(productToDelete._id);
      if (res.success) {
        addToast('Product removed from catalog.', 'success');
        setDeleteModalOpen(false);
        setProductToDelete(null);
        await loadProducts();
      }
    } catch (err) {
      addToast('Failed to delete product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── TOP HEADER: CLEAN & SIMPLE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111318] border border-white/10 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Storefront Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tracking-wide">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Simple management for your products. Add and update product heading name, description, price, and photos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-gold px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all hover:scale-102 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* ── SEARCH & COUNT BAR ── */}
      <div className="bg-[#14171d] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product by heading name..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="text-xs text-neutral-400 font-medium">
          Total Products in Catalog: <strong className="text-white font-mono text-sm">{totalCount}</strong>
        </div>
      </div>

      {/* ── PRODUCTS TABLE: ONLY PHOTO, NAME, PRICE, DESCRIPTION, ACTIONS ── */}
      <div className="bg-[#14171d] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin" />
            <span className="text-xs text-neutral-400">Loading catalog products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Package className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-serif-luxury font-bold text-white">No Products Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              No products match your search. Click below to add your first product.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/30 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-4 px-4 w-20">Photo</th>
                  <th className="py-4 px-4">Heading Name</th>
                  <th className="py-4 px-4">Category & Subcategory</th>
                  <th className="py-4 px-4 w-32">Price (₹)</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => {
                  const coverImg =
                    prod.mainImage ||
                    prod.images?.find((img) => img.isCover)?.url ||
                    prod.images?.[0]?.url ||
                    (typeof prod.images?.[0] === 'string' ? prod.images[0] : '') ||
                    '/categories/chandelier.jpg';

                  const priceDisplay =
                    prod.price > 0 ? `₹${Number(prod.price).toLocaleString('en-IN')}` : '₹0';

                  const descSnippet =
                    prod.description || prod.shortDescription || 'No description provided';

                  return (
                    <tr key={prod._id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* 1. Photo */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-14 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                          <img
                            src={coverImg}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/categories/chandelier.jpg';
                            }}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </td>

                      {/* 2. Heading Name */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="font-serif-luxury font-bold text-white hover:text-[#DC2626] transition-colors text-sm text-left block cursor-pointer"
                        >
                          {prod.name || prod.title}
                        </button>
                        <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                          SKU: {prod.sku || 'Auto'}
                        </span>
                      </td>

                      {/* 3. Category & Subcategory Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                            <span className="truncate max-w-[140px]">{prod.category?.name || 'Category'}</span>
                          </span>
                          {prod.subcategoryName || prod.subcategory ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 w-fit font-mono">
                              ↳ {prod.subcategoryName || prod.subcategory}
                            </span>
                          ) : (
                            <span className="text-[9.5px] text-neutral-500 italic">General / Direct</span>
                          )}
                        </div>
                      </td>

                      {/* 4. Product Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#DC2626] text-sm">
                        {priceDisplay}
                      </td>

                      {/* 4. Product Description */}
                      <td className="py-3.5 px-4 text-neutral-300 max-w-md">
                        <p className="line-clamp-2 leading-relaxed text-xs">
                          {descSnippet}
                        </p>
                      </td>

                      {/* 5. Actions (Edit & Delete) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(prod)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {prod.slug && (
                            <Link
                              to={`/product/${prod.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                              title="View on Live Storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EXPANDED MODAL: SCROLLABLE, SPECIFICATIONS COLUMNS & MULTI-IMAGE GALLERY ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
          <div className="bg-[#14171d] border border-white/15 rounded-2xl w-full max-w-3xl lg:max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header (Fixed / Sticky) */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#14171d] shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-0.5">
                  Luminaire Catalog Editor
                </span>
                <h3 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                  {editingProduct ? 'Edit Product & Specifications' : 'Add New Product to Catalog'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Configure primary identity, architectural parameters & specifications, and multi-image gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1 divide-y divide-white/5">
                {/* ── SECTION 1: PRIMARY IDENTITY & CATEGORIZATION ── */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    <Package className="w-4 h-4 text-[#DC2626]" />
                    <span>Basic Product Identity</span>
                  </div>

                  {/* 1. Heading Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                      Product Heading Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Royal Waterfall Crystal Chandelier"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-sm font-medium"
                    />
                  </div>

                  {/* 2. Category & Subcategory Selection */}
                  <CategorySelectorWithOptions
                    categories={categories}
                    selectedCategoryId={form.category}
                    onSelectCategory={(catId) => {
                      setForm((prev) => ({
                        ...prev,
                        category: catId,
                        subcategory: '',
                        subcategoryName: '',
                      }));
                    }}
                    selectedSubcategory={form.subcategory}
                    onSelectSubcategory={(subSlug, subName) => {
                      setForm((prev) => ({
                        ...prev,
                        subcategory: subSlug,
                        subcategoryName: subName,
                      }));
                    }}
                    onCategoriesChanged={async () => {
                      try {
                        const res = await categoryService.getCategories({ admin: 'true' });
                        if (res.success && res.categories) {
                          setCategories(res.categories);
                          return res.categories;
                        }
                      } catch (err) {
                        console.error(err);
                      }
                      return [];
                    }}
                  />

                  {/* 3. Product Price & Description Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Price Input */}
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          placeholder="e.g. 14999"
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-sm font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400">MRP in Indian Rupees.</p>
                    </div>

                    {/* Product Description */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                        Product Architectural Description
                      </label>
                      <textarea
                        rows={2}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="e.g. Elegant handcrafted crystal fixture with golden canopy. Ideal for dining and living spaces."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs leading-relaxed resize-y"
                      />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 2: TECHNICAL SPECIFICATIONS (COLUMNS + DYNAMIC) ── */}
                <div className="pt-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      <Sparkles className="w-4 h-4 text-[#DC2626]" />
                      <span>Product Technical Specifications</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      Displayed in architectural specs table on product page
                    </span>
                  </div>

                  {/* Standard Specification Columns (4-column on desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* 1. Dimensions / Size */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Dimensions / Size
                      </label>
                      <input
                        type="text"
                        value={form.specifications.dimensions}
                        onChange={(e) => handleSpecChange('dimensions', e.target.value)}
                        placeholder="e.g. Dia: 600mm, H: 800mm"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 2. Wattage */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Wattage / Power
                      </label>
                      <input
                        type="text"
                        value={form.specifications.wattage}
                        onChange={(e) => handleSpecChange('wattage', e.target.value)}
                        placeholder="e.g. 48W LED / E27 Socket"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 3. Color Temperature */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Color Temp (CCT)
                      </label>
                      <input
                        type="text"
                        value={form.specifications.colorTemperature}
                        onChange={(e) => handleSpecChange('colorTemperature', e.target.value)}
                        placeholder="e.g. 3000K Warm / 3-in-1 CCT"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 4. Finish / Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Finish / Color
                      </label>
                      <input
                        type="text"
                        value={form.specifications.finish}
                        onChange={(e) => handleSpecChange('finish', e.target.value)}
                        placeholder="e.g. Brushed Brass / Matte Black"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 5. Material */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Primary Material
                      </label>
                      <input
                        type="text"
                        value={form.specifications.material}
                        onChange={(e) => handleSpecChange('material', e.target.value)}
                        placeholder="e.g. Die-cast Aluminum & K9 Crystal"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 6. Voltage */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Input Voltage
                      </label>
                      <input
                        type="text"
                        value={form.specifications.voltage}
                        onChange={(e) => handleSpecChange('voltage', e.target.value)}
                        placeholder="e.g. AC 220-240V, 50Hz"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 7. IP Rating */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        IP Rating
                      </label>
                      <input
                        type="text"
                        value={form.specifications.ipRating}
                        onChange={(e) => handleSpecChange('ipRating', e.target.value)}
                        placeholder="e.g. IP20 (Indoor) / IP65"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>

                    {/* 8. Installation Type */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                        Installation Type
                      </label>
                      <input
                        type="text"
                        value={form.specifications.installationType}
                        onChange={(e) => handleSpecChange('installationType', e.target.value)}
                        placeholder="e.g. Ceiling Pendant / Surface"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                      />
                    </div>
                  </div>

                  {/* Dynamic Custom Specifications List */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Custom Parameters / Extra Specifications ({form.customSpecs.length}):
                      </span>
                      <button
                        type="button"
                        onClick={handleAddCustomSpec}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Custom Spec</span>
                      </button>
                    </div>

                    {form.customSpecs.length > 0 && (
                      <div className="space-y-2">
                        {form.customSpecs.map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => handleCustomSpecChange(idx, 'key', e.target.value)}
                              placeholder="Spec Label (e.g. Beam Angle, CRI)"
                              className="w-1/2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => handleCustomSpecChange(idx, 'value', e.target.value)}
                              placeholder="Spec Value (e.g. 120°, Ra > 90)"
                              className="w-1/2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomSpec(idx)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors shrink-0"
                              title="Remove specification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SECTION 3: PRODUCT PHOTOS & MULTI-IMAGE GALLERY ── */}
                <div className="pt-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      <ImageIcon className="w-4 h-4 text-[#DC2626]" />
                      <span>Product Photos & Multi-Image Gallery</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {form.images?.length || 0} Photo(s) Attached
                    </span>
                  </div>

                  {/* Hidden browser file picker input */}
                  <input
                    ref={browseInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleNativeFileSelect}
                  />

                  {/* ── 3 Clear Ways to Add Photos ── */}
                  <div className="space-y-3.5">
                    
                    {/* WAY 1: Direct Browser File Selection & Upload */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-[#DC2626]" />
                            <span>1. Select & Upload from Browser / PC</span>
                          </span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Browse single or multiple images directly from your computer to upload
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => browseInputRef.current?.click()}
                          disabled={browserUploading}
                          className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#DC2626]/20 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
                        >
                          {browserUploading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading from PC...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Browse Photos from PC</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* WAY 2: Select from Media Images Dropdown */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>2. Select from Media Images (Dropdown)</span>
                        </span>
                        <button
                          type="button"
                          onClick={loadMediaLibrary}
                          disabled={loadingMedia}
                          title="Refresh Media List"
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${loadingMedia ? 'animate-spin text-[#DC2626]' : ''}`} />
                          <span>Refresh Media</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <select
                            value={selectedMediaUrl}
                            onChange={(e) => setSelectedMediaUrl(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-[#DC2626] text-xs truncate"
                          >
                            <option value="">-- Choose an Image from Media Dropdown --</option>
                            {mediaLibraryItems.length > 0 && (
                              <optgroup label={`📁 Server Uploaded Media (${mediaLibraryItems.length})`}>
                                {mediaLibraryItems.map((item, idx) => (
                                  <option key={item._id || idx} value={item.url}>
                                    {item.originalName || item.filename || item.url}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            <optgroup label="✨ Preset Category & Showroom Images">
                              {PRESET_MEDIA_OPTIONS.map((opt, idx) => (
                                <option key={idx} value={opt.url}>
                                  {opt.label}
                                </option>
                              ))}
                            </optgroup>
                            {existingProductPhotos.length > 0 && (
                              <optgroup label={`🛍️ Existing Product Images (${existingProductPhotos.length})`}>
                                {existingProductPhotos.map((url, idx) => (
                                  <option key={idx} value={url}>
                                    {url}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>

                        {selectedMediaUrl && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black self-center">
                            <img
                              src={selectedMediaUrl}
                              alt="Selected Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleAddFromMediaDropdown}
                          disabled={!selectedMediaUrl}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Gallery</span>
                        </button>
                      </div>
                    </div>

                    {/* WAY 3: Paste Direct URL */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <span className="text-[11px] uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>3. Add by Image URL(s)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={manualImageUrl}
                            onChange={(e) => setManualImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            placeholder="Paste URL(s): e.g. https://i.postimg.cc/... or /categories/wall.jpg"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        💡 Tip: Direct links from <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-[#DC2626] hover:underline font-semibold">Postimages.org</a>, ImgBB, or Cloudinary save 0 MB server storage.
                      </p>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div>
                      <details className="text-xs text-neutral-400 group">
                        <summary className="cursor-pointer hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                          <span>Or drag & drop photo files</span>
                          <span className="text-[10px] text-neutral-500">(bulk drag and drop box)</span>
                        </summary>
                        <div className="mt-2.5">
                          <ImageUploader
                            multiple={true}
                            label="Drag & Drop image file(s) here"
                            onUploadSuccess={handleUploadImagesSuccess}
                          />
                        </div>
                      </details>
                    </div>

                  </div>

                  {/* Visual Gallery Grid Preview */}
                  <div className="pt-2">
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center justify-between">
                      <span>Photo Gallery ({form.images?.length || 0}):</span>
                      {form.images?.length > 1 && (
                        <span className="text-[10px] text-neutral-400 font-normal">
                          Click "Cover" on any photo to make it the primary thumbnail
                        </span>
                      )}
                    </div>

                    {form.images?.length === 0 ? (
                      <div className="p-6 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-xs text-neutral-400">
                        <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2 opacity-50" />
                        <p>No photos attached yet.</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Paste image URLs above or upload from your computer.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {form.images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden bg-black border transition-all group aspect-square flex flex-col justify-between ${
                              img.isCover
                                ? 'border-[#DC2626] ring-2 ring-[#DC2626]/30'
                                : 'border-white/15 hover:border-white/30'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.alt || `Product photo ${idx + 1}`}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/categories/chandelier.jpg';
                              }}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {img.isCover && (
                              <div className="absolute top-1.5 left-1.5 bg-[#DC2626] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                                Cover Photo
                              </div>
                            )}

                            {/* Action overlay */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              {!img.isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(idx)}
                                  className="px-2 py-1 rounded bg-white/20 hover:bg-[#DC2626] text-white text-[10px] font-semibold transition-colors flex items-center gap-1"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>Make Cover</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="px-2 py-1 rounded bg-red-500/30 hover:bg-red-600 text-white text-[10px] font-semibold transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Fixed / Sticky) */}
              <div className="px-6 py-3.5 border-t border-white/10 bg-[#0e1014] flex items-center justify-between shrink-0">
                <div className="text-[11px] text-neutral-400">
                  <span className="font-semibold text-white">{form.images?.length || 0}</span> photos •{' '}
                  <span className="font-semibold text-white">
                    {Object.values(form.specifications).filter(Boolean).length + form.customSpecs.filter((s) => s.key && s.value).length}
                  </span>{' '}
                  specifications
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={savingProduct}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="btn-gold px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {savingProduct ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product?"
        message={`Are you sure you want to remove "${productToDelete?.name || productToDelete?.title || 'this product'}" from the catalog?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};
