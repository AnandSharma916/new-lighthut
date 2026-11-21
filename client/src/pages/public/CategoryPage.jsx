import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Layers, Lightbulb, Sparkles, Filter, Maximize2, X, ChevronRight } from 'lucide-react';
import { categoryService, productService } from '../../services/api';
import { ProductCard } from '../../components/catalog/ProductCard';
import { useSettings } from '../../context/SettingsContext';
import { MASTER_PRODUCTS } from '../../data/catalogData';
import { PRODUCT_CATEGORIES_DATA } from '../../components/common/CascadingCategoryDropdown';

const CATEGORY_BANNER_MAP = {
  chandelier: '/hero-chandelier.jpg',
  'led-chandelier': '/hero-chandelier.jpg',
  'e14-chandelier': '/categories/chandelier.jpg',
  'profile-chandelier': '/hero-chandelier.jpg',
  'glass-chandelier': '/hero-chandelier.jpg',
  'italian-chandelier': '/categories/chandelier.jpg',
  'modern-chandelier': '/hero-chandelier.jpg',
  'antic-chandelier': '/categories/chandelier.jpg',
  'antique-chandelier': '/categories/chandelier.jpg',
  'fan-chandelier': '/hero-chandelier.jpg',
  'ceiling-chandelier': '/categories/chandelier.jpg',
  'celling-chandelier': '/categories/chandelier.jpg',
  'double-height': '/hero-double-height.jpg',
  'crystal-chandelier': '/hero-double-height.jpg',
  'modern-chandelier-dh': '/hero-double-height.jpg',
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
  'outdoor-hanging-lamp': '/categories/outdoor-light.jpg',
  outdoor: '/hero-outdoor.jpg',
  'table-lamp': '/banner-bedroom.jpg',
  'dining-table-lamp': '/banner-amalfi.jpg',
  'floor-lamp': '/banner-study.jpg',
  'spare-part': '/craft-main.jpg',
  'hanging-base': '/craft-main.jpg',
  'spare-driver': '/craft-main.jpg',
  'led-filament-bulb': '/craft-detail.jpg',
};

export const CategoryPage = () => {
  const { settings } = useSettings();
  const { slug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSub, setSelectedSub] = useState(subSlug || searchParams.get('sub') || 'all');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Sync subSlug from URL params if present
  useEffect(() => {
    if (subSlug) {
      setSelectedSub(subSlug);
    } else if (searchParams.get('sub')) {
      setSelectedSub(searchParams.get('sub'));
    } else {
      setSelectedSub('all');
    }
  }, [subSlug, searchParams]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        const [catData, prodData] = await Promise.all([
          categoryService.getCategoryBySlug(slug),
          productService.getProducts({ category: slug, limit: 50 }),
        ]);

        if (catData.success && catData.category) {
          setCategory(catData.category);
          document.title = `${catData.category.name} | ${settings.companyName || 'Light-Hut Lighting'}`;
        }

        let prods = prodData.success ? prodData.products || [] : [];

        // Augment with fallback MASTER_PRODUCTS if few exist
        if (prods.length < 8) {
          const fallbackProds = MASTER_PRODUCTS.filter(
            (p) => p.category === slug || (slug.includes('chandelier') && p.category.includes('chandelier'))
          );
          prods = [...prods, ...fallbackProds.filter((fp) => !prods.some((p) => p._id === fp._id || p.slug === fp.slug))];
        }

        setProducts(prods);
      } catch (err) {
        console.error('Error loading category page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-white">
        <div className="w-10 h-10 rounded-full border-2 border-[#DC2626] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <Layers className="w-12 h-12 text-[#DC2626] mx-auto mb-4" />
          <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold mb-2">Category Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The lighting category you requested does not exist or has been modified.
          </p>
          <Link
            to="/catalog"
            className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Get subcategory configuration with images
  const categoryConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === slug) || {
    sub: category.subcategories?.map((s) => ({
      name: s.name,
      slug: s.slug,
      image: `/categories/${slug}.jpg`,
      desc: 'Architectural Typology',
    })) || [],
    previewGallery: [
      { url: `/categories/${slug}.jpg`, title: 'Studio Primary Specimen' },
      { url: '/hero-chandelier.jpg', title: 'Grand Foyer Installation' },
      { url: '/craft-detail.jpg', title: 'Precision Craftsmanship' },
      { url: '/banner-amalfi.jpg', title: 'Evening Warm Glow' },
    ],
  };

  // Filter products by active subcategory
  const filteredProducts = products.filter((p) => {
    if (selectedSub === 'all') return true;
    const pSub = String(p.subcategory || p.subCategory || '').toLowerCase();
    const target = selectedSub.toLowerCase();
    return pSub.includes(target) || target.includes(pSub) || p.slug.includes(target);
  });

  // Display products (if subcategory filtered results are fewer than 4, include complementary category products)
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  const handleSubSelect = (subItemSlug) => {
    setSelectedSub(subItemSlug);
    if (subItemSlug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ sub: subItemSlug });
    }
  };

  const bannerImage =
    CATEGORY_BANNER_MAP[slug] ||
    CATEGORY_BANNER_MAP[category?.slug] ||
    (category?.image && !category.image.includes('unsplash') ? category.image : null) ||
    '/hero-chandelier.jpg';

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] min-h-screen text-neutral-900">
      {/* Category Hero Banner - Crystal Clear High Definition */}
      <div className="relative border-b border-neutral-800 overflow-hidden bg-neutral-900 min-h-[280px] sm:min-h-[340px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/hero-chandelier.jpg';
            }}
            alt={category.name}
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#DC2626] hover:text-white font-bold transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Full Catalog
          </Link>

          <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-2">
            Architectural Lighting Typology
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight drop-shadow-md">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm sm:text-base text-neutral-200 mt-3 max-w-2xl leading-relaxed font-normal drop-shadow">
              {category.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-mono text-white bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-lg font-bold backdrop-blur-md">
              {products.length} Designs in Catalog
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
              High CRI &gt; 92 • Circadian 2700K
            </span>
          </div>
        </div>
      </div>

      {/* ── SUBCATEGORIES SELECTOR BAR WITH REAL LIGHTING IMAGES ── */}
      {categoryConfig.sub && categoryConfig.sub.length > 0 && (
        <div className="bg-white border-b border-neutral-200/90 shadow-2xs sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-neutral-500">
              <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
              <span className="uppercase tracking-wider text-[11px] text-neutral-600">
                Explore {category.name} Subcategories:
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {/* All Designs Button */}
              <button
                type="button"
                onClick={() => handleSubSelect('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSub === 'all'
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <span>All {category.name}s</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  {products.length}
                </span>
              </button>

              {/* Subcategories with real image thumbnails */}
              {categoryConfig.sub.map((subItem) => {
                const isSelected = selectedSub === subItem.slug;

                return (
                  <button
                    key={subItem.slug}
                    type="button"
                    onClick={() => handleSubSelect(subItem.slug)}
                    className={`flex items-center gap-2.5 p-1.5 pr-4 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-white border-[#DC2626] text-[#DC2626] shadow-md ring-2 ring-[#DC2626]/20'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200 shadow-2xs">
                      <img
                        src={subItem.image}
                        alt={subItem.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-left">
                      <span className="block leading-tight">{subItem.name}</span>
                      <span className="text-[9.5px] font-normal text-neutral-400 block">
                        {subItem.desc || 'Architectural'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Products Grid (Rich Images) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
              Curated Luminaires
            </span>
            <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold">
              {selectedSub === 'all'
                ? `All ${category.name} Designs`
                : `${categoryConfig.sub.find((s) => s.slug === selectedSub)?.name || selectedSub} Collection`}
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Showing {displayProducts.length} Results
          </span>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl bg-white border border-neutral-200 p-8 max-w-xl mx-auto shadow-sm">
            <Lightbulb className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif-luxury text-neutral-900 font-bold">No Fixtures Found</h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              New architectural designs for this collection are currently undergoing optical testing and will be published shortly.
            </p>
            <button
              onClick={() => handleSubSelect('all')}
              className="btn-gold inline-block px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-luxury mt-6 cursor-pointer"
            >
              View All {category.name}s
            </button>
          </div>
        )}
      </div>

      {/* ── IN-SITU ARCHITECTURAL LOOKBOOK (8 High-Res Spatial Photos) ── */}
      {categoryConfig.previewGallery && categoryConfig.previewGallery.length > 0 && (
        <section className="mt-12 pt-14 border-t border-neutral-200 bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                Real Spatial Context
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
                {category.name} Architectural Installations & Lookbook
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                Explore how {category.name.toLowerCase()}s interact with Italian marble, warm teak woods, high-ceiling voids, and evening ambient light across luxury private residences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categoryConfig.previewGallery.map((pImg, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => setLightboxImage(pImg)}
                  className="group relative h-64 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-zoom-in bg-neutral-100"
                >
                  <img
                    src={pImg.url}
                    alt={pImg.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <span className="text-[10px] font-mono text-red-300 uppercase tracking-widest block mb-0.5">
                      Installed Lookbook
                    </span>
                    <h5 className="text-xs font-semibold text-white drop-shadow truncate">
                      {pImg.title}
                    </h5>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h4 className="text-white text-base font-serif-luxury font-bold">
                  {lightboxImage.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {category.name} Architectural Installation
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
