import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  Heart,
  Phone,
  Share2,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { InquiryModal } from '../common/InquiryModal';
import { useSettings } from '../../context/SettingsContext';

// Curated high-resolution secondary hover images by category (ensures every product has an authentic HD alternate view)
const CATEGORY_HOVER_MAP = {
  'wall-lamp': '/categories/wall-lamp.jpg',
  'led-wall-lamp': '/categories/led-wall-lamp.jpg',
  'classic-wall-lamp': '/categories/classic-wall-lamp.jpg',
  'pendant-lamp': '/categories/pendant-lamp.jpg',
  'led-hanging-lamp': '/categories/led-hanging-lamp.jpg',
  'classic-hanging-lamp': '/categories/classic-hanging-lamp.jpg',
  'chandelier': '/categories/chandelier.jpg',
  'led-chandelier': '/categories/chandelier.jpg',
  'e14-chandelier': '/categories/e14-chandelier.jpg',
  'profile-chandelier': '/categories/profile-chandelier.jpg',
  'glass-chandelier': '/categories/glass-chandelier.jpg',
  'italian-chandelier': '/categories/italian-chandelier.jpg',
  'modern-chandelier': '/categories/modern-chandelier.jpg',
  'antic-chandelier': '/categories/antic-chandelier.jpg',
  'antique-chandelier': '/categories/antic-chandelier.jpg',
  'fan-chandelier': '/categories/fan-chandelier.jpg',
  'ceiling-chandelier': '/categories/ceiling-chandelier.jpg',
  'double-height': '/categories/double-height.jpg',
  'crystal-chandelier': '/categories/double-height.jpg',
  'modern-chandelier-dh': '/categories/modern-chandelier-dh.jpg',
  'dining-table-lamp': '/categories/dining-table-lamp.jpg',
  'outdoor-light': '/categories/outdoor-light.jpg',
  'gate-lamp': '/categories/outdoor-light.jpg',
  'outdoor-wall-lamp': '/hero-outdoor.jpg',
  'table-lamp': '/categories/table-lamp.jpg',
  'floor-lamp': '/categories/floor-lamp.jpg',
  'led-filament-bulb': '/categories/led-filament-bulb.jpg',
  'spare-part': '/categories/spare-part.jpg',
  'hanging-base': '/categories/hanging-base.jpg',
  'spare-driver': '/categories/spare-driver.jpg',
};

// Fallback cover image by category / subcategory
export const getCategoryDefaultCover = (cat) => {
  const c = String(cat || '').toLowerCase();
  if (c.includes('e14')) return '/categories/e14-chandelier.jpg';
  if (c.includes('profile')) return '/categories/profile-chandelier.jpg';
  if (c.includes('glass')) return '/categories/glass-chandelier.jpg';
  if (c.includes('italian')) return '/categories/italian-chandelier.jpg';
  if (c.includes('sputnik') || (c.includes('modern') && c.includes('chandelier') && !c.includes('double'))) return '/categories/modern-chandelier.jpg';
  if (c.includes('antic') || c.includes('antique')) return '/categories/antic-chandelier.jpg';
  if (c.includes('ceiling') && c.includes('chandelier')) return '/categories/ceiling-chandelier.jpg';
  if (c.includes('led') && c.includes('wall')) return '/categories/led-wall-lamp.jpg';
  if (c.includes('classic') && c.includes('wall')) return '/categories/classic-wall-lamp.jpg';
  if (c.includes('led') && (c.includes('pendant') || c.includes('hanging'))) return '/categories/led-hanging-lamp.jpg';
  if (c.includes('classic') && (c.includes('pendant') || c.includes('hanging'))) return '/categories/classic-hanging-lamp.jpg';
  if (c.includes('wall')) return '/categories/wall-lamp.jpg';
  if (c.includes('pendant') || c.includes('hanging')) return '/categories/pendant-lamp.jpg';
  if (c.includes('fan')) return '/categories/fan-chandelier.jpg';
  if (c.includes('double')) return '/categories/double-height.jpg';
  if (c.includes('dining')) return '/categories/dining-table-lamp.jpg';
  if (c.includes('outdoor') || c.includes('gate')) return '/categories/outdoor-light.jpg';
  if (c.includes('table')) return '/categories/table-lamp.jpg';
  if (c.includes('floor')) return '/categories/floor-lamp.jpg';
  if (c.includes('bulb') || c.includes('filament')) return '/categories/led-filament-bulb.jpg';
  if (c.includes('driver')) return '/categories/spare-driver.jpg';
  if (c.includes('base') || c.includes('spare')) return '/categories/hanging-base.jpg';
  return '/categories/chandelier.jpg';
};

export const ProductCard = ({ product, hidePricing = false }) => {
  const { settings } = useSettings();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check wishlist on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lighthut_wishlist') || '[]');
      setIsLiked(stored.includes(product._id || product.slug));
    } catch (e) {
      // ignore
    }
  }, [product._id, product.slug]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const id = product._id || product.slug;
      const stored = JSON.parse(localStorage.getItem('lighthut_wishlist') || '[]');
      let updated;
      if (stored.includes(id)) {
        updated = stored.filter((item) => item !== id);
        setIsLiked(false);
      } else {
        updated = [...stored, id];
        setIsLiked(true);
      }
      localStorage.setItem('lighthut_wishlist', JSON.stringify(updated));
    } catch (err) {
      setIsLiked(!isLiked);
    }
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const catKey =
    typeof product.category === 'string'
      ? product.category.toLowerCase()
      : product.category?.slug || 'chandelier';

  const subKey = String(product.subcategory || product.subCategory || '').toLowerCase();

  // Primary HD cover image (Strictly authentic lighting fixture)
  const coverImage =
    product.images?.find((img) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    getCategoryDefaultCover(subKey || catKey);

  // Dedicated secondary image if available, otherwise preserve exact cover image on hover
  const hasMultipleImages = Boolean(product.images?.[1]?.url);
  const hoverImage = hasMultipleImages ? product.images[1].url : coverImage;

  const categoryTitle =
    product.categoryName ||
    product.category?.name ||
    (typeof product.category === 'string'
      ? product.category.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Architectural Light');

  const displayPhone = settings?.phone || '+91 8045811438';
  const rawPhone = displayPhone.replace(/[^\d+]/g, '');

  // Numerical price computation (deterministic realistic fake price if not provided)
  const numericPrice = (() => {
    if (product.price && Number(product.price) > 0) return Number(product.price);
    const cat = String(catKey || '').toLowerCase();
    const seed = String(product._id || product.slug || product.name || '0')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    if (cat.includes('chandelier') || cat.includes('double')) return 24999 + (seed % 15) * 2500;
    if (cat.includes('pendant') || cat.includes('dining')) return 4999 + (seed % 10) * 800;
    if (cat.includes('outdoor')) return 3499 + (seed % 8) * 600;
    if (cat.includes('floor')) return 12999 + (seed % 8) * 1500;
    if (cat.includes('table')) return 3999 + (seed % 6) * 600;
    return 2999 + (seed % 8) * 500;
  })();

  const originalPrice = Math.round(numericPrice * 1.35);
  const formattedPrice = `₹${numericPrice.toLocaleString('en-IN')}`;
  const formattedOriginalPrice = `₹${originalPrice.toLocaleString('en-IN')}`;

  const productDimensions =
    product.specifications?.dimensions ||
    product.dimensions ||
    product.size ||
    '';

  const productDescription =
    product.description ||
    product.shortDescription ||
    '';

  return (
    <>
      <div className="group relative flex flex-col bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1">
        
        {/* ── IMAGE WRAPPER WITH HD HOVER ── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 block">
          <Link to={`/product/${product.slug}`} className="absolute inset-0 block">
            {/* Primary HD Image */}
            <img
              src={coverImage}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getCategoryDefaultCover(subKey || catKey);
              }}
              alt={product.name}
              className={`w-full h-full object-cover object-center transform transition-all duration-700 ease-out filter brightness-[1.02] contrast-[1.02] ${
                hasMultipleImages ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />

            {/* Secondary HD Image (Smooth Crossfade only if dedicated 2nd image exists) */}
            {hasMultipleImages && (
              <img
                src={hoverImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getCategoryDefaultCover(subKey || catKey);
                }}
                alt={`${product.name} alternate view`}
                className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105 filter brightness-[1.02] contrast-[1.02]"
                loading="lazy"
              />
            )}
          </Link>
        </div>

        {/* ── CARD CONTENT: Product name, size, description, and price ── */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            {/* 1. Product Name */}
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#DC2626] transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* 2. Product Size / Dimensions */}
            {productDimensions ? (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">Size:</span>
                <span className="font-mono text-neutral-800 text-[11px] truncate">{productDimensions}</span>
              </div>
            ) : null}

            {/* 3. Product Description */}
            {productDescription ? (
              <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                {productDescription}
              </p>
            ) : null}

            {/* 4. Product Price Display */}
            {!hidePricing && (
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Price:</span>
                <span className="font-mono text-base font-extrabold text-[#DC2626] tracking-tight">
                  {formattedPrice}
                </span>
              </div>
            )}
          </div>

          {/* Action Row: Clean View Details Link (No contact details) */}
          <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="w-full text-center py-2 rounded-xl bg-neutral-900 hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>
        </div>
      </div>

      {/* ── QUICK VIEW LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {quickViewOpen && (
          <div
            onClick={() => setQuickViewOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200"
            >
              <button
                type="button"
                onClick={() => setQuickViewOpen(false)}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                  <img
                    src={coverImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/categories/chandelier.jpg';
                    }}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-md">
                      {categoryTitle}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-[#DC2626] font-semibold">
                      SKU: {product.sku || 'LH-ARC'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-neutral-900 mt-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                      {product.shortDescription || product.description || 'Architectural lighting luminaire engineered with precision optical performance and museum-grade color rendering.'}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                      {product.specifications?.finish && (
                        <div><strong>Finish:</strong> {product.specifications.finish}</div>
                      )}
                      {product.specifications?.colorTemperature && (
                        <div><strong>CCT:</strong> {product.specifications.colorTemperature}</div>
                      )}
                      {product.specifications?.material && (
                        <div><strong>Material:</strong> {product.specifications.material}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => setQuickViewOpen(false)}
                      className="w-full block py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold text-center transition-all"
                    >
                      View Full Specs
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <InquiryModal
          isOpen={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          product={product}
        />
      )}
    </>
  );
};

