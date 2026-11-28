import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const DEFAULT_SLIDES = [
  {
    id: 'showroom',
    category: 'Experience Studio',
    badge: 'Flagship Showroom',
    quote: '“Experience light in its purest architectural dimension.”',
    title: 'Flagship Design Studio',
    description: 'Inspect physical luminaires, evaluate chromatic warmth (Ra > 95) & collaborate with our lighting team in person.',
    bgImage: '/showroom-hero-hd.jpg',
    productName: 'Lighting Experience Studio',
    specs: 'Live CCT Displays • Custom Advisory',
    idealFor: 'Architects & Interior Designers',
    primaryLink: '/contact',
    primaryText: 'Visit Showroom',
  },
  {
    id: 'chandeliers',
    category: 'Chandeliers',
    badge: 'Grand Statement',
    quote: '“Light is the secret sculptor of space.”',
    title: 'Sculptural Chandeliers',
    description: 'Cascading precision crystals & virgin brass for grand atriums and high-ceiling residences.',
    bgImage: '/hero-chandelier-v2.jpg',
    productName: 'Imperial Grand Chandelier',
    specs: 'K9 Crystal • Dim-to-Warm',
    idealFor: 'Grand Atriums & Living',
    primaryLink: '/catalog?category=chandelier',
    primaryText: 'Explore Chandeliers',
  },
  {
    id: 'outdoor',
    category: 'Outdoor Lights',
    badge: 'Architectural Exterior',
    quote: '“Sculpting dusk and architectural facades with weatherproof brilliance.”',
    title: 'Architectural Outdoor Luminaires',
    description: 'Heritage gate pillar lanterns, facade wall sconces & landscape pathway lights engineered for luxury villa entrances and grounds.',
    bgImage: '/hero-outdoor-combined.jpg',
    productName: 'Heritage Pillar & Facade Collection',
    specs: 'IP65 Weatherproof • Antique Brass & Die-Cast',
    idealFor: 'Villa Entrances, Gate Pillars & Pathways',
    primaryLink: '/catalog?category=outdoor-light',
    primaryText: 'Explore Outdoor Lights',
  },
  {
    id: 'double-height',
    category: 'Double Height',
    badge: 'Vertical Grandeur',
    quote: '“Architecture begins where light touches the void.”',
    title: 'Double-Height Suspensions',
    description: 'Dramatic architectural drops custom engineered up to 6 meters for duplex foyers and stairwells.',
    bgImage: '/hero-double-height.jpg',
    productName: 'Cascading Starlight Void',
    specs: 'Custom 2m–6m Drops',
    idealFor: 'Duplex Foyers & Stairwells',
    primaryLink: '/catalog?category=double-height',
    primaryText: 'Explore Double-Height',
  },
  {
    id: 'wall-lamps',
    category: 'Wall Lamps',
    badge: 'Architectural Sconces',
    quote: '“Every shadow tells a quiet story of warmth.”',
    title: 'Sculptural Crystal Sconces',
    description: 'Artisanal perimeter grazing and refractive ambient warmth designed for living rooms, private lounges, and alcoves.',
    bgImage: '/wall-lamp-banner-v2.jpg',
    productName: 'Crystal Radiance Wall Sconces',
    specs: 'Circadian Warm Glow • K9 Optical Crystal',
    idealFor: 'Living Rooms, Bedside & Corridors',
    primaryLink: '/catalog?category=wall-lamp',
    primaryText: 'Explore Wall Lamps',
  },
];

export const HeroSection = ({ section }) => {
  const { settings } = useSettings();

  // Allow optional CMS override for initial slide headline/copy if configured
  const slides = React.useMemo(() => {
    if (!section?.title && !section?.subtitle) return DEFAULT_SLIDES;
    const customized = [...DEFAULT_SLIDES];
    customized[0] = {
      ...customized[0],
      title: section?.title || customized[0].title,
      quote: section?.subtitle ? `“${section.subtitle}”` : customized[0].quote,
      description: section?.description || customized[0].description,
      primaryText: section?.buttonText || customized[0].primaryText,
      primaryLink: section?.buttonLink || customized[0].primaryLink,
    };
    return customized;
  }, [section]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slider every 6 seconds with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const currentSlide = slides[currentIdx];

  const handleNext = () => setCurrentIdx((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16 bg-neutral-900 border-b border-neutral-800"
    >
      {/* ════════════════════════════════════════════════════════
          ULTRA HD HIGH-VISIBILITY BACKGROUND SLIDER (ALL 5 SLIDES PRE-RENDERED)
      ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {slides.map((s, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={s.bgImage}
                onError={(e) => {
                  if (!e.target.src.includes('showroom-hero-hd.jpg')) {
                    e.target.src = '/showroom-hero-hd.jpg';
                  }
                }}
                alt={s.productName}
                className={`w-full h-full object-cover object-center filter brightness-[1.08] contrast-[1.04] saturate-[1.15] transform transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2">

        {/* Top Bar: Category Navigator Pills */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none mb-6 sm:mb-8 max-w-full"
        >
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                idx === currentIdx
                  ? 'bg-[#DC2626] text-white font-bold shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-black/50 hover:bg-black/70 text-neutral-300 hover:text-white border border-white/20 backdrop-blur-md hover:border-red-500/40'
              }`}
            >
              {s.category}
            </button>
          ))}
        </motion.div>

        {/* ── Main Hero Content (Clean, spacious, full background visibility) ── */}
        <div className="max-w-2xl lg:max-w-3xl pt-2 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Badge & Category Pill */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                <span>{currentSlide.badge} • {currentSlide.category}</span>
              </motion.div>

              {/* Architectural Lighting Quote */}
              <div className="relative pt-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-white tracking-wide leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  {currentSlide.quote}
                </p>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400 animate-gradient-pan">
                  {currentSlide.title}
                </span>
              </h1>

              {/* Minimalist 1-Line Description */}
              <p className="text-sm sm:text-base text-white font-medium max-w-xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                {currentSlide.description}
              </p>

              {/* Touchpoint Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <Link
                  to={currentSlide.primaryLink}
                  className="btn-gold shine-on-hover px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center gap-2 shadow-xl hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-0.5"
                >
                  <span>{currentSlide.primaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="shine-on-hover px-6 py-3.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/25 text-white text-xs font-bold uppercase tracking-luxury flex items-center gap-2 transition-all backdrop-blur-md shadow-lg hover:border-white/50 transform hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>Request Consultation</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Bar */}
          <div className="mt-10 pt-5 border-t border-white/15 flex items-center justify-between max-w-xl">
            {/* Slide Counter & Progress Bar */}
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
              <span className="text-[#DC2626] font-bold text-sm">
                {String(currentIdx + 1).padStart(2, '0')}
              </span>
              <div className="w-28 sm:w-36 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  key={currentIdx}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: isPaused ? 0 : 6, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#DC2626] to-[#EF4444]"
                />
              </div>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="p-3 rounded-xl bg-black/60 hover:bg-[#DC2626] hover:text-white text-white border border-white/25 backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-xl bg-black/60 hover:bg-[#DC2626] hover:text-white text-white border border-white/25 backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
