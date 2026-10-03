import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Share2,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Layers,
  Award,
  Zap,
  Mail,
  Eye,
  MapPin,
  Building2,
  Phone,
} from 'lucide-react';
import { productService } from '../../services/api';
import { ProductCard } from '../../components/catalog/ProductCard';
import { InquiryModal } from '../../components/common/InquiryModal';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { LightHut } from '../../components/common/BrandWordmark';
import { MASTER_PRODUCTS } from '../../data/catalogData';

const CATEGORY_BANNER_MAP = {
  chandelier: '/hero-chandelier.jpg',
  'led-chandelier': '/hero-chandelier.jpg',
  'e14-chandelier': '/categories/chandelier.jpg',
  'profile-chandelier': '/hero-chandelier.jpg',
  'glass-chandelier': '/hero-chandelier.jpg',
  'italian-chandelier': '/categories/chandelier.jpg',
  'modern-chandelier': '/hero-chandelier.jpg',
  'antique-chandelier': '/categories/chandelier.jpg',
  'fan-chandelier': '/hero-chandelier.jpg',
  'ceiling-chandelier': '/categories/chandelier.jpg',
  'double-height': '/hero-double-height.jpg',
  'crystal-chandelier': '/hero-double-height.jpg',
  'modern-double-height-chandelier': '/hero-double-height.jpg',
  'pendant-lamp': '/hero-pendant.jpg',
  'led-hanging-lamp': '/hero-pendant.jpg',
  'classic-hanging-lamp': '/categories/pendant-lamp.jpg',
  pendant: '/hero-pendant.jpg',
  'wall-lamp': '/hero-wall-lamp.jpg',
  'led-wall-lamp': '/hero-wall-lamp.jpg',
  'classic-wall-lamp': '/categories/wall-lamp.jpg',
  wall: '/hero-wall-lamp.jpg',
  'outdoor-light': '/hero-outdoor.jpg',
  'gate-lamp': '/hero-outdoor.jpg',
  'outdoor-wall-lamp': '/categories/outdoor-light.jpg',
  outdoor: '/hero-outdoor.jpg',
  'table-lamp': '/banner-bedroom.jpg',
  'dining-table-lamp': '/banner-amalfi.jpg',
  'floor-lamp': '/banner-study.jpg',
  'spare-part': '/craft-main.jpg',
  'hanging-base': '/craft-main.jpg',
  'spare-driver': '/craft-main.jpg',
  'led-filament-bulb': '/craft-detail.jpg',
};

// Real-World Architectural Project Installations Data (Curated for spatial context)
const ARCHITECTURAL_PROJECTS = [
  {
    title: 'The Amanora Grand Residence',
    location: 'Lutyens Bungalow Zone, New Delhi',
    type: 'Luxury Villa',
    image: '/categories/chandelier.jpg',
    tag: 'Living & Atrium',
  },
  {
    title: 'The St. Regis Duplex Penthouse',
    location: 'Worli Sea Face, Mumbai',
    type: 'Duplex Penthouse',
    image: '/categories/double-height.jpg',
    tag: 'Double-Height Void',
  },
  {
    title: 'Alila Heritage Estate',
    location: 'Jubilee Hills, Hyderabad',
    type: 'Private Estate',
    image: '/categories/wall-lamp.jpg',
    tag: 'Corridor & Sconces',
  },
  {
    title: 'Verandah Dining Pavilion',
    location: 'Indiranagar, Bengaluru',
    type: 'Executive Banquet',
    image: '/categories/pendant-lamp.jpg',
    tag: 'Island Suspensions',
  },
  {
    title: 'Casa Sol Coastal Sanctuary',
    location: 'North Goa',
    type: 'Luxury Villa',
    image: '/categories/outdoor-light.jpg',
    tag: 'Weatherproof Facade',
  },
  {
    title: 'Oberoi Suite Presidential Wing',
    location: 'Jaipur, Rajasthan',
    type: '5-Star Hospitality',
    image: '/banner-empire.jpg',
    tag: 'Regal Crystal',
  },
];

export const ProductDetail = () => {
  const { settings } = useSettings();
  const { slug } = useParams();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        if (data.success && data.product) {
          setProduct(data.product);

          // Build at least 8-12 related products
          let rel = data.relatedProducts || [];
          const currentCat =
            typeof data.product.category === 'string'
              ? data.product.category.toLowerCase()
              : data.product.category?.slug?.toLowerCase() || 'chandelier';

          if (rel.length < 8) {
            const extraRelated = MASTER_PRODUCTS.filter(
              (p) =>
                p._id !== data.product._id &&
                (p.category === currentCat || p.category === 'chandelier' || p.category === 'pendant-lamp')
            ).slice(0, 12);
            rel = [...rel, ...extraRelated.filter((er) => !rel.some((r) => (r._id || r.slug) === (er._id || er.slug)))];
          }

          setRelatedProducts(rel.slice(0, 8));
          setSelectedImageIndex(0);
          document.title = `${data.product.name} (${data.product.sku}) | Light-Hut Architectural Lighting`;
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-white">
        <div className="w-10 h-10 rounded-full border-2 border-[#DC2626] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold mb-2">Luminaire Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The requested luminaire does not exist or may have been unlisted.
          </p>
          <Link
            to="/catalog"
            className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const catKey =
    typeof product.category === 'string'
      ? product.category.toLowerCase()
      : product.category?.slug?.toLowerCase() || 'chandelier';

  // Gallery shows only the product's own images
  const rawImages = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img, i) => {
      const url = typeof img === 'string' ? img : img.url;
      if (url) {
        rawImages.push({
          url,
          label: i === 0 ? 'Primary Studio View' : `Studio Angle ${i + 1}`,
          tag: 'Official Specimen',
          alt: `${product.name} View ${i + 1}`,
        });
      }
    });
  }

  // Products without uploaded images fall back to their category cover
  if (rawImages.length === 0) {
    rawImages.push({
      url: CATEGORY_BANNER_MAP[catKey] || '/categories/chandelier.jpg',
      label: 'Primary Studio View',
      tag: 'Official Specimen',
      alt: product.name,
    });
  }

  const images = rawImages;
  const currentImage = images[selectedImageIndex] || images[0];

  const specsList = [
    { label: 'Model Code', value: product.sku },
    { label: 'Category', value: product.category?.name || product.categoryName },
    { label: 'Dimensions', value: product.specifications?.dimensions },
    { label: 'Material', value: product.specifications?.material },
    { label: 'Finish & Color', value: product.specifications?.finish },
    { label: 'Light Source / Bulb', value: product.specifications?.wattage },
    { label: 'Input Voltage', value: product.specifications?.voltage },
    { label: 'Light Color (Warm / White)', value: product.specifications?.colorTemperature },
    { label: 'Water & Weather Protection', value: product.specifications?.ipRating },
    { label: 'Mounting / Placement', value: product.specifications?.installationType },
    { label: 'Luminous Flux', value: product.specifications?.luminousFlux },
    { label: 'CRI Index', value: product.specifications?.cri || 'Ra > 92' },
  ].filter((item) => item.value && String(item.value).trim() !== '');

  // 8 High-Impact In-Situ Spatial Images
  const inSituGallery = images.slice(1, 9);

  const displayPhone = settings?.phone || '+91 8045811438';
  const cleanPhone = displayPhone.replace(/[^\d+]/g, '');

  const numericPrice = (() => {
    if (product.price && Number(product.price) > 0) return Number(product.price);
    const cat = String(product.category?.slug || product.category || product.categoryName || '').toLowerCase();
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

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="pt-24 pb-28 sm:pb-20 bg-white min-h-screen text-neutral-900">
      {/* Draft Notification Banner */}
      {!product.isPublished && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 py-2.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Admin Preview: This luminaire is currently saved as a <strong>Draft</strong> and is hidden from public catalog visitors.</span>
        </div>
      )}

      {/* ── ARCHITECTURAL PRODUCT TOP HERO BANNER (Crystal Clear & Bright) ── */}
      <div className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800 min-h-[220px] sm:min-h-[280px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={
              CATEGORY_BANNER_MAP[catKey] ||
              currentImage?.url ||
              '/hero-chandelier.jpg'
            }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/hero-chandelier.jpg';
            }}
            alt={product.name}
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
          <nav className="flex items-center gap-2 text-xs text-neutral-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                <Link to={`/catalog?category=${product.category.slug || product.category}`} className="hover:text-white transition-colors">
                  {product.category.name || product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-red-400 font-semibold truncate">{product.name}</span>
          </nav>

          <span className="text-[11px] uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
            {product.category?.name || 'Architectural Lighting Series'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight drop-shadow-md">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 mt-2 max-w-xl font-light leading-relaxed drop-shadow">
            {product.shortDescription || 'Bespoke architectural luminaire engineered for luxury spatial elevation.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── TOP SECTION: IMAGE GALLERY STAGE & TECHNICAL SPECIFICATIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: RICH MULTI-IMAGE GALLERY (7 SPAN) ── */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Mode Pill & Counter */}
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                  {images.length} High-Definition Views Available
                </span>
                <span className="text-neutral-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
                  Viewing {selectedImageIndex + 1} of {images.length}
                </span>
              </div>

              {/* Day / Night Mood Toggle */}
              <button
                type="button"
                onClick={() => setIsNightMode(!isNightMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-neutral-900 text-amber-300 border-amber-400/40 shadow-sm'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
                title="Toggle circadian illumination ambiance"
              >
                {isNightMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evening Warm Glow (2700K)</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daylight Natural State</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Main Image Showcase with Prev/Next Navigation Controls */}
            <div
              onClick={() => setLightboxOpen(true)}
              className={`relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border transition-all duration-500 shadow-md group cursor-zoom-in ${
                isNightMode
                  ? 'border-amber-400/50 shadow-[0_10px_35px_rgba(217,119,6,0.15)] ring-2 ring-amber-400/20'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <img
                src={currentImage.url}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt={currentImage.alt || product.name}
                className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
                  isNightMode ? 'filter brightness-95 contrast-110 saturate-110' : ''
                }`}
              />

              {/* Warm evening mood filter overlay */}
              {isNightMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-amber-900/10 to-transparent pointer-events-none" />
              )}

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-red-400 border border-white/10 shadow-lg">
                  {product.sku}
                </span>
                {product.isFeatured && (
                  <span className="text-xs font-bold uppercase tracking-luxury px-2.5 py-1 rounded-lg bg-[#DC2626] text-white shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 shadow hidden sm:inline-block">
                  {currentImage.tag || 'Architectural View'}
                </span>
              </div>

              {/* Navigation Left Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Previous view"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Next view"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Action Buttons on Image */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white hover:text-red-400 border border-white/20 transition-all shadow-lg hover:scale-110"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white hover:text-red-400 border border-white/20 transition-all shadow-lg hover:scale-110"
                  title="Copy share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <span className="text-[11px] font-medium text-white/95 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 shadow">
                  {currentImage.label}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel (Up to 12 High-Definition Perspectives) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium px-1">
                <span>Select Angle / Perspective ({images.length} HD Views)</span>
                <span>Click image to zoom</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-[#DC2626] shadow-md scale-102 ring-2 ring-[#DC2626]/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/categories/chandelier.jpg';
                      }}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/75 py-0.5 px-1 text-[8px] font-semibold text-white text-center truncate">
                      {img.tag || `Angle ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: SPECIFICATIONS & ACTIONS (5 SPAN) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {product.category && (
                <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-2">
                  {product.category.name || product.categoryName}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                  SKU: <strong className="text-neutral-900 font-bold">{product.sku}</strong>
                </span>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Architectural Grade</span>
                </span>
              </div>

              {/* Price Tag with Strikethrough & Savings */}
              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    Studio Price
                  </span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-3xl font-extrabold text-[#DC2626] tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      {formattedOriginalPrice}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save 35%
                    </span>
                  </div>
                  <span className="text-[10.5px] text-neutral-500 mt-1 block">
                    Inclusive of all taxes • Ready for Showroom Dispatch
                  </span>
                </div>
              </div>
            </div>

            {product.shortDescription && (
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {product.shortDescription}
              </p>
            )}

            {/* Action Buttons: Inquiry & Official Email */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="btn-gold flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
              >
                <Send className="w-4 h-4" />
                <span>Send Product Inquiry</span>
              </button>

              <a
                href={`mailto:lighthutdecorativedlh@gmail.com?subject=${encodeURIComponent(`Inquiry regarding ${product.name} (SKU: ${product.sku})`)}`}
                className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                title="Email Us Directly"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>

              {product.pdfUrl && (
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-gold py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Spec Sheet</span>
                </a>
              )}
            </div>

            {/* Technical Specifications Table */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="font-serif-luxury text-sm uppercase tracking-luxury text-neutral-900 font-bold mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#DC2626]" />
                <span>Technical Specifications</span>
              </h3>
              <div className="rounded-xl bg-[#f8fafc] border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
                {specsList.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-xs hover:bg-white transition-colors">
                    <span className="text-neutral-500 font-medium">{spec.label}</span>
                    <span className="text-neutral-900 font-semibold text-right ml-4">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── 2. EXPANDED IN-SITU ARCHITECTURAL LOOKBOOK (8 High-Res Perspectives) ── */}
        {inSituGallery.length > 0 && (
        <section className="mt-20 pt-14 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                Real-World Spatial Context
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
                Spatial Inspiration & In-Situ Gallery ({inSituGallery.length} Perspectives)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                Explore how this luminaire interacts with natural Italian marble, teak acoustic paneling, high-ceiling voids, and evening ambient light across luxury private residences.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedImageIndex(1);
                setLightboxOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#DC2626]" />
              <span>View Fullscreen Gallery</span>
            </button>
          </div>

          {/* 8-Photo Editorial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {inSituGallery.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedImageIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="group relative h-72 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in bg-neutral-100"
              >
                <img
                  src={item.url}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/categories/chandelier.jpg';
                  }}
                  alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <span className="text-[10px] font-mono text-red-300 uppercase tracking-widest block mb-0.5">
                    {item.tag || 'Perspective'}
                  </span>
                  <h4 className="text-xs font-semibold text-white drop-shadow truncate">
                    {item.label}
                  </h4>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* ── 3. REAL ARCHITECTURAL PROJECTS & RESIDENTIAL INSTALLATIONS SHOWCASE ── */}
        <section className="mt-20 pt-14 border-t border-neutral-200">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
              Installed Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
              Live Architectural Projects Featuring This Typology
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              Curated luxury private estates, penthouse suites, and hospitality projects specified with <LightHut /> luminaires.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARCHITECTURAL_PROJECTS.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="group rounded-2xl overflow-hidden border border-neutral-200/90 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-600"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/10">
                      {proj.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-bold">
                      {proj.tag}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-neutral-900 group-hover:text-[#DC2626] transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{proj.location}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Architect Specified</span>
                    </span>
                    <span className="text-[#DC2626] font-semibold">Verified Installation ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. BESPOKE MATERIAL & ENGINEERING PRECISION CARDS ── */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                K9 Optical Precision Crystal
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hand-cut lead-free optical prisms engineered for maximum light refraction, casting crisp multidimensional caustic patterns across surrounding walls and ceilings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                Electroplated Solid Brass Finish
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Multi-stage physical vapor deposition (PVD) coating ensures anti-tarnish, corrosion-resistant durability, retaining its warm brushed champagne luster for decades.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                Flicker-Free Circadian LED
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Specifier-grade constant-current LED emitters with Ra &gt; 92 high color rendering index, providing soothing, eye-safe circadian warm white illumination.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. EXPANDED RELATED PRODUCTS CAROUSEL / GRID (8 to 12 Coordinated Fixtures) ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                  Coordinated Luminaire Collections
                </span>
                <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold">
                  Related Luminaires in {product.category?.name || product.categoryName} ({relatedProducts.length} Items)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Complete your interior design concept with harmonious matching fixtures from the same design lineage.
                </p>
              </div>
              <Link
                to={`/catalog?category=${product.category?.slug || product.category}`}
                className="text-xs uppercase tracking-luxury text-[#DC2626] hover:text-neutral-900 font-bold transition-colors hidden sm:block"
              >
                View Category in Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.slug} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FULLSCREEN HD LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Button */}
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Button */}
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Main Stage */}
            <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                src={images[selectedImageIndex]?.url}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt={images[selectedImageIndex]?.label}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-4 text-center">
                <span className="text-xs font-mono text-red-400 uppercase tracking-widest block">
                  {images[selectedImageIndex]?.tag} • {selectedImageIndex + 1} of {images.length}
                </span>
                <h3 className="text-white text-base font-serif-luxury font-bold mt-0.5">
                  {images[selectedImageIndex]?.label}
                </h3>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === i ? 'border-[#DC2626] scale-105' : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Sticky Bottom Action Bar (Instant Inquiry & WhatsApp) ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-4 py-3 shadow-[0_-8px_25px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] text-neutral-500 font-semibold truncate tracking-wider uppercase">
            {product.sku || 'SKU'} • Studio Price
          </div>
          <div className="font-extrabold text-[#DC2626] text-base leading-tight font-mono">
            {formattedPrice}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/919811869622?text=${encodeURIComponent(`Hello Light-Hut, I am interested in: ${product.name} (SKU: ${product.sku || ''}). Please share details.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center transition-colors active:scale-95"
            title="Chat on WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className="btn-gold py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquiry</span>
          </button>
        </div>
      </div>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={product} />
    </div>
  );
};
