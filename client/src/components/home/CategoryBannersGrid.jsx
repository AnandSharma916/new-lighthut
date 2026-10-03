import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FEATURED_BANNERS = [
  {
    id: 'banner-table-lamp',
    subtitle: 'Make Your Life Bright',
    title: 'TABLE LAMP',
    description: 'Warm bedside illumination & soothing ambient glow for restful living.',
    buttonText: 'SHOW MORE',
    link: '/catalog?category=table-lamp',
    image: '/banner-bedroom-clean.jpg',
    hoverImage: '/banner-bed.jpg',
  },
  {
    id: 'banner-pendant-lamp',
    subtitle: 'Suspended Grace',
    title: 'PENDANT LAMP',
    description: 'Mouth-blown fluted glass & sleek modern silhouettes for statement spaces.',
    buttonText: 'SHOW MORE',
    link: '/catalog?category=pendant-lamp',
    image: '/home/pendant-lh-2478.jpg',
    hoverImage: '/home/pendant-lh-842.jpg',
  },
  {
    id: 'banner-floor-lamp',
    subtitle: 'Freestanding Elegance',
    title: 'FLOOR LAMP',
    description: 'Statement arched floor lights & minimal vertical columns that define living spaces.',
    buttonText: 'SHOW MORE',
    link: '/catalog?category=floor-lamp',
    image: '/categories/floor-lamp.jpg',
    hoverImage: '/banner-empire.jpg',
  },
  {
    id: 'banner-chandelier',
    subtitle: 'Grand Statement',
    title: 'CHANDELIER',
    description: 'Spectacular crystal cascades & luxury centerpiece designs for high ceilings.',
    buttonText: 'SHOW MORE',
    link: '/catalog?category=chandelier',
    image: '/banner-chandelier-luxury.jpg',
    hoverImage: '/categories/italian-chandelier.jpg',
  },
  {
    id: 'banner-wall-lamp',
    subtitle: 'Architectural Accent',
    title: 'WALL LAMP',
    description: 'Refined wall illumination with direct and ambient wash for corridors & walls.',
    buttonText: 'SHOW MORE',
    link: '/catalog?category=wall-lamp',
    image: '/home/wall-lh-141w.jpg',
    hoverImage: '/home/wall-lh-7080w.jpg',
  },
];

export const CategoryBannersGrid = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-14 bg-white text-neutral-900 select-none border-b border-neutral-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        
        {/* 5-Column Category Banner Grid with Image Swap and Content Reveal on Hover */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {FEATURED_BANNERS.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 1, y: 0 }}
              className="w-full last:col-span-2 md:last:col-span-1"
            >
              <Link
                to={banner.link}
                className="group relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden block bg-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-2xl cursor-pointer rounded-xs transition-all duration-500 hover:-translate-y-1.5 border border-neutral-200/70"
              >
                {/* ── 1. Default Primary Image (Fades out smoothly on hover) ── */}
                <img
                  src={banner.image}
                  onError={(e) => {
                    e.target.src = '/categories/pendant-lamp.jpg';
                  }}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-108 group-hover:opacity-0 transition-all duration-700 ease-out"
                  loading="eager"
                />

                {/* ── 2. Alternate Hover Image (Smoothly fades in & gently scales on hover) ── */}
                <img
                  src={banner.hoverImage}
                  onError={(e) => {
                    e.target.src = banner.image;
                  }}
                  alt={`${banner.title} alternate`}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none"
                  loading="eager"
                />

                {/* ── 3. Subtle Default Category Label (Disappears on hover when full content reveals) ── */}
                <div className="absolute bottom-3.5 left-3.5 px-3 py-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wider uppercase rounded-xs transition-opacity duration-300 group-hover:opacity-0 pointer-events-none border border-white/10">
                  {banner.title}
                </div>

                {/* ── 4. Content Reveal on Hover (Title, Subtitle, Description, and SHOW MORE button) ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out p-5 sm:p-6 flex flex-col justify-end text-left pointer-events-none">
                  {/* Subtitle */}
                  <span className="text-red-400 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase mb-1 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    {banner.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="text-white text-base sm:text-lg font-serif font-bold tracking-wide uppercase mb-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-out delay-75">
                    {banner.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed line-clamp-2 mb-3.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-out delay-100">
                    {banner.description}
                  </p>

                  {/* SHOW MORE CTA Button */}
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-out delay-150">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-xs bg-white text-neutral-900 text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-lg group-hover:shadow-white/20 transition-all hover:bg-neutral-100">
                      <span>{banner.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Fine Outer Border */}
                <div className="absolute inset-0 border border-black/5 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
