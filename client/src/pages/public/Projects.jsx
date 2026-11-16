import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building, Sparkles, ArrowRight, Mail, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export const Projects = () => {
  const { settings } = useSettings();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    document.title = `Lighting Projects & Installations | ${settings.companyName || 'Lighting Studio'}`;
  }, [settings.companyName]);

  const projects = [
    {
      id: 1,
      title: 'Meridian Grand Hotel & Central Atrium',
      location: 'Mumbai, India',
      category: 'hospitality',
      categoryLabel: '5-Star Hospitality',
      lampType: 'Chandelier',
      lampIcon: '✨',
      year: '2025',
      image: '/categories/chandelier.jpg',
      description: 'Cascading Murano-inspired crystal prisms commanding a 28ft double-height central atrium, engineered with motorized winch suspension and circadian 3000K warm illumination.',
      specs: '28ft Ceiling Drop • Up to 6m Suspension • K9 Murano Prisms',
      fixtures: ['LH-CH880 Royal Waterfall', 'LH-2036 Ring Pendant', 'LH-6036 Slim Sconce'],
    },
    {
      id: 2,
      title: 'The Oberoi Presidential Luxury Suites',
      location: 'New Delhi, India',
      category: 'residential',
      categoryLabel: 'Ultra-Luxury Villa',
      lampType: 'Wall Lamp',
      lampIcon: '💡',
      year: '2025',
      image: '/categories/wall-lamp.jpg',
      description: 'Bi-directional wall grazers & fluted opal glass sconces delivering soft, anti-glare ambient warmth along master bedroom alcoves and private corridors.',
      specs: 'Ra > 95 CRI • 2700K Warm Twilight • Dual-Emission Beam',
      fixtures: ['LH-6031W Brushed Gold', 'LH-3303 Fluted Opal Sconce'],
    },
    {
      id: 3,
      title: 'Artisan Culinary & Dining Pavilion',
      location: 'Jaipur, India',
      category: 'commercial',
      categoryLabel: 'Fine Dining Restaurant',
      lampType: 'Pendant Lamp',
      lampIcon: '🔆',
      year: '2024',
      image: '/categories/pendant-lamp.jpg',
      description: 'Mouth-blown fluted glass cluster pendants providing warm, intimate focal pools of light over solid walnut dining tables with anti-flicker dimming.',
      specs: 'Dim-to-Warm 2200K-3000K • Mouth-Blown Borosilicate',
      fixtures: ['LH-P124 Smoked Fluted Glass', 'LH-G074A Champagne Drop', 'LH-SD102W Wall Light'],
    },
    {
      id: 4,
      title: 'Horizon Business Pavilion & Facade',
      location: 'Bengaluru, India',
      category: 'commercial',
      categoryLabel: 'Corporate Headquarters',
      lampType: 'Outdoor & Facade',
      lampIcon: '🌿',
      year: '2025',
      image: '/categories/outdoor-light.jpg',
      description: 'IP65 marine-grade architectural facade grazers highlighting textured fluted stone panels without upward light pollution, tested against severe monsoon downpours.',
      specs: 'IP65 / IK08 • Marine Aluminum • Dark-Sky Compliant Optics',
      fixtures: ['LH-OD501 Dark-Sky Grazer', 'LH-TR48 Recessed Track'],
    },
    {
      id: 5,
      title: 'Solitaire Sky-Villa Grand Duplex Atrium',
      location: 'Gurugram, India',
      category: 'residential',
      categoryLabel: 'Duplex Penthouse',
      lampType: 'Double Height',
      lampIcon: '🏛️',
      year: '2025',
      image: '/categories/double-height.jpg',
      description: 'Monumental cascading spiral drop installation engineered with reinforced aircraft-grade steel cables for a 24ft double-height living foyer and floating staircase.',
      specs: '24ft Duplex Volume • Multi-Zone DALI-2 • 12,000 lm',
      fixtures: ['LH-DH901 Grand Helical Cascade', 'LH-2036 Modern Ring Chandelier'],
    },
    {
      id: 6,
      title: 'The Amanora Architectural Residence',
      location: 'New Delhi, India',
      category: 'residential',
      categoryLabel: 'Private Estate',
      lampType: 'Magnetic Track',
      lampIcon: '⚡',
      year: '2025',
      image: '/hero-chandelier.jpg',
      description: 'Recessed low-voltage magnetic rails with tool-free modular spotlights and wall wash optics casting clean accent lighting across contemporary art galleries.',
      specs: 'Ultra Low Glare UGR < 13 • 48V Safe • Modular Snap-in',
      fixtures: ['LH-TR48 48V System', 'LH-6031W Brushed Gold Sconce'],
    },
    {
      id: 7,
      title: 'Solitaire Private Library & Salon',
      location: 'Kolkata, India',
      category: 'residential',
      categoryLabel: 'Executive Residence',
      lampType: 'Table & Floor',
      lampIcon: '🪔',
      year: '2024',
      image: '/categories/table-lamp.jpg',
      description: 'Sculptural solid Italian Carrara marble base task lamps and arched brushed brass floor luminaires delivering gentle reading light for executive study suites.',
      specs: 'Carrara Marble Base • 3-Stage Touch Dimming • High CRI',
      fixtures: ['LH-T2309 Marble Arc', 'LH-B6002W Reading Light'],
    },
    {
      id: 8,
      title: 'Viceroy Waterfront Executive Lounge',
      location: 'Goa, India',
      category: 'hospitality',
      categoryLabel: 'Luxury Resort',
      lampType: 'Dining Lamp',
      lampIcon: '🍽️',
      year: '2025',
      image: '/categories/dining-table-lamp.jpg',
      description: 'Minimalist brushed bronze linear suspension fixture with precision honeycomb anti-glare louvers illuminating waterfront executive dining tables.',
      specs: 'Honeycomb Anti-Glare • Dim-to-Warm • Brushed Bronze',
      fixtures: ['LH-DL204 Linear Bar', 'LH-6031W Gold Sconce'],
    },
  ];

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── PROJECTS ARCHITECTURAL HERO BANNER ── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-neutral-800 overflow-hidden bg-neutral-950 mb-12">
        {/* Background Architectural Showcase Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/showroom-hero-hd.jpg"
            onError={(e) => {
              e.target.src = '/craft-main.jpg';
            }}
            alt="Architectural Lighting Projects & Masterpiece Installations"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
          />
          {/* Subtle multi-layer cinematic gradient: left text is crisp, right architectural structure is 100% visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          {/* Subtle Crimson Red Ambient Orb */}
          <div className="absolute -top-28 -right-28 w-[30rem] h-[30rem] bg-[#DC2626]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-luxury mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                Installed Excellence
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight leading-tight drop-shadow-md">
                Architectural Projects
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 mt-3 max-w-xl font-light leading-relaxed drop-shadow">
                Inspect real-world luminaire installations across premier hospitality, luxury residential villas, and landmark commercial pavilions.
              </p>
            </div>

            {/* Filter Pills embedded inside banner */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0 shadow-lg">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'residential', label: 'Residential' },
                { id: 'hospitality', label: 'Hospitality' },
                { id: 'commercial', label: 'Commercial' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-luxury transition-all duration-200 cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#DC2626] text-white font-bold shadow-md scale-102'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group rounded-2xl overflow-hidden bg-white border border-neutral-200 hover:border-[#DC2626] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={project.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/categories/double-height.jpg';
                      }}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-luxury text-red-200 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-semibold">
                        {project.categoryLabel}
                      </span>
                      {project.lampType && (
                        <span className="text-[10.5px] text-white bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 font-medium flex items-center gap-1 shadow-md">
                          <span>{project.lampIcon}</span>
                          <span>{project.lampType}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{project.location}</span>
                    </div>

                    <h3 className="font-serif-luxury text-xl text-neutral-900 font-bold group-hover:text-[#DC2626] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase tracking-luxury text-neutral-500 font-semibold">
                      Specified:
                    </span>
                    {project.fixtures.map((sku) => (
                      <span
                        key={sku}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/catalog"
                    className="text-xs font-bold uppercase tracking-luxury text-[#DC2626] hover:text-neutral-900 flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>View Fixtures</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── ARCHITECT & DESIGNER TRADE COLLABORATION BANNER ── */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Architectural Specifications & Photometry</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Specify Our Luminaires in Your Next Masterpiece
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Collaborate directly with our technical team for custom double-height drops, 3D CAD models, IES photometric calculations, and trade volume quotes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/contact"
              className="btn-gold w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury text-center inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Submit Project Blueprint</span>
            </Link>
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 hover:border-white text-white bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-luxury text-center transition-colors"
            >
              Explore Full Catalog
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
