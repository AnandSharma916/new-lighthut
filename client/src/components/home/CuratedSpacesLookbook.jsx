import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Curated Architectural Spaces Data for Bottom Carousel
───────────────────────────────────────────────────────────── */
const CURATED_SPACES = [
  {
    id: 'space-canopy-suite',
    title: 'Master Canopy Bed Suite',
    category: 'Bedside Pendants & Warm Grazers',
    link: '/catalog?category=pendant-lamp',
    image: '/home/pendant-lh-380.jpg',
    tag: 'Bedroom Sanctuary',
  },
  {
    id: 'space-fluted-lounge',
    title: 'Modern Fluted Wood Lounge',
    category: 'Linear Sconces & Cove Illumination',
    link: '/catalog?category=wall-lamp',
    image: '/home/wall-lh-3441wl.jpg',
    tag: 'Living Architecture',
  },
  {
    id: 'space-minimalist-salon',
    title: 'Contemporary Minimalist Salon',
    category: 'Sculptural Arc Floor Luminaire',
    link: '/catalog?category=floor-lamp',
    image: '/categories/floor-lamp.jpg',
    tag: 'Artisan Study',
  },
  {
    id: 'space-artisan-dining',
    title: 'Warm Hospitality Dining Room',
    category: 'Clustered Borosilicate Glass Drops',
    link: '/catalog?category=pendant-lamp',
    image: '/home/pendant-lh-2635.jpg',
    tag: 'Culinary Pavilion',
  },
  {
    id: 'space-grand-villa',
    title: 'Double-Height Grand Villa',
    category: 'Monumental Crystal Cascade Winch',
    link: '/catalog?category=double-height',
    image: '/categories/double-height.jpg',
    tag: 'Grand Atrium',
  },
  {
    id: 'space-coastal-facade',
    title: 'Architectural Facade & Terrace',
    category: 'IP65 Weatherproof Marine Grazers',
    link: '/catalog?category=outdoor-light',
    image: '/home/outdoor-lh-2150wl.jpg',
    tag: 'Exterior Facade',
  },
  {
    id: 'space-reading-salon',
    title: 'Executive Library & Reading Suite',
    category: 'Solid Italian Marble Task Lamp',
    link: '/catalog?category=table-lamp',
    image: '/banner-study.jpg',
    tag: 'Private Salon',
  },
  {
    id: 'space-penthouse-dining',
    title: 'Penthouse Dining & Sunset View',
    category: 'Fluted Glass Clusters & Spun Brass',
    link: '/catalog?category=dining-table-lamp',
    image: '/categories/dining-table-lamp.jpg',
    tag: 'Bespoke Dining',
  },
];

export const CuratedSpacesLookbook = ({ section }) => {
  const totalSpaces = CURATED_SPACES.length;

  // 3 repeating sets for seamless infinite loop (24 items total)
  const extendedSpaces = React.useMemo(() => {
    return [
      ...CURATED_SPACES.map((s, idx) => ({ ...s, uid: `set0-${s.id}-${idx}`, origIndex: idx })),
      ...CURATED_SPACES.map((s, idx) => ({ ...s, uid: `set1-${s.id}-${idx}`, origIndex: idx })),
      ...CURATED_SPACES.map((s, idx) => ({ ...s, uid: `set2-${s.id}-${idx}`, origIndex: idx })),
    ];
  }, []);

  // ── Bottom Carousel State ──
  const [currentIndex, setCurrentIndex] = useState(totalSpaces); // Start at set 1 (index 8)
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const currentDrag = useRef(0);
  const hasDragged = useRef(false);
  const pauseTimeout = useRef(null);
  const lastWheelTime = useRef(0);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Temporary pause with auto-resume helper after manual interaction
  const triggerUserInteractionPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, 2800);
  }, []);

  // Seamless infinite loop wrap: silently reset index without transition
  useEffect(() => {
    if (currentIndex >= 2 * totalSpaces) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex((prev) => prev - totalSpaces);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
          });
        });
      }, 700);
      return () => clearTimeout(timer);
    } else if (currentIndex < totalSpaces) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex((prev) => prev + totalSpaces);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
          });
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalSpaces]);

  // Auto-scroller timer: smoothly rotates every 3.2 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Mouse drag handlers ("cursor se drag / scroll")
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary mouse button
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    currentDrag.current = 0;
    setWithTransition(false);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 6) {
      hasDragged.current = true;
    }
    currentDrag.current = diff;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsDragging(false);
    setWithTransition(true);
    setDragOffset(0);

    const diff = currentDrag.current;
    if (diff < -40) {
      handleNext();
    } else if (diff > 40) {
      handlePrev();
    }

    triggerUserInteractionPause();
    setTimeout(() => {
      hasDragged.current = false;
    }, 80);
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      handleMouseUp();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    currentDrag.current = 0;
    hasDragged.current = false;
    setWithTransition(false);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 6) {
      hasDragged.current = true;
    }
    currentDrag.current = diff;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setWithTransition(true);
    setDragOffset(0);

    const diff = currentDrag.current;
    if (diff < -40) {
      handleNext();
    } else if (diff > 40) {
      handlePrev();
    }

    triggerUserInteractionPause();
    setTimeout(() => {
      hasDragged.current = false;
    }, 80);
  };

  // Mouse wheel / trackpad swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 25) return;

      const now = Date.now();
      if (now - lastWheelTime.current < 450) return;
      lastWheelTime.current = now;

      triggerUserInteractionPause();
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [handleNext, handlePrev, triggerUserInteractionPause]);

  return (
    <section className="py-8 sm:py-12 bg-white text-neutral-900 select-none overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6">

        {/* ════════════════════════════════════════════════════════
            TOP SECTION: EDITORIAL DUET SPLIT BANNERS
            (Empire Collection & Vita Amalfi)
        ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
          
          {/* ── LEFT BANNER: EMPIRE COLLECTION ── */}
          <Link
            to="/catalog?collection=empire"
            className="group relative h-[360px] sm:h-[430px] lg:h-[480px] w-full overflow-hidden block bg-neutral-900 shadow-sm shine-on-hover"
          >
            {/* Background Photography */}
            <img
              src="/banner-empire.jpg"
              alt="Empire Collection - Architectural Living"
              className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-1000 ease-out filter brightness-100 contrast-[1.02]"
              loading="eager"
            />

            {/* Subtle Bottom Gradient for Action Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Action Overlay: SHOP NOW */}
            <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-end z-10">
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white pb-1 border-b border-white group-hover:border-[#DC2626] group-hover:text-[#DC2626] transition-all duration-300">
                  <span>SHOP NOW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </div>
            </div>
          </Link>

          {/* ── RIGHT BANNER: VITA AMALFI ── */}
          <Link
            to="/catalog?collection=amalfi"
            className="group relative h-[360px] sm:h-[430px] lg:h-[480px] w-full overflow-hidden block bg-neutral-900 shadow-sm shine-on-hover"
          >
            {/* Background Photography with Warm Lighting Ambience */}
            <img
              src="/banner-amalfi.jpg"
              alt="Vita Amalfi - Intimate Ambient Illumination"
              className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-1000 ease-out filter brightness-100 contrast-[1.02]"
              loading="eager"
            />

            {/* Subtle Bottom Gradient for Action Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Action Overlay: SHOP NOW */}
            <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-end z-10">
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white pb-1 border-b border-white group-hover:border-[#DC2626] group-hover:text-[#DC2626] transition-all duration-300">
                  <span>SHOP NOW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* ════════════════════════════════════════════════════════
            BOTTOM SECTION ("NICHE WALA SECTION"):
            CURATED SPACES 4-COLUMN CAROUSEL WITH NAV ARROWS & CURSOR DRAG
        ════════════════════════════════════════════════════════ */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative group/spaces overflow-hidden select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Navigation Arrow: Left (<) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerUserInteractionPause();
              handlePrev();
            }}
            aria-label="Previous Spaces"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-900 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800" />
          </button>

          {/* Navigation Arrow: Right (>) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerUserInteractionPause();
              handleNext();
            }}
            aria-label="Next Spaces"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-900 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800" />
          </button>

          {/* Carousel Sliding Track */}
          <div
            className={`flex ${
              withTransition ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''
            }`}
            style={{
              transform: `translateX(calc(-${(currentIndex * 100) / itemsPerView}% + ${dragOffset}px))`,
            }}
          >
            {extendedSpaces.map((space) => (
              <div
                key={space.uid}
                style={{ width: `${100 / itemsPerView}%` }}
                className="shrink-0 px-1 sm:px-1.5"
              >
                <Link
                  to={space.link}
                  draggable={false}
                  onClick={(e) => {
                    if (hasDragged.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="group relative block aspect-[3/4] w-full overflow-hidden bg-neutral-900 shadow-sm shine-on-hover transform hover:-translate-y-1 transition-all duration-500 rounded-[2px]"
                >
                  {/* Space Image */}
                  <img
                    src={space.image}
                    draggable={false}
                    onError={(e) => {
                      e.target.src = '/craft-main.jpg';
                    }}
                    alt={space.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-700 ease-out pointer-events-none select-none"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Tag Pill on Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                      {space.tag}
                    </span>
                  </div>

                  {/* Bottom Space Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
                    <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-white tracking-tight leading-snug group-hover:text-[#DC2626] transition-colors">
                      {space.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 mt-1 line-clamp-1">
                      {space.category}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-medium text-white/90 uppercase tracking-wider">
                      <span>Explore Look</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#DC2626] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator for Carousel */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalSpaces }).map((_, idx) => {
            const activeDot = ((currentIndex % totalSpaces) + totalSpaces) % totalSpaces;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  triggerUserInteractionPause();
                  setWithTransition(true);
                  setCurrentIndex(totalSpaces + idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeDot === idx
                    ? 'w-6 bg-neutral-900'
                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-500'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
