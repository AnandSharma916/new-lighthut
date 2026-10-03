import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Layers,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Star,
  Trash2,
  Plus,
} from 'lucide-react';
import { productService, categoryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { CategorySelectorWithOptions } from '../../components/admin/CategorySelectorWithOptions';

export const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state with subcategory, specifications, and multi-image gallery
  const [formData, setFormData] = useState({
    name: '',          // Heading Name / Product Name
    category: '',      // Category ID
    subcategory: '',   // Subcategory slug (e.g. led-wall-lamp)
    subcategoryName: '', // Subcategory display name
    size: '',          // Size / Dimensions (e.g. Diameter: 250mm, Height: 300mm)
    finish: '',        // Finish (e.g. Brushed Gold, Matte Black)
    material: '',      // Material (e.g. Die-cast Aluminum, K9 Optical Crystal)
    colorTemperature: '', // CCT (e.g. 3000K Warm White)
    wattage: '',       // Wattage (e.g. 24W LED)
    ipRating: '',      // IP Rating (e.g. IP20, IP65)
    installationType: '', // Mounting / Installation type
    voltage: '',       // Voltage (e.g. AC 220-240V)
    price: '',         // Product Price (₹)
    description: '',   // Product Description
    images: [],        // Array of { url, isCover, alt }
    sku: '',           // Auto-generated or existing SKU
  });
  const [manualUrlInput, setManualUrlInput] = useState('');

  // Load Categories for dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories({ admin: 'true' });
        if (res.success && res.categories) {
          setCategories(res.categories);
          // Default to first category if creating a new product
          if (!isEditMode && res.categories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: prev.category || res.categories[0]._id,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, [isEditMode]);

  // Load Existing Product if Edit Mode
  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        if (res.success && res.product) {
          const p = res.product;
          
          // Collect all product images into structured gallery items
          const productImages = [];
          if (Array.isArray(p.images) && p.images.length > 0) {
            p.images.forEach((img, idx) => {
              const url = typeof img === 'string' ? img : img.url;
              if (url) {
                productImages.push({
                  url,
                  isCover: typeof img === 'object' ? Boolean(img.isCover) : idx === 0,
                  alt: typeof img === 'object' ? (img.alt || p.name) : p.name,
                });
              }
            });
          } else if (p.mainImage) {
            productImages.push({
              url: p.mainImage,
              isCover: true,
              alt: p.name || 'Cover Image',
            });
          }

          if (productImages.length > 0 && !productImages.some((img) => img.isCover)) {
            productImages[0].isCover = true;
          }

          setFormData({
            name: p.name || p.title || '',
            category: p.category?._id || p.category || '',
            subcategory: p.subcategory || '',
            subcategoryName: p.subcategoryName || '',
            size: p.specifications?.dimensions || p.dimensions || p.size || '',
            finish: p.specifications?.finish || '',
            material: p.specifications?.material || '',
            colorTemperature: p.specifications?.colorTemperature || '',
            wattage: p.specifications?.wattage || '',
            ipRating: p.specifications?.ipRating || '',
            installationType: p.specifications?.installationType || '',
            voltage: p.specifications?.voltage || '',
            price: p.price ?? '',
            description: p.description || p.shortDescription || '',
            images: productImages,
            sku: p.sku || '',
          });
        } else {
          addToast('Product not found.', 'error');
          navigate('/admin/products');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        addToast('Failed to load product details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload handler for single or multiple photos
  const handleUploadSuccess = (uploaded) => {
    const urls = Array.isArray(uploaded) ? uploaded : [uploaded];
    setFormData((prev) => {
      const current = [...(prev.images || [])];
      const newItems = urls
        .filter((u) => u && !current.some((existing) => existing.url === u))
        .map((url, i) => ({
          url,
          isCover: current.length === 0 && i === 0,
          alt: prev.name.trim() || 'Product Photo',
        }));
      const combined = [...current, ...newItems];
      if (combined.length > 0 && !combined.some((img) => img.isCover)) {
        combined[0].isCover = true;
      }
      return { ...prev, images: combined };
    });
    addToast(
      urls.length > 1
        ? `${urls.length} photos added to product gallery!`
        : 'Photo added to product gallery!',
      'success'
    );
  };

  // Add manual photo URL / path
  const handleAddManualUrl = () => {
    const url = manualUrlInput.trim();
    if (!url) return;
    setFormData((prev) => {
      const current = [...(prev.images || [])];
      if (current.some((img) => img.url === url)) {
        addToast('This photo is already added.', 'info');
        return prev;
      }
      const newImages = [
        ...current,
        {
          url,
          isCover: current.length === 0,
          alt: prev.name.trim() || 'Product Photo',
        },
      ];
      return { ...prev, images: newImages };
    });
    setManualUrlInput('');
    addToast('Photo URL added to gallery!', 'success');
  };

  // Set selected photo as Cover / Primary image
  const handleSetCover = (indexToCover) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => ({
        ...img,
        isCover: idx === indexToCover,
      })),
    }));
    addToast('Cover image updated!', 'info');
  };

  // Remove photo from gallery
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return { ...prev, images: filtered };
    });
    addToast('Photo removed from product.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast('Please enter the Product Heading / Name.', 'error');
      return;
    }

    if (!formData.category) {
      addToast('Please select a Category.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const generatedSku =
        formData.sku.trim() ||
        `LH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const coverImage =
        formData.images.find((img) => img.isCover)?.url ||
        formData.images[0]?.url ||
        '';

      const formattedImages = (formData.images || []).map((img, idx) => ({
        url: img.url,
        isCover: Boolean(img.isCover),
        alt: img.alt || formData.name.trim() || `View ${idx + 1}`,
      }));

      const payload = {
        name: formData.name.trim(),
        title: formData.name.trim(),
        category: formData.category,
        subcategory: (formData.subcategory || '').trim().toLowerCase(),
        subcategoryName: (formData.subcategoryName || '').trim(),
        price: formData.price !== '' ? Number(formData.price) : 0,
        description: formData.description.trim(),
        shortDescription: formData.description.trim().slice(0, 160),
        mainImage: coverImage,
        images: formattedImages,
        sku: generatedSku,
        specifications: {
          dimensions: formData.size.trim(),
          finish: formData.finish.trim(),
          material: formData.material.trim(),
          colorTemperature: formData.colorTemperature.trim(),
          wattage: formData.wattage.trim(),
          ipRating: formData.ipRating.trim(),
          installationType: formData.installationType.trim(),
          voltage: formData.voltage.trim(),
        },
        isPublished: true,
      };

      if (isEditMode) {
        const res = await productService.updateProduct(id, payload);
        if (res.success) {
          addToast('Product updated successfully with specifications!', 'success');
          navigate('/admin/products');
        }
      } else {
        const res = await productService.createProduct(payload);
        if (res.success) {
          addToast('Product created successfully with specifications!', 'success');
          navigate('/admin/products');
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      addToast(
        err.response?.data?.message || 'Error saving product. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <Loader2 className="w-10 h-10 text-[#DC2626] animate-spin" />
        <p className="text-neutral-400 text-xs">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#14171d] to-[#181b22] p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block">
              {isEditMode ? 'Edit Existing Product' : 'Simple Product Creator'}
            </span>
            <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
              {isEditMode ? 'Edit Product Details' : 'Add New Product'}
            </h1>
          </div>
        </div>

        <Link
          to="/admin/products"
          className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Cancel & Return to Products</span>
        </Link>
      </div>

      {/* Main Single-Card Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* 1. Heading Name / Product Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <span>Heading Name / Product Title</span>
              <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Royal Waterfall Crystal Chandelier"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium"
            />
            <p className="text-[11px] text-neutral-400">
              The main product title displayed on the catalog and showroom cards.
            </p>
          </div>

          {/* 2. Category & Subcategory Selection with Options (Rename, Update, Delete, +New) */}
          <CategorySelectorWithOptions
            categories={categories}
            selectedCategoryId={formData.category}
            onSelectCategory={(catId) => {
              setFormData((prev) => ({
                ...prev,
                category: catId,
                subcategory: '',
                subcategoryName: '',
              }));
            }}
            selectedSubcategory={formData.subcategory}
            onSelectSubcategory={(subSlug, subName) => {
              setFormData((prev) => ({
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

          {/* 3. Price & SKU Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Product Price (₹) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>Product Price (₹)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 14999"
                  min="0"
                  step="1"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                Studio price in INR.
              </p>
            </div>

            {/* SKU / Model Code */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>SKU / Model Number</span>
                <span className="text-[10px] text-neutral-400 font-normal lowercase">(auto if blank)</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. LH-WL101"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none transition-all text-sm font-mono uppercase"
              />
              <p className="text-[11px] text-neutral-400">
                Unique identifier for tracking and ordering.
              </p>
            </div>
          </div>

          {/* 4. Complete Architectural Specifications Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Architectural Specifications & Filters</span>
              </label>
              <span className="text-[10px] text-neutral-400">Appears on Catalog Cards & Technical Specs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dimensions / Size */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Dimensions / Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g. Ø 600mm x H 1200mm or 450 x 120 mm"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
              </div>

              {/* Finish / Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Finish / Color</label>
                <input
                  type="text"
                  name="finish"
                  value={formData.finish}
                  onChange={handleChange}
                  placeholder="e.g. Brushed Gold, Matte Black, Satin Brass"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Brushed Gold', 'Matte Black', 'Satin Brass', 'Chrome', 'White', 'Antique Bronze'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, finish: f }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Material Composition</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. Die-Cast Aluminum & K9 Optical Crystal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Die-Cast Aluminum', 'K9 Crystal', 'Architectural Brass', 'Fluted Glass', 'Natural Marble'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, material: m }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Temperature (CCT) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Color Temperature (CCT)</label>
                <input
                  type="text"
                  name="colorTemperature"
                  value={formData.colorTemperature}
                  onChange={handleChange}
                  placeholder="e.g. 3000K Warm White or 3-in-1 CCT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['3000K Warm White', '4000K Natural White', '6000K Cool White', '3-in-1 Tunable CCT'].map((cct) => (
                    <button
                      key={cct}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, colorTemperature: cct }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {cct}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wattage */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Wattage / Power</label>
                <input
                  type="text"
                  name="wattage"
                  value={formData.wattage}
                  onChange={handleChange}
                  placeholder="e.g. 15W, 36W LED, 48W"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['12W LED', '24W LED', '36W LED', '48W LED', '60W+'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, wattage: w }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* IP Rating */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">IP Rating</label>
                <input
                  type="text"
                  name="ipRating"
                  value={formData.ipRating}
                  onChange={handleChange}
                  placeholder="e.g. IP20 Indoor, IP65 Outdoor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['IP20 (Indoor)', 'IP44 (Bathroom)', 'IP65 (Outdoor Waterproof)'].map((ip) => (
                    <button
                      key={ip}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, ipRating: ip }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {ip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Installation Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Installation / Mounting</label>
                <input
                  type="text"
                  name="installationType"
                  value={formData.installationType}
                  onChange={handleChange}
                  placeholder="e.g. Surface Mounted, Suspended, Recessed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Surface Mounted', 'Suspended / Pendant', 'Recessed / Flush Mount', 'Magnetic Track'].map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, installationType: inst }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Voltage */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-300">Operating Voltage</label>
                <input
                  type="text"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleChange}
                  placeholder="e.g. AC 220-240V, 50/60Hz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4. Product Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <span>Product Description</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Handcrafted crystal chandelier featuring precision-cut optical glass prisms with electroplated brass canopy. Perfect for dining spaces and high-ceiling foyers."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none transition-all text-sm font-normal leading-relaxed resize-y"
            />
            <p className="text-[11px] text-neutral-400">
              Clear description of the product design, aesthetics, and spatial use.
            </p>
          </div>

          {/* 5. Product Photos & Gallery (Upload Multiple + URLs + Cover Selection) */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Product Photos / Gallery</span>
                <span className="text-[#DC2626]">*</span>
              </label>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                {formData.images.length} {formData.images.length === 1 ? 'photo' : 'photos'} added
              </span>
            </div>

            {/* Direct Multi-File Uploader */}
            <ImageUploader
              label="Upload Product Photos (Select Multiple)"
              multiple={true}
              onUploadSuccess={handleUploadSuccess}
            />

            {/* Photo URL Input Alternative */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Or add Image URL / Path directly:</span>
                <span className="text-[10px] text-neutral-500">Supports Postimages, ImgBB, Unsplash, /uploads</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualUrl();
                    }
                  }}
                  placeholder="e.g. /categories/chandelier.jpg or https://i.postimg.cc/..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-mono placeholder-neutral-500 focus:border-[#DC2626] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  disabled={!manualUrlInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>
            </div>

            {/* Gallery Grid (Live Previews, Set Cover, Delete) */}
            {formData.images.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-medium text-neutral-300">Attached Product Photos:</span>
                  <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> Star marks the Primary / Cover image
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                  {formData.images.map((img, idx) => (
                    <div
                      key={img.url + idx}
                      className={`relative group rounded-xl overflow-hidden border bg-neutral-900 aspect-square flex flex-col justify-between transition-all ${
                        img.isCover
                          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `Photo ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/categories/chandelier.jpg';
                        }}
                        className="w-full h-full object-cover absolute inset-0"
                      />

                      {/* Gradient Overlay for controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-90 group-hover:opacity-100 transition-opacity" />

                      {/* Top Header: Badge & Delete */}
                      <div className="relative z-10 p-2 flex items-center justify-between">
                        {img.isCover ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-black" /> Cover
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-black/60 text-neutral-400 text-[10px] font-mono">
                            #{idx + 1}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove Photo"
                          className="w-6 h-6 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Bottom Footer: Set Cover Button */}
                      <div className="relative z-10 p-2">
                        {!img.isCover ? (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="w-full py-1 rounded-md bg-black/70 hover:bg-amber-500 hover:text-black text-neutral-200 text-[10px] font-semibold transition-all border border-white/20 hover:border-amber-500 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Star className="w-2.5 h-2.5" /> Set as Cover
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-300 font-medium block text-center truncate">
                            Primary Showcase
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-4 p-4 rounded-2xl bg-[#14171d] border border-white/10 shadow-xl">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-luxury transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 shadow-lg transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Product' : 'Save Product to Catalog'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
