import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MASTER_CATEGORIES } from '../../data/catalogData';
import { NEUTRAL_FALLBACK_IMAGE } from '../../utils/imageCompressor';

// Tailored high-definition photography for each of the 10 lighting categories
const CATEGORY_IMAGE_MAP = {
  'wall-lamp': '/home/wall-lh-503w.jpg',
  'pendant-lamp': '/home/pendant-lh-842.jpg',
  'chandelier': '/categories/chandelier.jpg',
  'double-height': '/categories/double-height.jpg',
  'dining-table-lamp': '/categories/dining-table-lamp.jpg',
  'outdoor-light': '/home/outdoor-lh-9023.jpg',
  'table-lamp': '/categories/table-lamp.jpg',
  'floor-lamp': '/categories/floor-lamp.jpg',
  'led-filament-bulb': '/categories/led-filament-bulb.jpg',
  'spare-part': '/categories/spare-part.jpg',
};

export const ExploreProductRangeSection = ({ section }) => {
  // Exclude 'spare-part' from the product range slider
  const categories = React.useMemo(() => {
    return MASTER_CATEGORIES.filter((cat) => cat.slug !== 'spare-part');
  }, []);
  const count = categories.length;

  // Create an extended array (5 sets = 50 cards) for infinite smooth sliding
  const REPEAT_COUNT = 5;
  const extendedCategories = React.useMemo(() => {
    const list = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      categories.forEach((cat, origIndex) => {
        list.push({ ...cat, origIndex, uniqueKey: `${r}-${cat.slug}` });
      });
    }
    return list;
  }, [categories]);

  // Start with Chandelier (index 2) in the center repeated set (set 2, index 22)
  const initialIndex = 2 * count + 2;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [slotWidth, setSlotWidth] = useState(250);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Mouse cursor drag & wheel scrolling support
  const containerRef = useRef(null);
  const isMouseDown = useRef(false);
  const hasDragged = useRef(false);
  const mouseStartX = useRef(0);
  const mouseEndX = useRef(0);
  const lastWheelTime = useRef(0);

  // Responsive slot width tracking for center alignment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlotWidth(180);
      } else if (window.innerWidth < 1024) {
        setSlotWidth(220);
      } else {
        setSlotWidth(250);
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

  // Automatic smooth slide every 3.5 seconds (pauses on hover, mouse drag, or touch)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Seamless infinite loop wrap: silently reset index without transition when approaching edges
  useEffect(() => {
    if (currentIndex >= 4 * count) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        const normalized = 2 * count + (currentIndex % count);
        setCurrentIndex(normalized);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
          });
        });
      }, 720);
      return () => clearTimeout(timer);
    } else if (currentIndex < count) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        const normalized = 3 * count + (currentIndex % count);
        setCurrentIndex(normalized);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
          });
        });
      }, 720);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, count]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
  };

  // Mouse cursor drag support ("cursor se scroll / drag")
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary mouse button
    isMouseDown.current = true;
    hasDragged.current = false;
    mouseStartX.current = e.clientX;
    mouseEndX.current = e.clientX;
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    mouseEndX.current = e.clientX;
    const diff = Math.abs(mouseStartX.current - e.clientX);
    if (diff > 8) {
      hasDragged.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsPaused(false);
    const diff = mouseStartX.current - mouseEndX.current;
    if (diff > 35) {
      handleNext();
    } else if (diff < -35) {
      handlePrev();
    }
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  // Mouse wheel scroll support ("cursor se scroll hone par bhi work kare")
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelScroll = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 16) return;

      // Prevent window vertical jump while scrolling through category coverflow
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current < 230) return;
      lastWheelTime.current = now;

      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    };

    el.addEventListener('wheel', onWheelScroll, { passive: false });
    return () => el.removeEventListener('wheel', onWheelScroll);
  }, [handleNext, handlePrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const activeCategoryIndex = ((currentIndex % count) + count) % count;

  return (
    <section className="py-20 sm:py-28 bg-[#ffffff] text-[#111111] overflow-hidden select-none border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">
        {/* Title matching exact design */}
        <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-medium tracking-[0.16em] uppercase text-[#111111] font-sans">
          EXPLORE OUR PRODUCT RANGE
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#6b6b6b] mt-3 max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
          Discover diverse world of our products, each category offering a unique solution for the lifestyle.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════
          SMOOTH SLIDING TRACK CAROUSEL STAGE
          Cards physically slide horizontally on every auto/manual step
      ════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[500px] sm:min-h-[550px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Fixed In-Line Navigation Arrows (situated on left & right of center card) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
          <div className="relative w-full max-w-7xl px-4 sm:px-8 flex items-center justify-center">
            {/* Left Arrow (←) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product category"
              style={{ transform: `translateX(-${slotWidth * 0.95}px)` }}
              className="pointer-events-auto p-2 text-[#222222] hover:text-[#DC2626] hover:scale-125 transition-all duration-200 cursor-pointer hidden md:flex items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-light">←</span>
            </button>

            {/* Right Arrow (→) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next product category"
              style={{ transform: `translateX(${slotWidth * 0.95}px)` }}
              className="pointer-events-auto p-2 text-[#222222] hover:text-[#DC2626] hover:scale-125 transition-all duration-200 cursor-pointer hidden md:flex items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-light">→</span>
            </button>
          </div>
        </div>

        {/* Mobile Edge Navigation Arrows */}
        <div className="md:hidden absolute inset-x-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous"
            className="pointer-events-auto p-2.5 bg-white/95 rounded-full shadow-lg text-neutral-800 text-lg active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next"
            className="pointer-events-auto p-2.5 bg-white/95 rounded-full shadow-lg text-neutral-800 text-lg active:scale-95 transition-transform"
          >
            →
          </button>
        </div>

        {/* ── CONTINUOUS HORIZONTAL SLIDING TRACK ── */}
        <div
          className="flex items-center"
          style={{
            transform: `translateX(calc(50% - ${currentIndex * slotWidth + slotWidth / 2}px))`,
            transition: withTransition
              ? 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
        >
          {extendedCategories.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isCenter = distance === 0;
            const isImmediate = distance === 1;
            const isSecond = distance === 2;
            const imageSrc = CATEGORY_IMAGE_MAP[item.slug] || item.image;

            return (
              <div
                key={item.uniqueKey}
                style={{ width: `${slotWidth}px` }}
                className="shrink-0 flex items-center justify-center px-1.5 sm:px-2"
              >
                <div
                  onClick={() => {
                    if (hasDragged.current) return;
                    if (!isCenter) {
                      setWithTransition(true);
                      setCurrentIndex(idx);
                    }
                  }}
                  style={{
                    transition: withTransition
                      ? 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
                      : 'none',
                  }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    isCenter
                      ? 'w-[230px] sm:w-[280px] lg:w-[310px] h-[440px] sm:h-[490px] lg:h-[520px] shadow-[0_20px_45px_rgba(0,0,0,0.20)] z-20 ring-1 ring-black/5'
                      : isImmediate
                      ? 'w-[160px] sm:w-[200px] lg:w-[225px] h-[370px] sm:h-[415px] lg:h-[440px] shadow-sm z-10 opacity-90 hover:opacity-100'
                      : isSecond
                      ? 'w-[140px] sm:w-[175px] lg:w-[195px] h-[330px] sm:h-[370px] lg:h-[390px] shadow-sm z-5 opacity-75 hover:opacity-95'
                      : 'w-[110px] sm:w-[140px] lg:w-[160px] h-[290px] sm:h-[320px] lg:h-[340px] opacity-45 z-0'
                  }`}
                >
                  {/* Category Photography */}
                  <img
                    src={imageSrc}
                    onError={(e) => {
                      e.target.src = CATEGORY_IMAGE_MAP[item.slug] || NEUTRAL_FALLBACK_IMAGE;
                    }}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105 pointer-events-none filter brightness-[1.03] contrast-[1.03]"
                    loading="lazy"
                  />

                  {/* Gradient Shadow Overlay for Text Readability (Subtle & Clear) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 pointer-events-none ${
                      isCenter ? 'opacity-80' : 'opacity-50'
                    }`}
                  />

                  {/* ── CARD BOTTOM CONTENT ── */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col items-center justify-end text-center z-10 pointer-events-none">
                    {/* Category Title */}
                    <h3
                      className={`text-white transition-all duration-500 text-center tracking-normal ${
                        isCenter
                          ? 'text-base sm:text-lg font-medium mb-3 drop-shadow'
                          : 'text-xs sm:text-sm font-normal mb-0.5 text-white/95 drop-shadow-sm line-clamp-1'
                      }`}
                    >
                      {item.name}
                    </h3>

                    {/* Center Card Action Button: "Find Out More" */}
                    <div
                      className={`transition-all duration-500 ${
                        isCenter
                          ? 'opacity-100 translate-y-0 pointer-events-auto mt-1'
                          : 'opacity-0 translate-y-3 pointer-events-none h-0 overflow-hidden'
                      }`}
                    >
                      <Link
                        to={`/catalog?category=${item.slug}`}
                        className="inline-block px-6 py-2 rounded-[3px] bg-[#111111] hover:bg-[#DC2626] text-white text-[11px] sm:text-xs font-sans tracking-wide font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Find Out More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Indicators / Dots */}
      <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5">
        {categories.map((cat, idx) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              const currentMod = ((currentIndex % count) + count) % count;
              const diff = idx - currentMod;
              setWithTransition(true);
              setCurrentIndex((prev) => prev + diff);
            }}
            aria-label={`Go to ${cat.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeCategoryIndex === idx
                ? 'w-7 bg-[#DC2626]'
                : 'w-1.5 bg-neutral-200 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
