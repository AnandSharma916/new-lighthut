import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { productService, categoryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { CategorySelectorWithOptions } from '../../components/admin/CategorySelectorWithOptions';

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

  // Simple Add / Edit Modal (Category, Subcategory, Heading Name, Description, Price, Photo)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    subcategoryName: '',
    description: '',
    price: '',
    photo: '/categories/chandelier.jpg',
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
      photo: '/categories/chandelier.jpg',
    });
    setModalOpen(true);
  };

  // Open Modal to Edit Product
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const cover =
      prod.mainImage ||
      prod.images?.find((img) => img.isCover)?.url ||
      prod.images?.[0]?.url ||
      (typeof prod.images?.[0] === 'string' ? prod.images[0] : '') ||
      '/categories/chandelier.jpg';

    setForm({
      name: prod.name || prod.title || '',
      category: prod.category?._id || prod.category || categories[0]?._id || '',
      subcategory: prod.subcategory || '',
      subcategoryName: prod.subcategoryName || '',
      description: prod.description || prod.shortDescription || '',
      price: prod.price !== undefined && prod.price !== null ? prod.price : '',
      photo: cover,
    });
    setModalOpen(true);
  };

  // Save Product (Category, Subcategory, Name, Description, Price, Photo)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      addToast('Please enter the Product Heading / Name.', 'error');
      return;
    }

    try {
      setSavingProduct(true);

      const chosenCatId = form.category || categories[0]?._id;
      const photoUrl = form.photo.trim() || '/categories/chandelier.jpg';

      const payload = {
        name: form.name.trim(),
        title: form.name.trim(),
        category: chosenCatId,
        subcategory: (form.subcategory || '').trim().toLowerCase(),
        subcategoryName: (form.subcategoryName || '').trim(),
        description: form.description.trim(),
        shortDescription: form.description.trim().slice(0, 160),
        price: form.price !== '' ? Number(form.price) : 0,
        mainImage: photoUrl,
        images: editingProduct?.images?.length > 1
          ? (editingProduct.images.some((img) => (typeof img === 'string' ? img : img.url) === photoUrl)
              ? editingProduct.images.map((img) => {
                  const url = typeof img === 'string' ? img : img.url;
                  return {
                    url,
                    isCover: url === photoUrl,
                    alt: typeof img === 'object' ? img.alt || form.name.trim() : form.name.trim(),
                  };
                })
              : [
                  { url: photoUrl, isCover: true, alt: form.name.trim() },
                  ...editingProduct.images.map((img) => ({
                    url: typeof img === 'string' ? img : img.url,
                    isCover: false,
                    alt: typeof img === 'object' ? img.alt || form.name.trim() : form.name.trim(),
                  })),
                ])
          : [{ url: photoUrl, isCover: true, alt: form.name.trim() }],
        isPublished: true,
      };

      if (editingProduct) {
        const res = await productService.updateProduct(editingProduct._id, payload);
        if (res.success) {
          addToast('Product updated successfully!', 'success');
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

      {/* ── SIMPLE MODAL: ONLY 4 FIELDS (Heading Name, Description, Price, Photo) ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14171d] border border-white/15 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Enter heading name, description, price, and product photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4">
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

              {/* 2. Category & Subcategory Selection with Options (Rename, Update, Delete, +New) */}
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

              {/* 2. Product Price (₹) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                  Product Price (₹)
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
              </div>

              {/* 3. Product Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Elegant handcrafted crystal fixture with golden canopy. Ideal for dining and living spaces."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs leading-relaxed resize-y"
                />
              </div>

              {/* 4. Product Photo */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Product Photo</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Direct Link Mode (0 MB Server Space)
                  </span>
                </div>

                {/* Primary: Direct Image URL Input */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={form.photo}
                      onChange={(e) => setForm({ ...form, photo: e.target.value })}
                      placeholder="Paste Image URL: e.g. https://i.postimg.cc/... or /categories/chandelier.jpg"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    💡 Tip: Paste direct image link from <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-[#DC2626] hover:underline font-semibold">Postimages.org</a>, ImgBB, or any web URL without taking server storage.
                  </p>
                </div>

                {/* Secondary: PC File Uploader */}
                <div className="pt-1">
                  <details className="text-xs text-neutral-400 group">
                    <summary className="cursor-pointer hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                      <span>Or upload photo file from computer</span>
                      <span className="text-[10px] text-neutral-500">(saves to /uploads)</span>
                    </summary>
                    <div className="mt-2">
                      <ImageUploader
                        label="Choose image file from PC"
                        onUploadSuccess={(url) => setForm({ ...form, photo: url })}
                      />
                    </div>
                  </details>
                </div>

                {/* Live Preview */}
                {form.photo && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-black border border-white/20 overflow-hidden shrink-0">
                        <img
                          src={form.photo}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/categories/chandelier.jpg';
                          }}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          ✓ Photo Ready
                        </span>
                        <p className="text-[10px] text-neutral-400 truncate font-mono max-w-[200px]">
                          {form.photo}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, photo: '' })}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={savingProduct}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
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
