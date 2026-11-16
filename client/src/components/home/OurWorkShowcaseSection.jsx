import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Maximize2, X, Sparkles, MapPin } from 'lucide-react';

/* ── Curated Portfolio Projects matching the User's Reference Showcase ── */
const WORK_ITEMS_ROW1 = [
  {
    id: 'work-1',
    title: 'Skyline Multi-Storey Villa',
    category: 'Architectural Elevation',
    location: 'Palm Jumeirah',
    image: '/hero-double-height.jpg',
  },
  {
    id: 'work-2',
    title: 'Velvet Master Suite',
    category: 'Circadian Bedside Glow',
    location: 'Mayfair, London',
    image: '/banner-bedroom.jpg',
  },
  {
    id: 'work-3',
    title: 'Double-Height Grand Salon',
    category: 'Chandelier Statement',
    location: 'Beverly Hills',
    image: '/categories/double-height.jpg',
  },
  {
    id: 'work-4',
    title: 'Minimalist Architectural Lounge',
    category: 'Linear Cove Illumination',
    location: 'TriBeCa Loft',
    image: '/categories/profile-chandelier.jpg',
  },
  {
    id: 'work-5',
    title: 'Contemporary Luxury Suite',
    category: 'Indirect Ceiling Graze',
    location: 'South Kensington',
    image: '/categories/led-wall-lamp.jpg',
  },
  {
    id: 'work-6',
    title: 'Scandi Living & Dome Luminaire',
    category: 'Warm Ambient Task',
    location: 'Copenhagen',
    image: '/categories/floor-lamp.jpg',
  },
  {
    id: 'work-7',
    title: 'Geometric Facade & Balcony Wash',
    category: 'Exterior Grazing',
    location: 'Bel Air Estate',
    image: '/hero-outdoor.jpg',
  },
  {
    id: 'work-8',
    title: 'Dining Alcove & Glass Drops',
    category: 'Suspended Pendants',
    location: 'Zurich Penthouse',
    image: '/categories/pendant-lamp.jpg',
  },
  {
    id: 'work-9',
    title: 'Backlit Stone Dressing Suite',
    category: 'Vanity Accent',
    location: 'Milanese Residence',
    image: '/banner-study.jpg',
  },
  {
    id: 'work-10',
    title: 'Sunlit Coastal Terrace',
    category: 'Outdoor Architectural',
    location: 'Malibu Coast',
    image: '/categories/outdoor-light.jpg',
  },
];

const WORK_ITEMS_ROW2 = [
  {
    id: 'work-11',
    title: 'Art Deco Ballroom Centerpiece',
    category: 'Multi-Tier Brass Chandelier',
    location: 'Parisian Salon',
    image: '/categories/italian-chandelier.jpg',
  },
  {
    id: 'work-12',
    title: 'Japandi Bedside Zen Alcove',
    category: 'Halo Sconce & Drops',
    location: 'Kyoto Sanctuary',
    image: '/categories/classic-hanging-lamp.jpg',
  },
  {
    id: 'work-13',
    title: 'Boutique Residence Glass Elevation',
    category: 'Vertical Facade Wash',
    location: 'Sydney Harbour',
    image: '/categories/modern-chandelier-dh.jpg',
  },
  {
    id: 'work-14',
    title: 'Private Art Collector Gallery',
    category: 'Museum Track Grazing',
    location: 'Chelsea, NYC',
    image: '/categories/e14-chandelier.jpg',
  },
  {
    id: 'work-15',
    title: 'Monolithic Kitchen Island',
    category: 'Linear Brass Drops',
    location: 'Melbourne Residence',
    image: '/categories/dining-table-lamp.jpg',
  },
  {
    id: 'work-16',
    title: 'Onyx Spa Sanctuary',
    category: 'Concealed LED Backlight',
    location: 'Monaco Penthouse',
    image: '/categories/glass-chandelier.jpg',
  },
  {
    id: 'work-17',
    title: 'Sculptural Halo Suspension',
    category: 'Ring Chandelier',
    location: 'Belgravia, London',
    image: '/categories/modern-chandelier.jpg',
  },
  {
    id: 'work-18',
    title: 'Infinity Pool Terrace Lighting',
    category: 'Low-Glare In-Ground Grazers',
    location: 'Santorini Cliffside',
    image: '/categories/antic-chandelier.jpg',
  },
  {
    id: 'work-19',
    title: 'Heritage Library Reading Nook',
    category: 'Millwork Concealed Wash',
    location: 'Edinburgh',
    image: '/categories/fan-chandelier.jpg',
  },
  {
    id: 'work-20',
    title: 'Cantilevered Staircase & Cascades',
    category: 'Floating Tread Sconces',
    location: 'Vancouver Estate',
    image: '/categories/ceiling-chandelier.jpg',
  },
];

export const OurWorkShowcaseSection = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Duplicate items for continuous seamless 60fps marquee loop
  const row1Doubled = [...WORK_ITEMS_ROW1, ...WORK_ITEMS_ROW1];
  const row2Doubled = [...WORK_ITEMS_ROW2, ...WORK_ITEMS_ROW2];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white text-neutral-900 border-b border-neutral-100 overflow-hidden select-none">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* ── Section Header (Faithfully matching user reference layout) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight whitespace-nowrap">
              Our Work
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
              Creative spaces blending art & innovation. Explore our projects that combine aesthetic design with functional spaces, highlighting creativity and attention to detail in every piece we craft.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 hover:text-[#DC2626] transition-colors pb-1 border-b-2 border-neutral-900 hover:border-[#DC2626] group"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Continuous Dual-Row Gallery Marquee ── */}
      <div className="marquee-container space-y-3 sm:space-y-4 relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks for modern luxury look */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolling Left */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-left flex gap-3 sm:gap-4 pl-4">
            {row1Doubled.map((item, idx) => (
              <div
                key={`r1-${item.id}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="group relative w-[160px] sm:w-[210px] md:w-[245px] aspect-[9/14] rounded-sm sm:rounded-md overflow-hidden bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-xl cursor-pointer transition-all duration-500 shrink-0 border border-neutral-200/80 hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  onError={(e) => {
                    e.target.src = '/categories/double-height.jpg';
                  }}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle permanent bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                {/* Interactive Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
                  <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#DC2626]" />
                    {item.category}
                  </span>
                  <h4 className="text-white text-xs sm:text-sm font-serif font-bold leading-snug mb-1 drop-shadow-sm">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-white/80 text-[10px] sm:text-[11px] mt-1 pt-1.5 border-t border-white/15">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#DC2626]" />
                      {item.location}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-white/90" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-right flex gap-3 sm:gap-4 pl-4">
            {row2Doubled.map((item, idx) => (
              <div
                key={`r2-${item.id}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="group relative w-[160px] sm:w-[210px] md:w-[245px] aspect-[9/14] rounded-sm sm:rounded-md overflow-hidden bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-xl cursor-pointer transition-all duration-500 shrink-0 border border-neutral-200/80 hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  onError={(e) => {
                    e.target.src = '/craft-main.jpg';
                  }}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle permanent bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                {/* Interactive Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
                  <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#DC2626]" />
                    {item.category}
                  </span>
                  <h4 className="text-white text-xs sm:text-sm font-serif font-bold leading-snug mb-1 drop-shadow-sm">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-white/80 text-[10px] sm:text-[11px] mt-1 pt-1.5 border-t border-white/15">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#DC2626]" />
                      {item.location}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-white/90" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal for Clicked Item ── */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-neutral-900 text-white rounded-lg overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto max-h-[70vh] bg-black">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between bg-neutral-900 border-t md:border-t-0 md:border-l border-white/10">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 inline-block mb-3">
                      {selectedItem.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                      {selectedItem.location}
                    </p>
                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                      Bespoke architectural installation executed with engineered circadian illumination, custom hand-blown glass, and seamless recessed details.
                    </p>
                  </div>

                  <Link
                    to="/projects"
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-3 px-4 rounded-xs bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-[#DC2626] hover:text-white transition-colors shadow-lg"
                  >
                    <span>View In Projects Portfolio</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
