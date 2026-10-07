import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, ShieldCheck, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const AboutSection = ({ section }) => {
  const title = section?.title || 'Precision Craftsmanship Meets Optical Mastery';
  const subtitle = section?.subtitle || 'HERITAGE & ARCHITECTURAL ILLUMINATION';
  const description =
    section?.description ||
    'We handcraft luxury architectural luminaires from solid virgin brass, K9 optical crystal, and circadian optics to transform prestigious residences into warm sanctuaries.';

  const pillars = [
    {
      icon: Layers,
      title: 'Solid Virgin Metallurgy',
      desc: 'Precision-lathed virgin brass and alloy with hand-burnished anti-tarnish patinas.',
    },
    {
      icon: Sparkles,
      title: 'Museum-Grade Optics (CRI 98+)',
      desc: 'Circadian optical engines engineered for glare-free, natural color fidelity.',
    },
    {
      icon: ShieldCheck,
      title: 'Bespoke Atrium Engineering',
      desc: 'Custom suspension drops, load-tested mounting, and motorized winch integrations.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#FAFAFA] text-neutral-900 border-t border-neutral-200/80 select-none overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Equal 50/50 Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ════════════════════════════════════════════════════════
              LEFT COLUMN: BALANCED EDITORIAL VISUAL COMPOSITION
          ════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-full"
          >
            {/* Main Flagship Showroom Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[4/3] sm:aspect-[14/11] border border-neutral-200 group">
              <img
                src="/philosophy-grand-chandelier.jpg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/craft-main.jpg';
                }}
                alt="Light-Hut Flagship Lighting Gallery"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Bottom Inset Tag for Main Image */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/15">
                  Flagship Architectural Gallery
                </span>
              </div>
            </div>

            {/* Floating Artisan Craftsmanship Detail Inset Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-6 w-[54%] sm:w-[50%] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-4 border-white bg-neutral-900 group/detail"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/craft-detail.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/categories/chandelier.jpg';
                  }}
                  alt="Handcrafted Artisan Assembly"
                  className="w-full h-full object-cover object-center transform group-hover/detail:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white font-medium block">
                    Artisan Metallurgy & K9 Crystal
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Top Floating Experience Badge */}
            <div className="absolute -top-4 -left-2 sm:-top-5 sm:-left-5 px-4 py-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 flex items-center gap-2.5 z-20">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block leading-tight">
                  10,000+ Estates Lit
                </span>
                <span className="text-[10px] text-neutral-500 font-mono block">
                  Across India & GCC
                </span>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════
              RIGHT COLUMN: EDITORIAL STORY & PILLARS (EQUAL 50%)
          ════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col justify-center space-y-6 pt-6 lg:pt-0"
          >
            {/* Category Subtitle & Main Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-[11px] font-bold uppercase tracking-widest mb-3.5">
                <Award className="w-3.5 h-3.5" />
                <span>{subtitle}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-neutral-900 tracking-tight leading-[1.18]">
                {title}
              </h2>
            </div>

            {/* Story Paragraph */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              {description}
            </p>

            {/* 3 Craftsmanship Pillars */}
            <div className="space-y-3.5 pt-1">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white border border-neutral-200/70 shadow-xs hover:border-[#DC2626]/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-[#DC2626]/10 text-[#DC2626] shrink-0 mt-0.5 group-hover:bg-[#DC2626] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-wide group-hover:text-[#DC2626] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Stat Counters */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-neutral-200/80 bg-white/60 rounded-xl px-4">
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
                  10K+
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                  Homes Lit
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
                  98+
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                  High CRI Optics
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
                  100%
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                  Virgin Alloys
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#DC2626] transition-all shadow-md group"
              >
                <span>Read Full Company Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:border-neutral-900 hover:text-neutral-950 transition-all shadow-xs"
              >
                <span>Explore Portfolio</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

