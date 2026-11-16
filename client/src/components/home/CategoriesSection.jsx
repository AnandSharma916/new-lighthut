import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { categoryService } from '../../services/api';
import { MASTER_CATEGORIES } from '../../data/catalogData';

export const CategoriesSection = ({ section }) => {
  const [categories, setCategories] = useState(MASTER_CATEGORIES);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (data.success && data.categories && data.categories.length > 0) {
          const enriched = data.categories.map((cat, idx) => {
            const fallback =
              MASTER_CATEGORIES.find((d) => d.slug === cat.slug) ||
              MASTER_CATEGORIES[idx % MASTER_CATEGORIES.length];
            return {
              ...fallback,
              ...cat,
              image: cat.image || fallback.image,
              description: cat.description || fallback.description,
              tag: cat.tag || fallback.tag,
              icon: cat.icon || fallback.icon,
              subcategories: fallback.subcategories || [],
            };
          });
          setCategories(enriched);
        }
      } catch (err) {
        setCategories(MASTER_CATEGORIES);
      }
    };

    fetchCategories();
  }, []);

  const title = section?.title || 'Shop By Category';
  const subtitle = section?.subtitle || 'EXPLORE OUR COLLECTIONS';
  const description =
    section?.description ||
    'From dramatic crystal chandeliers to subtle bedside wall lights, explore our wide range of decorative lighting curated for every corner of your home.';

  const filterTabs = [
    { id: 'all', label: 'All Categories' },
    { id: 'chandelier', label: 'Chandeliers' },
    { id: 'pendant', label: 'Pendant Lights' },
    { id: 'wall', label: 'Wall Lamps' },
    { id: 'double-height', label: 'Double Height' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'dining', label: 'Dining Table' },
  ];

  const filteredCategories =
    selectedFilter === 'all'
      ? categories
      : categories.filter(
          (c) => c.categoryKey === selectedFilter || c.slug?.includes(selectedFilter)
        );

  return (
    <section className="py-20 sm:py-24 bg-[#f8fafc] relative overflow-hidden border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] uppercase tracking-wider text-[#DC2626] font-bold mb-3">
              <Sparkles className="w-3 h-3 text-[#DC2626]" />
              <span>{subtitle}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              {description}
            </p>
          </div>

          <Link
            to="/catalog"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-luxury shadow-md transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <span>Explore All Catalog Fixtures</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedFilter === tab.id
                  ? 'bg-[#DC2626] text-white font-bold shadow-md shadow-[#DC2626]/25'
                  : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid - CLEAR, BRIGHT & SHARP IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCategories.slice(0, 9).map((category, index) => (
            <motion.div
              key={category.slug || index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
              className="group relative rounded-2xl overflow-hidden bg-[#161e2c] border border-white/10 hover:border-[#DC2626]/60 transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between h-[420px]"
            >
              {/* ── Background Photography: CLEAR & VIBRANT ── */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={category.image}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/craft-main.jpg';
                  }}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* Gentle bottom-only gradient for text readability while leaving image CLEAR */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-transparent" />
              </div>

              {/* Card Top Pill */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-[#0b0f17]/85 backdrop-blur-md border border-white/10 text-[#FDE68A] font-semibold flex items-center gap-1.5 shadow">
                  <span>{category.icon || '💡'}</span>
                  <span>{category.tag || 'Lighting'}</span>
                </span>

                <span className="text-[11px] font-semibold text-neutral-300 bg-[#0b0f17]/85 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full shadow">
                  {category.productsCount || '4+'} Designs
                </span>
              </div>

              {/* Card Bottom Info */}
              <div className="relative z-10 p-6 pt-0 space-y-3">
                <Link to={`/catalog?category=${category.slug}`}>
                  <h3 className="text-2xl font-serif-luxury text-white font-bold tracking-tight group-hover:text-[#DC2626] transition-colors">
                    {category.name}
                  </h3>
                </Link>

                <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                {/* Subcategory Chips */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/catalog?category=${category.slug}&sub=${sub.slug}`}
                        className="px-2.5 py-0.5 rounded-md text-[10px] bg-white/10 hover:bg-[#DC2626] hover:text-white text-neutral-200 border border-white/10 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Explore Link */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/catalog?category=${category.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-[#DC2626] group-hover:text-white font-bold transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[10px] text-neutral-400">
                    Handcrafted
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
