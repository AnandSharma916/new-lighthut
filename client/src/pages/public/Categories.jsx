import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Layers,
  Sparkles,
  Sun,
  Flame,
  Compass,
  Mail,
  CheckCircle2,
  Maximize2,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { categoryService } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { MASTER_CATEGORIES } from '../../data/catalogData';
import { PRODUCT_CATEGORIES_DATA } from '../../components/common/CascadingCategoryDropdown';
import { NEUTRAL_FALLBACK_IMAGE } from '../../utils/imageCompressor';

export const Categories = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState(MASTER_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Lighting Categories & Architectural Guide | ${settings.companyName || 'Luxury Lighting'}`;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        if (data.success && data.categories?.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [settings.companyName]);

  const lightingLayers = [
    {
      layer: 'Layer 01',
      title: 'Ambient Lighting (The Foundation)',
      description:
        'General, overarching illumination that sets the warm baseline of a room. Chandeliers, monumental double-height cascades, and ceiling flush-mounts diffuse comfortable glow across living rooms and foyers.',
      fixtures: 'Chandeliers • Double-Height Pendants • Flush Mounts',
      colorTemp: '2700K – 3000K Golden Warm',
    },
    {
      layer: 'Layer 02',
      title: 'Task Lighting (Function & Precision)',
      description:
        'Focused, glare-free light directed toward activities like dining, cooking, reading, and grooming. Engineered with anti-glare louvers and mouth-blown fluted glass to eliminate optical strain.',
      fixtures: 'Dining Table Lamps • Island Pendants • Desk & Bedside Lamps',
      colorTemp: '3000K – 4000K Warm Neutral',
    },
    {
      layer: 'Layer 03',
      title: 'Accent Lighting (Drama & Depth)',
      description:
        'Draws attention to architectural features, artwork, fluted wall panels, and textured masonry. Bi-directional sconces and magnetic track lights create rich dimensional shadows.',
      fixtures: 'Wall Sconces • 48V Magnetic Track • Outdoor Facade Grazers',
      colorTemp: '2700K Warm White • Ra > 95',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] min-h-screen text-neutral-900">
      {/* ── HEADER BANNER ── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-neutral-800 overflow-hidden bg-neutral-950 mb-12">
        {/* Background Architectural Collections Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-chandelier.jpg"
            onError={(e) => {
              e.target.src = '/categories/pendant-lamp.jpg';
            }}
            alt="Lighting Collections by Architectural Application"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          {/* Subtle light gradient for high visibility and crisp text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Subtle Crimson Red Glow */}
          <div className="absolute -top-28 -right-28 w-[32rem] h-[32rem] bg-[#DC2626]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-luxury">
              <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Architecture & Spatial Elevation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight drop-shadow-md">
              Lighting Collections by Application
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light drop-shadow">
              Explore our curated catalog of handcrafted chandeliers, sculptural pendants, bi-directional wall sconces, and weatherproof outdoor luminaires designed for luxury living.
            </p>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => {
              const catConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === category.slug) || {
                sub: category.subcategories?.map((s) => ({
                  name: s.name,
                  slug: s.slug,
                  image: `/categories/${category.slug}.jpg`,
                  desc: 'Architectural Typology',
                })) || [],
                previewGallery: [
                  { url: `/categories/${category.slug}.jpg`, title: 'Primary Specimen' },
                  { url: '/hero-chandelier.jpg', title: 'Architectural Centerpiece' },
                  { url: '/craft-detail.jpg', title: 'Precision Craftsmanship' },
                  { url: '/banner-amalfi.jpg', title: 'Warm Evening Illumination' },
                ],
              };

              return (
                <motion.div
                  key={category._id || category.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Category Cover Banner */}
                  <Link
                    to={`/category/${category.slug}`}
                    className="group relative block h-60 overflow-hidden bg-neutral-950 shrink-0"
                  >
                    <img
                      src={category.image || `/categories/${category.slug}.jpg` || NEUTRAL_FALLBACK_IMAGE}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = NEUTRAL_FALLBACK_IMAGE;
                      }}
                      alt={category.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[1.0] contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-red-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {category.productsCount !== undefined && (
                          <span className="text-xs text-white font-medium bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                            {category.productsCount} {category.productsCount === 1 ? 'Design' : 'Designs'}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-serif-luxury text-white font-bold group-hover:text-red-400 transition-colors drop-shadow-sm flex items-center gap-2">
                          <span>{category.name}</span>
                          <span className="text-base">{catConfig.icon || '✨'}</span>
                        </h3>
                        {category.description && (
                          <p className="text-xs text-neutral-200 mt-1.5 line-clamp-1 leading-relaxed font-light drop-shadow">
                            {category.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-luxury text-red-400 group-hover:translate-x-1.5 transition-transform">
                          <span>View All {category.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Subcategories & Types List with Real Luminaire Images */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                    {catConfig.sub && catConfig.sub.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                            <span>Subcategories ({catConfig.sub.length})</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">Architectural Range</span>
                        </div>

                        {/* Subcategory item rows */}
                        <div className="space-y-2">
                          {catConfig.sub.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={`/category/${category.slug}/${sub.slug}`}
                              className="group/sub flex items-center justify-between p-2 rounded-2xl border border-neutral-100 bg-[#fbfcfd] hover:bg-neutral-50 hover:border-[#DC2626]/40 transition-all shadow-2xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/80 shadow-2xs group-hover/sub:scale-105 transition-transform">
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-neutral-900 group-hover/sub:text-[#DC2626] transition-colors truncate">
                                    {sub.name}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 line-clamp-1">
                                    {sub.desc || 'Architectural Typology'}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover/sub:text-[#DC2626] group-hover/sub:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-100">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                            <span>Catalog Collection</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">Complete Series</span>
                        </div>
                        <Link
                          to={`/category/${category.slug}`}
                          className="group/sub flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-[#fbfcfd] hover:bg-neutral-50 hover:border-[#DC2626]/40 transition-all shadow-2xs"
                        >
                          <div className="text-xs font-bold text-neutral-900 group-hover/sub:text-[#DC2626] transition-colors">
                            Explore All {category.name} Designs
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover/sub:text-[#DC2626] group-hover/sub:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      </div>
                    )}

                    {/* Mini Visual Showcase Gallery (4 real fixtures) */}
                    {catConfig.previewGallery && catConfig.previewGallery.length > 0 && (
                      <div className="pt-3 border-t border-neutral-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#DC2626]" />
                          <span>Visual Showcase</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {catConfig.previewGallery.slice(0, 4).map((item, pIdx) => (
                            <Link
                              key={pIdx}
                              to={`/category/${category.slug}`}
                              className="group/img relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 hover:border-[#DC2626] transition-all shadow-2xs"
                              title={item.title}
                            >
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/img:scale-115 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── SECTION 2: ARCHITECTURAL LIGHTING DESIGN GUIDE ── */}
      <section className="mt-24 pt-20 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
              Design Science
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
              The 3 Essential Layers of Architectural Lighting
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              A beautifully lit home is rarely illuminated by a single fixture. By layering Ambient, Task, and Accent lighting, you achieve balanced depth and visual comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {lightingLayers.map((layer, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#DC2626]/50 transition-colors"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] block mb-2">
                    {layer.layer}
                  </span>
                  <h3 className="font-serif-luxury text-lg font-bold text-neutral-900 mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {layer.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/80 space-y-2 text-[11px] font-mono text-neutral-600">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-semibold">
                    <Lightbulb className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>{layer.fixtures}</span>
                  </div>
                  <div className="text-[#DC2626] font-medium">
                    Recommended: {layer.colorTemp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Rules of Thumb Card */}
          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 mb-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs uppercase tracking-luxury text-red-400 font-bold block">
                Architectural Cheat Sheet
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                Key Sizing Rules For Ceilings & Tables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs text-neutral-300">
                <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block text-sm">Dining Table Drop</span>
                  <p className="leading-relaxed">Hang the bottom of pendant lamps 30 to 36 inches above the dining tabletop for unobstructed eye contact.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block text-sm">Double-Height Foyers</span>
                  <p className="leading-relaxed">Allow at least 8 to 9 feet of clearance beneath the lowest crystal drop, centering the fixture in the volume.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block text-sm">Wall Sconce Height</span>
                  <p className="leading-relaxed">Mount hallway sconces at 60 to 66 inches from the floor to eye level to prevent direct bulb glare.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scale Consultation Banner */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#f8fafc] border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h4 className="font-serif-luxury text-xl font-bold text-neutral-900">
                Need Help Calculating Dimensions For Your Space?
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Send your room dimensions to our architectural team for a free luminaire scale match.
              </p>
            </div>
            <Link
              to="/contact"
              className="btn-gold px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2 shrink-0 shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Ask a Specialist</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
