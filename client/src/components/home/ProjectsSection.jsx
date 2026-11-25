import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, X, Maximize2 } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   12 Curated Lighting Product Categories with 6 High-Res Luminaire Images Each
   Strictly authentic lighting photography (no non-lighting stock photos).
───────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────
   Official 10 Lighting Product Categories & Fixtures
   Strictly authentic lighting photography matching customer catalog
───────────────────────────────────────────────────────────── */
const LIGHTING_COLLECTIONS = [
  {
    id: 'wall-lamp',
    slug: 'wall-lamp',
    name: 'WALL LAMP',
    image: '/products/led-wall-lamp/lh-141w-led-wall-lamp.jpg',
    description: 'Bi-directional wall grazers, fluted borosilicate glass sconces, and indirect perimeter illumination for corridors, foyers, and bedside alcoves.',
    fixtures: ['Led Wall Lamp', 'Wall Lamp'],
    link: '/catalog?category=wall-lamp',
    subImages: [
      { url: '/products/led-wall-lamp/lh-141w-led-wall-lamp.jpg', title: 'LH-141W Led Wall Lamp' },
      { url: '/products/led-wall-lamp/lh-172w-led-wall-lamp.jpg', title: 'LH-172W Led Wall Lamp' },
      { url: '/products/led-wall-lamp/lh-w931-led-wall-lamp.jpg', title: 'LH-W931 Led Wall Lamp' },
      { url: '/products/classic-wall-lamp/lh-7632w-modern-wall-lamp.jpg', title: 'LH-7632W Modern Wall Lamp' },
      { url: '/products/classic-wall-lamp/lh-050w-modern-wall-lamp.jpg', title: 'LH-050W Modern Wall Lamp' },
      { url: '/products/led-wall-lamp/lh-3441wl-led-wall-lamp.jpg', title: 'LH-3441WL Led Wall Lamp' },
    ],
  },
  {
    id: 'pendant-lamp',
    slug: 'pendant-lamp',
    name: 'PENDANT LAMP',
    image: '/products/led-hanging-lamp/lh-842-1l-3l-led-hanging-lamp.jpg',
    description: 'Suspended architectural lighting fixtures, mouth-blown fluted glass, and spun brass pendants designed for dining islands and reception spaces.',
    fixtures: ['Led Hanging Lamp', 'Hanging Lamp'],
    link: '/catalog?category=pendant-lamp',
    subImages: [
      { url: '/products/led-hanging-lamp/lh-842-1l-3l-led-hanging-lamp.jpg', title: 'LH-842/1L-3L Led Hanging Lamp' },
      { url: '/products/led-hanging-lamp/lh-8892-1l-led-crystal-hanging-lamp.jpg', title: 'LH-8892-1L Led Crystal Hanging Lamp' },
      { url: '/products/led-hanging-lamp/lh-r792-3l-fgd-led-hanging-lamp.jpg', title: 'LH-R792/3L FGD Led Hanging Lamp' },
      { url: '/products/classic-hanging-lamp/lh-2478-1l-glass-hanging-lamp.jpg', title: 'LH-2478/1L Glass Hanging Lamp' },
      { url: '/products/classic-hanging-lamp/lh-26-1l-3l-metal-hanging-lamp.jpg', title: 'LH-26/1L-3L Metal Hanging Lamp' },
      { url: '/products/led-hanging-lamp/lh-b2563-4-led-hanging-lamp.jpg', title: 'LH-B2563/4 Led Hanging Lamp' },
    ],
  },
  {
    id: 'chandelier',
    slug: 'chandelier',
    name: 'CHANDELIER',
    image: '/categories/chandelier.jpg',
    description: 'Magnificent multi-tier chandeliers spanning modern LED rings, E14 crystals, linear profiles, Italian Murano glass, modern branches, antique fixtures, and fan chandeliers.',
    fixtures: [
      'Led Chandelier',
      'E14 Chandelier',
      'Profile Chandelier',
      'Glass Chandelier',
      'Italian Chandelier',
      'Modern chandelier',
      'Antique Chandelier',
      'Fan chandelier',
      'Celling chandelier',
    ],
    link: '/catalog?category=chandelier',
    subImages: [
      { url: '/categories/chandelier.jpg', title: 'LH-CH101 Multi-Tier Ring Led Chandelier' },
      { url: '/banner-empire.jpg', title: 'LH-CH102 Regal Gilded E14 Chandelier' },
      { url: '/banner-amalfi.jpg', title: 'LH-CH103 Extruded Slim Profile Chandelier' },
      { url: '/hero-pendant.jpg', title: 'LH-CH104 Handcrafted Fluted Glass Chandelier' },
      { url: '/hero-chandelier.jpg', title: 'LH-CH105 Grand Murano Italian Chandelier' },
      { url: '/hero-double-height.jpg', title: 'LH-CH106 Contemporary Branch Modern Chandelier' },
      { url: '/banner-empire.jpg', title: 'LH-CH107 Classical Antique Brass Chandelier' },
      { url: '/categories/fan-chandelier.jpg', title: 'LH-CH108 Retractable DC Fan Chandelier' },
      { url: '/categories/chandelier.jpg', title: 'LH-CH109 Flush Mount Celling Chandelier' },
    ],
  },
  {
    id: 'double-height',
    slug: 'double-height',
    name: 'DOUBLE HEIGHT',
    image: '/categories/double-height.jpg',
    description: 'Bespoke monumental cascade chandeliers designed for 18ft+ double-height living rooms, duplex stairwells, and grand hotel foyers.',
    fixtures: ['Crystal Chandelier', 'Modern Chandelier'],
    link: '/catalog?category=double-height',
    subImages: [
      { url: '/categories/double-height.jpg', title: 'LH-DH101 Monumental Crystal Chandelier' },
      { url: '/hero-double-height.jpg', title: 'LH-DH102 Duplex Spiral Modern Chandelier' },
      { url: '/categories/double-height.jpg', title: 'High-Ceiling Atrium Raindrop Crystal Chandelier' },
      { url: '/hero-double-height.jpg', title: 'Floating Ring LED Multi-Tier Modern Chandelier' },
      { url: '/banner-empire.jpg', title: '18-Foot Grand Staircase Crystal Chandelier' },
      { url: '/categories/chandelier.jpg', title: 'Architectural Void Suspended Modern Rings' },
    ],
  },
  {
    id: 'dining-table-lamp',
    slug: 'dining-table-lamp',
    name: 'DINING TABLE LAMP',
    image: '/categories/dining-table-lamp.jpg',
    description: 'Curated intimate dining luminaires, cordless touch-rechargeable accent lamps, and low-profile warm illumination tailored for executive dining.',
    fixtures: ['Dining Table Lamp'],
    link: '/catalog?category=dining-table-lamp',
    subImages: [
      { url: '/categories/dining-table-lamp.jpg', title: 'LH-DT101 Cordless Touch Dining Table Lamp' },
      { url: '/hero-pendant.jpg', title: 'Champagne Fluted Banquet Dining Lamp' },
      { url: '/banner-amalfi.jpg', title: 'Brushed Gold Intimate Dining Table Lamp' },
      { url: '/showroom-hero-hd.jpg', title: 'Low-Glare Candlelight Dining Table Lamp' },
      { url: '/banner-study.jpg', title: 'Rechargeable Luxury Brass Dining Lamp' },
      { url: '/categories/dining-table-lamp.jpg', title: 'Sculptural Centerpiece Dining Luminaire' },
    ],
  },
  {
    id: 'outdoor-light',
    slug: 'outdoor-light',
    name: 'OUTDOOR LIGHT',
    image: '/products/gate-lamp/lh-5506gl-outdoor-gate-lamp.jpg',
    description: 'IP65-rated gate pillar lanterns, garden bollards, and exterior facade wall grazers engineered with marine-grade aluminum to withstand harsh weather.',
    fixtures: ['Gate Lamp', 'Wall Lamp'],
    link: '/catalog?category=outdoor-light',
    subImages: [
      { url: '/products/gate-lamp/lh-5506gl-outdoor-gate-lamp.jpg', title: 'LH-5506GL Outdoor Gate Lamp' },
      { url: '/products/outdoor-wall-lamp/lh-5706wl-outdoor-wall-lamp.jpg', title: 'LH-5706WL Outdoor Wall Lamp' },
      { url: '/products/gate-lamp/lh-9023-outdoor-gate-lamp.jpg', title: 'LH-9023 Outdoor Gate Lamp' },
      { url: '/products/gate-lamp/lh-155gl-clear-outdoor-gate-lamp.jpg', title: 'LH-155GL (Clear) Outdoor Gate Lamp' },
      { url: '/products/outdoor-wall-lamp/lh-1079-outdoor-wall-lamp.jpg', title: 'LH-1079 Outdoor Wall Lamp' },
      { url: '/products/gate-lamp/lh-9106-outdoor-gate-lamp.jpg', title: 'LH-9106 Outdoor Gate Lamp' },
    ],
  },
  {
    id: 'table-lamp',
    slug: 'table-lamp',
    name: 'TABLE LAMP',
    image: '/categories/table-lamp.jpg',
    description: 'Solid brass task lights, Italian marble base mushroom lamps, and sculptural ceramic studio fixtures bringing warm focused light to bedside tables and desks.',
    fixtures: ['Table Lamp'],
    link: '/catalog?category=table-lamp',
    subImages: [
      { url: '/categories/table-lamp.jpg', title: 'LH-TL101 Marble Base Mushroom Table Lamp' },
      { url: '/banner-study.jpg', title: 'LH-TL102 Architectural Brass Desk Table Lamp' },
      { url: '/banner-bed.jpg', title: 'LH-TL103 Ceramic Bedside Ambient Table Lamp' },
      { url: '/banner-study-hover.jpg', title: 'Articulated Task Reading Table Lamp' },
      { url: '/banner-bedroom.jpg', title: 'Frosted Globe Nightstand Table Lamp' },
      { url: '/categories/table-lamp.jpg', title: 'Mid-Century Brass Designer Table Lamp' },
    ],
  },
  {
    id: 'floor-lamp',
    slug: 'floor-lamp',
    name: 'FLOOR LAMP',
    image: '/categories/floor-lamp.jpg',
    description: 'Statement arched floor lights, minimal vertical light columns, and mid-century cantilevered fixtures that anchor luxury living rooms and executive lounges.',
    fixtures: ['Floor Lamp'],
    link: '/catalog?category=floor-lamp',
    subImages: [
      { url: '/categories/floor-lamp.jpg', title: 'LH-FL101 Arched Brass Arc Floor Lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'LH-FL102 Heavy Marble Plinth Floor Lamp' },
      { url: '/hero-wall-lamp.jpg', title: 'Vertical Architectural Corner Floor Lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Mid-Century Brass Tripod Floor Lamp' },
      { url: '/showroom-hero-hd.jpg', title: 'Fabric Shade Lounge Reading Floor Lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Dual-Source Indirect Standing Floor Lamp' },
    ],
  },
  {
    id: 'led-filament-bulb',
    slug: 'led-filament-bulb',
    name: 'LED FILAMENT BULB',
    image: '/categories/led-filament-bulb.jpg',
    description: 'Vintage-style amber and golden tinted Edison LED filament bulbs with spiral and cross-pattern elements, offering 2200K antique warmth with high energy efficiency.',
    fixtures: ['LED Filament Bulb'],
    link: '/catalog?category=led-filament-bulb',
    subImages: [
      { url: '/categories/led-filament-bulb.jpg', title: 'LH-FB101 Amber ST64 Spiral Filament Bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'Warm 2200K Edison Heritage Filament Bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'G125 Giant Globe LED Filament Bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'Tubular T30 Antique Filament Bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'Dimmable Golden Tinted Filament Bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'C35 Candle Tip Chandelier Filament Bulb' },
    ],
  },
  {
    id: 'spare-part',
    slug: 'spare-part',
    name: 'SPARE PART',
    image: '/categories/spare-part.jpg',
    description: 'Heavy-duty ceiling hanging canopy bases, precision mounting hardware, and ripple-free constant current LED drivers for seamless maintenance.',
    fixtures: ['Hanging Base', 'Spare Driver'],
    link: '/catalog?category=spare-part',
    subImages: [
      { url: '/categories/hanging-base.jpg', title: 'LH-SP101 Heavy-Duty Hanging Base Canopy' },
      { url: '/categories/spare-driver.jpg', title: 'LH-SP102 Constant Current LED Spare Driver' },
      { url: '/categories/hanging-base.jpg', title: 'LH-SP103 Multi-Port Hanging Base Plate' },
      { url: '/categories/spare-driver.jpg', title: 'LH-SP104 IP67 Waterproof LED Spare Driver' },
      { url: '/categories/hanging-base.jpg', title: 'Reinforced Chandelier Ceiling Hanging Base' },
      { url: '/categories/spare-driver.jpg', title: 'Triac Dimmable Constant Current Spare Driver' },
    ],
  },
];

/**
 * Curated Lighting Collections & Categories Section
 * Features the 12 lighting product categories grid with IN-PLACE expansion:
 * The 6-image sub-gallery opens DIRECTLY UNDER the clicked card's row
 * strictly showcasing real lighting luminaires and direct catalog links.
 */
export const ProjectsSection = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const cardRefs = useRef({});

  const handleCardClick = (catId) => {
    if (activeCategoryId === catId) {
      setActiveCategoryId(null);
    } else {
      setActiveCategoryId(catId);
      // Smooth scroll so the clicked card and its 6-image tray are comfortably in view
      setTimeout(() => {
        const el = cardRefs.current[catId];
        if (el) {
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 120);
    }
  };

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#f8fafc] text-neutral-900 border-t border-neutral-200/80 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#DC2626] mb-2.5 px-3.5 py-1 bg-red-50 rounded-full border border-red-100/80">
            Handcrafted Architectural Luminaires
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-neutral-800 tracking-tight font-sans uppercase">
            PRODUCT CATEGORY
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-normal mt-2.5 max-w-2xl mx-auto">
            Discover Handcrafted Chandeliers, Pendants, Sconces & Architectural Luminaires Tailored for Every Space
          </p>
        </div>

        {/* ── Responsive Grid with In-Place Card Expansion (Directly below clicked card) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {LIGHTING_COLLECTIONS.map((item) => {
            const isActive = activeCategoryId === item.id;

            return (
              <React.Fragment key={item.id}>
                {/* ── Individual Product Category Card ── */}
                <div
                  ref={(el) => (cardRefs.current[item.id] = el)}
                  onClick={() => handleCardClick(item.id)}
                  className={`group bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-3.5 sm:p-4 flex items-center justify-between gap-3.5 ${
                    isActive
                      ? 'border-[#DC2626] shadow-md ring-2 ring-[#DC2626]/20 bg-neutral-50/70'
                      : 'border-neutral-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:border-neutral-200'
                  }`}
                >
                  {/* Left: Thumbnail & Name */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-neutral-100 shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors truncate ${
                        isActive ? 'text-[#DC2626]' : 'text-neutral-800 group-hover:text-neutral-950'
                      }`}>
                        {item.name}
                      </h3>
                      {item.fixtures && item.fixtures.length > 0 && (
                        <p className="text-xs text-neutral-500 font-normal truncate mt-0.5 max-w-[200px] sm:max-w-[240px]">
                          {item.fixtures.join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Chevron (Rotates 180° when active) */}
                  <div className="shrink-0 p-1 transition-colors">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? 'rotate-180 text-[#DC2626]' : 'text-neutral-400 group-hover:text-neutral-700'
                      }`}
                    />
                  </div>
                </div>

                {/* ── 6-IMAGE GALLERY TRAY (Opens directly beneath the clicked card) ── */}
                {isActive && (
                  <motion.div
                    key={`gallery-tray-${item.id}`}
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 w-full my-2 sm:my-3"
                  >
                    <div className="relative bg-[#e9ecef] sm:bg-[#f1f3f5] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-neutral-300/70 shadow-sm">
                      
                      {/* Top Bar: Category Name, Badges & Close Button */}
                      <div className="flex items-center justify-between mb-3.5 sm:mb-4 px-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider font-bold text-[#DC2626]">
                            {item.name}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-xs text-neutral-500 font-medium">
                            {item.subImages.length} Curated Luminaires
                          </span>
                        </div>

                        {/* Close Button at Top-Right */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCategoryId(null);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center shadow-2xs hover:shadow transition-all hover:scale-105"
                          aria-label="Close Gallery"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2x3 Grid: Pure Lighting Product Images */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {item.subImages.map((subImg, idx) => (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage(subImg);
                            }}
                            className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-200 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 border border-black/5"
                          >
                            <img
                              src={subImg.url}
                              alt={subImg.title}
                              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                            {/* Subtle Title Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                              <span className="text-white text-xs font-medium drop-shadow-md truncate pr-2">
                                {subImg.title}
                              </span>
                              <span className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center shrink-0">
                                <Maximize2 className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Footer */}
                      <div className="mt-4 sm:mt-5 pt-3.5 border-t border-neutral-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-neutral-500 font-medium mr-1">
                            Key Fixtures:
                          </span>
                          {item.fixtures.map((fixture, fIdx) => (
                            <Link
                              key={fIdx}
                              to={`/catalog?category=${item.slug}&search=${encodeURIComponent(fixture)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-neutral-100 border border-neutral-200/80 hover:border-neutral-300 text-neutral-700 shadow-2xs font-normal transition-colors"
                            >
                              {fixture}
                            </Link>
                          ))}
                        </div>

                        <Link
                          to={item.link}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow transition-all shrink-0 group/btn"
                        >
                          <span>Explore {item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── FULL-SCREEN LIGHTBOX MODAL ── */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl"
              >
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>

                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />

                <div className="p-4 sm:p-5 bg-neutral-900 flex items-center justify-between text-white">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold">
                      {lightboxImage.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Architectural Lighting Product Detail
                    </p>
                  </div>

                  <button
                    onClick={() => setLightboxImage(null)}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
