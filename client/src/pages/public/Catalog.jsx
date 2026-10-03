import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  X,
  Lightbulb,
  Layers,
  Download,
  Home,
  Check,
  ArrowRight,
  LayoutGrid,
  Grid,
} from 'lucide-react';
import { catalogService, productService } from '../../services/api';
import { ProductCard } from '../../components/catalog/ProductCard';
import { useSettings } from '../../context/SettingsContext';
import { CascadingCategoryDropdown, PRODUCT_CATEGORIES_DATA } from '../../components/common/CascadingCategoryDropdown';
import { MASTER_CATEGORIES } from '../../data/catalogData';

// Curated Category Metadata & Icons Helper
const CATEGORY_META_HELPER = {
  chandelier: {
    icon: '✨',
    tag: 'Grand Architectural Statements',
    image: '/categories/chandelier.jpg',
  },
  'pendant-lamp': {
    icon: '🔆',
    tag: 'Sculptural Suspended Pendants',
    image: '/categories/pendant-lamp.jpg',
  },
  'wall-lamp': {
    icon: '💡',
    tag: 'Architectural Sconces & Grazers',
    image: '/categories/wall-lamp.jpg',
  },
  'double-height': {
    icon: '🏛️',
    tag: 'Monumental High-Ceiling Cascades',
    image: '/categories/double-height.jpg',
  },
  'dining-table-lamp': {
    icon: '🍽️',
    tag: 'Curated Banquet & Island Illumination',
    image: '/categories/dining-table-lamp.jpg',
  },
  'outdoor-light': {
    icon: '🌿',
    tag: 'IP65 Weatherproof Luminaires',
    image: '/categories/outdoor-light.jpg',
  },
  'table-lamp': {
    icon: '🪔',
    tag: 'Sculptural Marble & Metal Accents',
    image: '/categories/table-lamp.jpg',
  },
  'floor-lamp': {
    icon: '🕯️',
    tag: 'Freestanding Arcs & Reading Columns',
    image: '/categories/floor-lamp.jpg',
  },
  'led-filament-bulb': {
    icon: '💫',
    tag: 'Warm Vintage Edison Filament',
    image: '/categories/led-filament-bulb.jpg',
  },
  'spare-part': {
    icon: '🔧',
    tag: 'Architectural Components & Drivers',
    image: '/categories/spare-part.jpg',
  },
};

// 10 Canonical Master Categories Slugs
const MAIN_10_CATEGORY_SLUGS = [
  'wall-lamp',
  'pendant-lamp',
  'chandelier',
  'double-height',
  'dining-table-lamp',
  'outdoor-light',
  'table-lamp',
  'floor-lamp',
  'led-filament-bulb',
  'spare-part',
];

export const Catalog = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(MASTER_CATEGORIES);
  const [activeCategoryMeta, setActiveCategoryMeta] = useState(null);
  const [allTotal, setAllTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'products'

  // URL Query Params
  const currentCategory = searchParams.get('category') || 'all';
  const currentSub = searchParams.get('sub') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'sortOrder';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentFeatured = searchParams.get('featured') || '';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);

  // Sync viewMode to 'categories' when 'all' is selected and no active query filter
  useEffect(() => {
    if (currentCategory === 'all' && !currentSearch && !currentFeatured && !currentSub) {
      setViewMode('categories');
    }
  }, [currentCategory, currentSearch, currentFeatured, currentSub]);

  // Computed Flag: When true, right side renders 10 Category Cards
  const isCategoriesView =
    currentCategory === 'all' &&
    !currentSearch &&
    !currentFeatured &&
    !currentSub &&
    viewMode === 'categories';

  // Filter strictly to the 10 Master Categories for horizontal pills, cards, and sidebar
  const mainCategories = useMemo(() => {
    const mapBySlug = {};
    categories.forEach((c) => {
      mapBySlug[c.slug] = c;
    });
    const result = MAIN_10_CATEGORY_SLUGS.map((slug) => mapBySlug[slug]).filter(Boolean);
    return result.length > 0 ? result : categories.slice(0, 10);
  }, [categories]);

  // Document Title
  useEffect(() => {
    document.title = `Lamps & Lighting Catalog | ${settings.companyName || 'Light-Hut Decorative Solutions'}`;
  }, [settings.companyName]);

  // Scroll to top on filter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentCategory, currentSub]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch catalog data from backend
  useEffect(() => {
    let isMounted = true;

    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 24,
          sort: currentSort,
          category: currentCategory !== 'all' ? currentCategory : undefined,
          search: currentSearch.trim() !== '' ? currentSearch.trim() : undefined,
          featured: currentFeatured !== '' ? currentFeatured : undefined,
          sub: currentSub !== '' ? currentSub : undefined,
        };

        const data = await catalogService.getCatalog(params);

        if (isMounted) {
          if (data && data.success) {
            setProducts(data.products || []);
            setTotalProducts(data.pagination?.total ?? data.products?.length ?? 0);
            setTotalPages(data.pagination?.totalPages || 1);
            if (data.categories && data.categories.length > 0) {
              setCategories(data.categories);
            }
            if (data.allTotal !== undefined) {
              setAllTotal(data.allTotal);
            }
            if (data.activeCategory) {
              setActiveCategoryMeta(data.activeCategory);
            }
          } else {
            // Graceful fallback to standard product API
            const fallback = await productService.getProducts(params);
            if (fallback && fallback.success) {
              setProducts(fallback.products || []);
              setTotalProducts(fallback.total || fallback.products?.length || 0);
              setTotalPages(fallback.totalPages || 1);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalogData();

    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentSub, currentSearch, currentSort, currentPage, currentFeatured]);

  // Filter products by active subcategory if selected
  const displayedProducts = useMemo(() => {
    if (!currentSub) return products;
    const target = currentSub.toLowerCase();
    const filtered = products.filter((p) => {
      const pSub = String(p.subcategory || p.subCategory || '').toLowerCase();
      const pSlug = String(p.slug || '').toLowerCase();
      const pName = String(p.name || '').toLowerCase();
      return pSub.includes(target) || target.includes(pSub) || pSlug.includes(target) || pName.includes(target);
    });
    return filtered.length > 0 ? filtered : products;
  }, [products, currentSub]);

  // Active Category Information (Computed with backend priority)
  const activeCategoryData = useMemo(() => {
    if (activeCategoryMeta && (activeCategoryMeta.slug === currentCategory || currentCategory === 'all')) {
      return {
        name: activeCategoryMeta.name || 'All Architectural Lighting',
        tag: activeCategoryMeta.tag || 'Complete Lighting Portfolio',
        description:
          activeCategoryMeta.description ||
          'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
        image: activeCategoryMeta.heroImage || '/showroom-hero-hd.jpg',
        total: activeCategoryMeta.total ?? totalProducts,
      };
    }

    if (!currentCategory || currentCategory === 'all') {
      return {
        name: 'All Architectural Lighting',
        tag: 'Complete Lighting Portfolio',
        description:
          'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
        image: '/showroom-hero-hd.jpg',
        total: allTotal || totalProducts,
      };
    }

    // Search in current categories
    const found = categories.find((c) => c.slug === currentCategory);
    if (found) {
      return {
        name: found.name,
        tag: found.tag || 'Curated Architectural Series',
        description:
          found.description ||
          'Engineered with museum-grade color rendering, precision optics, and architectural craftsmanship.',
        image: found.image || '/showroom-hero-hd.jpg',
        total: found.total ?? totalProducts,
      };
    }

    // Check subcategories
    for (const cat of categories) {
      const sub = cat.subcategories?.find((s) => s.slug === currentCategory);
      if (sub) {
        return {
          name: sub.name,
          tag: `${cat.name} • Precision Luminaire`,
          description: `Architectural ${sub.name.toLowerCase()} engineered for modern residential and luxury hospitality spaces.`,
          image: cat.image || '/showroom-hero-hd.jpg',
          total: sub.count ?? totalProducts,
        };
      }
    }

    return {
      name: currentCategory.replace(/-/g, ' ').toUpperCase(),
      tag: 'Architectural Luminaire Series',
      description: 'Engineered with museum-grade color rendering, precision optics, and architectural craftsmanship.',
      image: '/showroom-hero-hd.jpg',
      total: totalProducts,
    };
  }, [activeCategoryMeta, currentCategory, categories, allTotal, totalProducts]);

  // Update URL Query Parameters Helper
  const updateQuery = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '' || val === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 on filter/search change unless page is explicitly changed
    if (!updates.page) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ search: searchInput });
  };

  const clearAllFilters = () => {
    setViewMode('categories');
    setSearchInput('');
    setSearchParams({});
  };

  // Printable Catalog PDF Brochure Generator for Currently Filtered Fixtures
  const handleDownloadCatalog = () => {
    const printWindow = window.open('', '_blank');
    const categoryTitle = currentSub
      ? `${activeCategoryData?.name || ''} - ${currentSub.replace(/-/g, ' ').toUpperCase()}`
      : activeCategoryData?.name || 'All Architectural Lighting';

    // Get the exact fixtures currently displayed below
    let fixtureList = products && products.length > 0 ? products : [];
    if (fixtureList.length === 0 && currentCategory !== 'all') {
      fixtureList = MASTER_PRODUCTS.filter((p) => p.category === currentCategory);
    }

    if (!printWindow) {
      alert('Please allow popups in your browser to generate and view the Catalog PDF.');
      return;
    }

    const productsHtml = fixtureList
      .map(
        (p, idx) => `
        <div class="product-card">
          <div class="badge-idx">#${idx + 1}</div>
          <div class="img-box">
            <img src="${p.primaryImage || p.images?.[0]?.url || '/showroom-hero-hd.jpg'}" alt="${p.name}" />
          </div>
          <div class="cat-tag">${p.categoryName || p.category?.name || activeCategoryData?.name || 'Architectural Lighting'}</div>
          <div class="product-title">${p.name}</div>
          <div class="spec-table">
            ${p.sku ? `<div class="spec-row"><span class="spec-lbl">SKU:</span> <strong class="spec-val-sku">${p.sku}</strong></div>` : ''}
            ${p.specifications?.wattage ? `<div class="spec-row"><span class="spec-lbl">Wattage:</span> <span class="spec-val">${p.specifications.wattage}</span></div>` : ''}
            ${p.specifications?.colorTemperature ? `<div class="spec-row"><span class="spec-lbl">CCT / Glow:</span> <span class="spec-val">${p.specifications.colorTemperature}</span></div>` : ''}
            ${p.specifications?.finish ? `<div class="spec-row"><span class="spec-lbl">Finish:</span> <span class="spec-val">${p.specifications.finish}</span></div>` : ''}
            ${p.specifications?.material ? `<div class="spec-row"><span class="spec-lbl">Material:</span> <span class="spec-val">${p.specifications.material}</span></div>` : ''}
            ${p.specifications?.dimensions ? `<div class="spec-row"><span class="spec-lbl">Dimensions:</span> <span class="spec-val">${p.specifications.dimensions}</span></div>` : ''}
          </div>
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${categoryTitle} - Light-Hut Decorative Solutions Catalog</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              margin: 0;
              padding: 24px;
              color: #0f172a;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              margin-bottom: 20px;
              padding: 12px 18px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            }
            .btn-print {
              background: #DC2626;
              color: #ffffff;
              border: none;
              padding: 10px 22px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 13px;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(220,38,38,0.3);
            }
            .btn-print:hover { background: #b91c1c; }
            .btn-close {
              background: #ffffff;
              color: #475569;
              border: 1px solid #cbd5e1;
              padding: 9px 16px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
            }
            .btn-close:hover { background: #f1f5f9; }
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 14px;
              margin-bottom: 18px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .header-info {
              text-align: right;
              font-size: 9.5px;
              color: #475569;
              line-height: 1.5;
            }
            .collection-strip {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #DC2626;
              border-radius: 10px;
              padding: 14px 18px;
              margin-bottom: 22px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
            .product-card {
              break-inside: avoid;
              page-break-inside: avoid;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              overflow: hidden;
              padding: 14px;
              background: #ffffff;
              display: flex;
              flex-direction: column;
              position: relative;
            }
            .badge-idx {
              position: absolute;
              top: 18px;
              right: 18px;
              background: #0f172a;
              color: #ffffff;
              font-size: 9px;
              font-weight: bold;
              padding: 2px 7px;
              border-radius: 4px;
              font-family: monospace;
            }
            .img-box {
              width: 100%;
              height: 190px;
              border-radius: 8px;
              overflow: hidden;
              background: #f8fafc;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #f1f5f9;
            }
            .img-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .cat-tag {
              font-size: 10px;
              color: #DC2626;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-bottom: 3px;
            }
            .product-title {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 8px 0;
              line-height: 1.3;
            }
            .spec-table {
              font-size: 10.5px;
              color: #475569;
              line-height: 1.6;
              border-top: 1px solid #f1f5f9;
              padding-top: 8px;
              margin-top: auto;
            }
            .spec-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .spec-lbl {
              color: #94a3b8;
              font-weight: 600;
            }
            .spec-val {
              color: #1e293b;
              font-weight: 500;
            }
            .spec-val-sku {
              color: #0f172a;
              font-family: monospace;
            }
            .footer {
              margin-top: 36px;
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              font-size: 10px;
              color: #64748b;
              display: flex;
              justify-content: space-between;
              line-height: 1.5;
            }
            @media print {
              body { padding: 10px; }
              .no-print { display: none !important; }
              @page { size: A4 portrait; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <!-- Floating Toolbar (Hidden when printing/saving to PDF) -->
          <div class="no-print">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="window.print()" class="btn-print">
                <span>🖨️ Print / Save as PDF</span>
              </button>
              <button onclick="window.close()" class="btn-close">
                Close Window
              </button>
            </div>
            <div style="font-size: 12px; color: #64748b;">
              💡 Tip: In the printer destination, select <strong>"Save as PDF"</strong> to save this catalog to your device.
            </div>
          </div>

          <!-- Document Header -->
          <div class="header">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="/categories/logo.png" style="height: 48px; width: auto; object-fit: contain;" alt="Light-Hut Logo" />
              <div style="border-left: 2px solid #e2e8f0; padding-left: 12px; font-family: Calibri, 'Calibri (Body)', 'Carlito', sans-serif;">
                <div style="font-size: 19px; font-weight: 700; letter-spacing: -0.01em; color: #0f172a; line-height: 1.1;">Light-<span style="color: #DC2626;">H</span>ut<sup style="font-size: 0.6em; top: -0.5em;">®</sup></div>
                <div style="font-size: 10px; font-weight: 700; color: #0f172a; letter-spacing: 0.03em; margin-top: 2px;">Decorative <span style="color: #DC2626;">Solutions</span></div>
              </div>
            </div>
            <div class="header-info">
              <div><strong>Showroom:</strong> 4B/27, Tilak Nagar, Lighting Market, New Delhi - 110018</div>
              <div><strong>Works:</strong> C37/4, Lawrence Road Industrial Area, New Delhi - 110035</div>
              <div><strong>Direct Sales:</strong> +91 98118 69622 • +91 99999 50543</div>
              <div><strong>Catalog Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • <strong>${fixtureList.length} Fixtures</strong></div>
            </div>
          </div>

          <!-- Collection Title Banner -->
          <div class="collection-strip">
            <div>
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #DC2626; margin-bottom: 2px;">
                Official Specification Catalog
              </div>
              <div style="font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em;">
                ${categoryTitle}
              </div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700;">
              ${fixtureList.length} Curated Fixtures
            </div>
          </div>

          <!-- Product Cards Grid -->
          <div class="grid">
            ${productsHtml}
          </div>

          <!-- Document Footer -->
          <div class="footer">
            <div style="font-family: Calibri, 'Calibri (Body)', 'Carlito', sans-serif;"><strong>Light-<span style="color: #DC2626;">H</span>ut Decorative Solutions</strong> • All Rights Reserved</div>
            <div>Official Inquiries: lighthut.in@gmail.com • Web: www.lighthut.in</div>
          </div>

          <script>
            window.addEventListener('load', function() {
              var images = document.images;
              var totalImages = images.length;
              var loadedImages = 0;
              if (totalImages === 0) {
                setTimeout(function() { window.print(); }, 400);
                return;
              }
              function checkAllLoaded() {
                loadedImages++;
                if (loadedImages >= totalImages) {
                  setTimeout(function() { window.print(); }, 500);
                }
              }
              for (var i = 0; i < totalImages; i++) {
                if (images[i].complete) {
                  checkAllLoaded();
                } else {
                  images[i].addEventListener('load', checkAllLoaded);
                  images[i].addEventListener('error', checkAllLoaded);
                }
              }
              setTimeout(function() {
                if (loadedImages < totalImages) {
                  window.print();
                }
              }, 2500);
            });
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] min-h-screen">
      
      {/* ── Breadcrumb & Top Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 py-1" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors">
            <Home className="w-3.5 h-3.5 text-neutral-400" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <button
            type="button"
            onClick={() => {
              setViewMode('categories');
              updateQuery({ category: 'all' });
            }}
            className={`cursor-pointer transition-colors ${
              currentCategory === 'all' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Catalog
          </button>
          {currentCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[#DC2626] font-semibold">{activeCategoryData.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Dynamic Category Hero Banner ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-md">
          {/* Background Category Image */}
          <div className="absolute inset-0">
            <img
              src={activeCategoryData.image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/showroom-hero-hd.jpg';
              }}
              alt={activeCategoryData.name}
              className="w-full h-full object-cover object-center filter brightness-[1.0] contrast-[1.02] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 text-[#DC2626]" />
                {activeCategoryData.tag}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                {activeCategoryData.name}
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 mt-2.5 max-w-xl font-light leading-relaxed drop-shadow">
                {activeCategoryData.description}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5">
              <span className="text-xs font-mono text-white bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl font-semibold shadow-sm">
                {activeCategoryData.total ?? totalProducts}{' '}
                {(activeCategoryData.total ?? totalProducts) === 1 ? 'Fixture Available' : 'Fixtures Available'}
              </span>

              {/* Prominently Highlighted Dynamic Category Catalog PDF Button */}
              <button
                type="button"
                onClick={handleDownloadCatalog}
                className="relative inline-flex items-center justify-center w-full sm:w-auto gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#b91c1c] text-white text-xs sm:text-[13px] font-black uppercase tracking-wider shadow-[0_8px_25px_rgba(220,38,38,0.55)] border-2 border-white/60 hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ring-4 ring-[#DC2626]/30 overflow-hidden text-center"
                title={`Download official PDF specification catalog for ${activeCategoryData.name}`}
              >
                {/* Glowing Sheen Animation */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <Download className="w-4 h-4 text-white drop-shadow animate-bounce group-hover:animate-none transition-transform" />
                <span className="drop-shadow font-black">
                  {currentCategory !== 'all'
                    ? `Download ${activeCategoryData.name} Catalog (PDF)`
                    : 'Download 2026 Catalog (PDF)'}
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* ── Horizontal Category Quick Filter Bar with Real Live Counts ── */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => {
              setViewMode('categories');
              updateQuery({ category: 'all', sub: undefined });
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              currentCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-md scale-102 font-bold'
                : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs'
            }`}
          >
            All Categories ({allTotal || totalProducts})
          </button>

          {mainCategories.map((cat) => {
            const isSelected =
              currentCategory === cat.slug || cat.subcategories?.some((s) => s.slug === currentCategory);
            const count = cat.total ?? cat.productsCount ?? 0;

            return (
              <button
                key={cat.slug || cat._id}
                type="button"
                onClick={() => updateQuery({ category: cat.slug, sub: undefined })}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#DC2626] text-white shadow-md scale-102 font-bold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Subcategories Quick Filter Bar with Real Lighting Images ── */}
        {currentCategory !== 'all' && (() => {
          const activeCatConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === currentCategory);
          if (!activeCatConfig?.sub || activeCatConfig.sub.length === 0) return null;
          return (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none touch-pan-x bg-white p-2.5 rounded-2xl border border-neutral-200/90 shadow-2xs -mx-4 px-4 sm:mx-0 sm:px-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0 px-2 border-r border-neutral-200 mr-1">
                <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{activeCatConfig.name} Types:</span>
              </div>

              {/* All in Category */}
              <button
                type="button"
                onClick={() => updateQuery({ sub: undefined })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !currentSub
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                All {activeCatConfig.name}s
              </button>

              {/* Each Subcategory with Real Image Thumbnail */}
              {activeCatConfig.sub.map((subItem) => {
                const isSubSelected = currentSub === subItem.slug;
                return (
                  <button
                    key={subItem.slug}
                    type="button"
                    onClick={() => updateQuery({ sub: isSubSelected ? undefined : subItem.slug })}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                      isSubSelected
                        ? 'bg-white border-[#DC2626] text-[#DC2626] shadow-sm ring-2 ring-[#DC2626]/20 font-bold'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200 shadow-2xs">
                      <img
                        src={subItem.image}
                        alt={subItem.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span>{subItem.name}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* ── Search Bar & Filter Controls Bar ── */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by SKU, model, finish, or material..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-[#DC2626] shadow-sm transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateQuery({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* Quick Cascading Hierarchy Dropdown Button (Desktop & Tablet only; Mobile uses dedicated filter drawer) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                id="catalog-cascading-dropdown-btn"
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  catalogDropdownOpen
                    ? 'bg-[#DC2626] text-white border border-[#DC2626]'
                    : 'bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Hierarchy</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    catalogDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {catalogDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <CascadingCategoryDropdown onClose={() => setCatalogDropdownOpen(false)} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={currentSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 focus:outline-none focus:border-[#DC2626] shadow-sm cursor-pointer"
              >
                <option value="sortOrder">Featured & Order</option>
                <option value="newest">Newest First</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="sku_asc">SKU Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Active Filter Badges ── */}
        {(currentCategory !== 'all' || currentSub || currentSearch || currentFeatured) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mr-1">
              Active:
            </span>
            {currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Category: {activeCategoryData.name}
                <button
                  type="button"
                  onClick={() => updateQuery({ category: 'all', sub: undefined })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSub && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Type: {currentSub.replace(/-/g, ' ').toUpperCase()}
                <button
                  type="button"
                  onClick={() => updateQuery({ sub: undefined })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Search: "{currentSearch}"
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateQuery({ search: '' });
                  }}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Featured Only
                <button
                  type="button"
                  onClick={() => updateQuery({ featured: '' })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline ml-2 font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Main Layout: Sidebar + Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <span className="text-xs uppercase tracking-wider text-neutral-900 font-bold flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
                  Categories
                </span>
                {currentCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('categories');
                      updateQuery({ category: 'all', sub: undefined });
                    }}
                    className="text-[11px] text-[#DC2626] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category List with Subcategories */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('categories');
                    updateQuery({ category: 'all', sub: undefined });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentCategory === 'all'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      currentCategory === 'all' ? 'bg-white/20 text-white' : 'text-neutral-500 bg-neutral-100'
                    }`}
                  >
                    {allTotal || totalProducts}
                  </span>
                </button>

                {mainCategories.map((cat) => {
                  const isParentActive = currentCategory === cat.slug;
                  const catConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === cat.slug);
                  const subList = catConfig?.sub || cat.subcategories || [];
                  const isChildActive = subList.some((s) => s.slug === currentCategory || s.slug === currentSub);
                  const isExpanded = isParentActive || isChildActive;
                  const count = cat.total ?? cat.productsCount ?? 0;

                  return (
                    <div key={cat.slug || cat._id} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuery({ category: cat.slug, sub: undefined })}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isParentActive
                            ? 'bg-[#DC2626] text-white shadow-sm font-bold'
                            : isChildActive
                            ? 'bg-neutral-100 text-[#DC2626] font-bold'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}
                      >
                        <span className="truncate text-left">{cat.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isParentActive
                              ? 'bg-white/20 text-white'
                              : 'text-neutral-500 bg-neutral-100'
                          }`}
                        >
                          {count}
                        </span>
                      </button>

                      {/* Subcategories (Indented under parent) with Real Images */}
                      {isExpanded && subList.length > 0 && (
                        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-200 ml-3 my-1">
                          {subList.map((sub) => {
                            const isSubSelected = currentSub === sub.slug || currentCategory === sub.slug;
                            return (
                              <button
                                key={sub.slug}
                                type="button"
                                onClick={() => updateQuery({ category: cat.slug, sub: sub.slug })}
                                className={`w-full flex items-center justify-between p-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                  isSubSelected
                                    ? 'bg-red-50 text-[#DC2626] font-bold border border-red-200/80 shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {sub.image && (
                                    <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                      <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  <span className="truncate text-left font-medium">{sub.name}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Featured Only Filter Toggle */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentFeatured === 'true'}
                    onChange={(e) => updateQuery({ featured: e.target.checked ? 'true' : '' })}
                    className="rounded border-neutral-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-700 group-hover:text-neutral-900 transition-colors flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                    Featured Fixtures Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid / Category Cards Area */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <div key={n} className="h-96 rounded-2xl bg-neutral-200 animate-pulse" />
                ))}
              </div>
            ) : isCategoriesView ? (
              /* ── 1. Category Cards Grid View (When All Categories is selected) ── */
              <div className="space-y-6">
                {/* Section Header with View Mode Switcher */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 font-bold flex items-center gap-2">
                      <span>Architectural Lighting Collections</span>
                      <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200">
                        {mainCategories.length} Collections
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Explore our handcrafted luminaires by category. Select a collection below to view fixtures and specifications.
                    </p>
                  </div>

                  {/* View Mode Toggle: Collections vs All Fixtures Flat List */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0 border border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => setViewMode('categories')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'categories'
                          ? 'bg-white text-[#DC2626] shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Collections ({mainCategories.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('products')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'products'
                          ? 'bg-white text-[#DC2626] shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>All Fixtures ({allTotal || totalProducts})</span>
                    </button>
                  </div>
                </div>

                {/* The 10 Categories Cards */}
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {mainCategories.map((cat, idx) => {
                    const meta = CATEGORY_META_HELPER[cat.slug] || {};
                    const catConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === cat.slug);
                    const subList = catConfig?.sub || cat.subcategories || [];
                    const count = cat.total ?? cat.productsCount ?? 0;
                    const icon = meta.icon || catConfig?.icon || cat.icon || '✨';
                    const tag = cat.tag || meta.tag || 'Curated Architectural Series';
                    const coverImg = cat.image || meta.image || `/categories/${cat.slug}.jpg`;

                    return (
                      <motion.div
                        key={cat.slug || cat._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.04 }}
                        onClick={() => {
                          updateQuery({ category: cat.slug, sub: undefined });
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 hover:border-[#DC2626]/50 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        {/* Category Cover Image Header with Badges */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 shrink-0">
                          <img
                            src={coverImg}
                            alt={cat.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/categories/chandelier.jpg';
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          {/* Gradient Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-colors" />

                          {/* Top Badges */}
                          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
                            <span className="text-[11px] font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 shadow-xs flex items-center gap-1.5">
                              <span className="text-[#DC2626]">#{String(idx + 1).padStart(2, '0')}</span>
                              <span>{icon}</span>
                            </span>

                            <span className="text-[11px] font-bold text-white bg-[#DC2626] backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                              {count} {count === 1 ? 'Design' : 'Designs'}
                            </span>
                          </div>

                          {/* Bottom Overlay Title & Subtitle */}
                          <div className="absolute bottom-3.5 inset-x-3.5 pointer-events-none">
                            <div className="text-[11px] uppercase tracking-wider font-semibold text-red-300 mb-1 line-clamp-1">
                              {tag}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif text-white font-bold group-hover:text-red-200 transition-colors drop-shadow-sm flex items-center justify-between">
                              <span>{cat.name}</span>
                              <div className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-[#DC2626] backdrop-blur-md flex items-center justify-center transition-all duration-300 text-white shrink-0 group-hover:scale-110 shadow-xs">
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </h3>
                          </div>
                        </div>

                        {/* Card Body: Description, Subcategories & Action */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                          {cat.description && (
                            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                              {cat.description}
                            </p>
                          )}

                          {/* Subcategories (if any) */}
                          {subList && subList.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                <span>Popular Types ({subList.length})</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {subList.slice(0, 4).map((sub) => (
                                  <button
                                    key={sub.slug}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuery({ category: cat.slug, sub: sub.slug });
                                      window.scrollTo({ top: 380, behavior: 'smooth' });
                                    }}
                                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-[#DC2626] transition-colors border border-neutral-200/60 hover:border-red-200 cursor-pointer"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                                {subList.length > 4 && (
                                  <span className="text-[10px] font-semibold text-neutral-400 self-center">
                                    +{subList.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Footer */}
                          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#DC2626] group-hover:text-red-700">
                            <span>View {cat.name} Fixtures</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : displayedProducts.length > 0 ? (
              /* ── 2. Product Cards Grid View (When category selected or search active) ── */
              <>
                {/* Category Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3 mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    {currentCategory !== 'all' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('categories');
                          updateQuery({ category: 'all', sub: undefined });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-700 hover:text-[#DC2626] hover:border-[#DC2626] transition-all shadow-xs cursor-pointer group"
                      >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>All Categories</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setViewMode('categories')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-700 hover:text-[#DC2626] hover:border-[#DC2626] transition-all shadow-xs cursor-pointer group"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-[#DC2626]" />
                        <span>View By Categories</span>
                      </button>
                    )}
                    <div className="h-4 w-px bg-neutral-300 hidden sm:block" />
                    <span className="text-sm sm:text-base font-serif font-bold text-neutral-900">
                      {activeCategoryData.name}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      ({displayedProducts.length} {displayedProducts.length === 1 ? 'fixture' : 'fixtures'})
                    </span>
                  </div>

                  {currentCategory === 'all' && (
                    <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0 border border-neutral-200/80">
                      <button
                        type="button"
                        onClick={() => setViewMode('categories')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Collections ({mainCategories.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('products')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-[#DC2626] shadow-xs cursor-pointer"
                      >
                        <Grid className="w-3.5 h-3.5 text-[#DC2626]" />
                        <span>All Fixtures ({allTotal || totalProducts})</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product._id || product.slug} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-14 pt-8 border-t border-neutral-200 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => updateQuery({ page: currentPage - 1 })}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm font-semibold cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateQuery({ page: p })}
                          className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
                            currentPage === p
                              ? 'bg-[#DC2626] text-white shadow'
                              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => updateQuery({ page: currentPage + 1 })}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm font-semibold cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center rounded-2xl bg-white border border-neutral-200 p-8 shadow-sm">
                <Lightbulb className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-neutral-900 font-bold">No Fixtures Found</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2 leading-relaxed">
                  We couldn't find any luminaires matching your criteria. Try resetting your search filters or browse all categories.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#b91c1c] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 shrink-0">
                <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#DC2626]" /> Filter Fixtures
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    Select Category
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('categories');
                      updateQuery({ category: 'all', sub: undefined });
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      currentCategory === 'all'
                        ? 'bg-[#DC2626] text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>All Categories</span>
                    <span>({allTotal || totalProducts})</span>
                  </button>

                  {mainCategories.map((cat) => {
                    const isSelected = currentCategory === cat.slug;
                    const catCfg = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === cat.slug);
                    const subList = catCfg?.sub || cat.subcategories || [];

                    return (
                      <div key={cat.slug || cat._id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            updateQuery({ category: cat.slug, sub: undefined });
                            if (isSelected) setMobileFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-[#DC2626] text-white font-bold shadow-xs'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[10px] font-mono opacity-80">
                            ({cat.total ?? cat.productsCount ?? 0})
                          </span>
                        </button>

                        {/* If category is selected, show subcategories with images in mobile drawer */}
                        {isSelected && subList.length > 0 && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-300 ml-3 my-1">
                            {subList.map((sub) => {
                              const isSubSelected = currentSub === sub.slug;
                              return (
                                <button
                                  key={sub.slug}
                                  type="button"
                                  onClick={() => {
                                    updateQuery({ category: cat.slug, sub: isSubSelected ? undefined : sub.slug });
                                    setMobileFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between p-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-red-50 text-[#DC2626] font-bold border border-red-200 shadow-2xs'
                                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {sub.image && (
                                      <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                        <img
                                          src={sub.image}
                                          alt={sub.name}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                    <span className="truncate text-left font-medium">{sub.name}</span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFeatured === 'true'}
                      onChange={(e) => {
                        updateQuery({ featured: e.target.checked ? 'true' : '' });
                      }}
                      className="rounded border-neutral-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-neutral-800">
                      Featured Fixtures Only
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-xs font-bold text-white hover:bg-[#b91c1c] cursor-pointer shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
