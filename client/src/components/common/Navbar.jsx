import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SearchModal } from './SearchModal';
import { InquiryModal } from './InquiryModal';
import { LHLogo } from './LHLogo';
import { CascadingCategoryDropdown, PRODUCT_CATEGORIES_DATA } from './CascadingCategoryDropdown';

const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_DATA;

/* ─────────────────────────────────────────────────────────────
   Mega Menu (desktop)
───────────────────────────────────────────────────────────── */
const MegaMenu = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[820px] max-w-[95vw]
               bg-[#0f1117]/98 backdrop-blur-2xl border border-white/10
               rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 z-50"
    onMouseLeave={onClose}
  >
    {/* Header row */}
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#DC2626] font-bold">
        Product Categories
      </span>
      <Link
        to="/catalog"
        onClick={onClose}
        className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-[#DC2626] transition-colors font-semibold"
      >
        View Full Catalog <ArrowRight className="w-3 h-3" />
      </Link>
    </div>

    {/* Grid of categories */}
    <div className="grid grid-cols-4 gap-x-6 gap-y-1">
      {PRODUCT_CATEGORIES.map((cat) => (
        <div key={cat.slug} className="space-y-1">
          {/* Parent category */}
          <Link
            to={`/catalog?category=${cat.slug}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-white font-bold text-[11px] uppercase tracking-wider
                       hover:text-[#DC2626] transition-colors group"
          >
            <span className="text-sm leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
            {cat.sub.length > 0 && (
              <ChevronRight className="w-2.5 h-2.5 text-neutral-500 group-hover:text-[#DC2626] transition-colors ml-auto" />
            )}
          </Link>

          {/* Sub-categories */}
          {cat.sub.length > 0 && (
            <ul className="space-y-0.5 pl-5 border-l border-[#DC2626]/20">
              {cat.sub.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    to={`/catalog?category=${cat.slug}&sub=${sub.slug}`}
                    onClick={onClose}
                    className="block text-[11px] text-neutral-400 hover:text-[#DC2626]
                               hover:translate-x-0.5 transition-all duration-150 py-0.5 leading-snug"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>

    {/* Footer CTA strip */}
    <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
      <span className="text-[10px] text-neutral-500">
        {PRODUCT_CATEGORIES.length} Categories · {PRODUCT_CATEGORIES.reduce((a, c) => a + c.sub.length, 0)} Sub-types
      </span>
      <Link
        to="/catalog"
        onClick={onClose}
        className="btn-gold px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
      >
        <Zap className="w-3 h-3" /> Browse All Products
      </Link>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   Mobile accordion category item - Light Theme
───────────────────────────────────────────────────────────── */
const MobileCatItem = ({ cat, onClose }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          to={`/catalog?category=${cat.slug}`}
          onClick={onClose}
          className="flex items-center gap-2.5 flex-1 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:text-[#DC2626] transition-colors"
        >
          <span className="text-base">{cat.icon}</span>
          <span className="tracking-wide">{cat.name}</span>
        </Link>
        {cat.sub && cat.sub.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="p-2.5 text-neutral-400 hover:text-[#DC2626] transition-colors cursor-pointer"
            aria-label={`Expand ${cat.name}`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && cat.sub && cat.sub.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-3 pb-2 space-y-1.5 bg-neutral-100/70 rounded-xl mx-2 mb-1"
          >
            {cat.sub.map((sub) => (
              <Link
                key={sub.slug}
                to={`/catalog?category=${cat.slug}&sub=${sub.slug}`}
                onClick={onClose}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white transition-all text-xs text-neutral-700 hover:text-[#DC2626] border border-transparent hover:border-neutral-200 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-neutral-200 border border-neutral-300/80">
                  <img
                    src={sub.image || `/categories/${cat.slug}.jpg`}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold truncate leading-tight">{sub.name}</span>
                  <span className="text-[10px] text-neutral-400 block truncate">{sub.desc || 'Architectural Typology'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────────── */
export const Navbar = () => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const megaRef = useRef(null);
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-neutral-200 shadow-md py-2.5'
          : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-sm py-3'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">

          {/* ── Logo Image Only ── */}
          <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="Home">
            <img
              src={settings.logo || '/categories/logo.png'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/categories/logo.png';
              }}
              alt="Light-Hut"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* ── Desktop Nav (Official Serial Order) ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" ref={megaRef}>
            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] rounded-xl transition-all ${isActive
                  ? 'text-[#DC2626] bg-red-50 font-bold'
                  : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100/70'
                }`
              }
            >
              Home
            </NavLink>

            {/* 2. Catalog with Cascading Category Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <NavLink
                to="/catalog"
                id="catalog-mega-btn"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] rounded-xl transition-all duration-300 border cursor-pointer ${
                    isActive || megaOpen
                      ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-[#DC2626]/25'
                      : 'bg-red-50 text-[#DC2626] border-red-200/90 shadow-2xs hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] hover:shadow-lg hover:shadow-[#DC2626]/30 hover:-translate-y-0.5'
                  }`
                }
              >
                <span>Catalog</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaOpen ? 'rotate-180 text-white' : 'text-current'
                  }`}
                />
              </NavLink>

              <AnimatePresence>
                {megaOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <CascadingCategoryDropdown onClose={() => setMegaOpen(false)} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Projects */}
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `px-3.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] rounded-xl transition-all ${isActive
                  ? 'text-[#DC2626] bg-red-50 font-bold'
                  : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100/70'
                }`
              }
            >
              Projects
            </NavLink>

            {/* 5. About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] rounded-xl transition-all ${isActive
                  ? 'text-[#DC2626] bg-red-50 font-bold'
                  : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100/70'
                }`
              }
            >
              About US
            </NavLink>

            {/* 6. Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] rounded-xl transition-all ${isActive
                  ? 'text-[#DC2626] bg-red-50 font-bold'
                  : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100/70'
                }`
              }
            >
              Contact US
            </NavLink>
          </nav>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-700 hover:text-neutral-900
                         bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200
                         transition-all text-[11px] uppercase tracking-wider font-semibold"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Search</span>
            </button>

            <button
              id="navbar-inquiry-btn"
              onClick={() => setInquiryOpen(true)}
              className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold
                         uppercase tracking-wider shadow-md shadow-[#DC2626]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Inquiry</span>
            </button>
          </div>

          {/* ── Mobile: Search + Hamburger ── */}
          <div className="flex lg:hidden items-center gap-1 shrink-0">
            <button
              id="mobile-search-btn"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#DC2626]" />
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Full-Screen Drawer - Light Theme ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-white
                         border-l border-neutral-200 flex flex-col shadow-2xl text-neutral-800"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
                <Link to="/" onClick={closeMobile} className="flex items-center gap-2">
                  <img
                    src={settings.logo || '/categories/logo.png'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/categories/logo.png';
                    }}
                    alt="Light-Hut"
                    className="h-9 sm:h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content ── */}
              <div className="flex-1 overflow-y-auto">

                {/* 1. Home Link */}
                <div className="px-4 pt-4 pb-1">
                  <NavLink
                    to="/"
                    end
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] rounded-xl transition-colors ${isActive
                        ? 'text-[#DC2626] bg-red-50 font-bold'
                        : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </div>

                {/* 2. Catalog Categories Accordion */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#DC2626] font-bold">
                      Catalog Categories
                    </p>
                    <Link
                      to="/catalog"
                      onClick={closeMobile}
                      className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-[#DC2626] transition-colors font-bold"
                    >
                      All Products →
                    </Link>
                  </div>
                  <div className="space-y-0.5 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50/50">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <MobileCatItem key={cat.slug} cat={cat} onClose={closeMobile} />
                    ))}
                  </div>
                </div>

                {/* 3-6. Catalog, Projects, About, Contact Links */}
                <div className="px-4 pt-1 pb-4 space-y-1">
                  {[
                    { name: 'Catalog', path: '/catalog' },
                    { name: 'Projects', path: '/projects' },
                    { name: 'About', path: '/about' },
                    { name: 'Contact', path: '/contact' },
                  ].map((link) => {
                    const isCatalog = link.name === 'Catalog';
                    return (
                      <NavLink
                        key={link.name}
                        to={link.path}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          isCatalog
                            ? `flex items-center justify-between px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] rounded-xl transition-all duration-200 border ${
                                isActive
                                  ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-[#DC2626]/25'
                                  : 'bg-red-50 text-[#DC2626] border-red-200/90 hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626]'
                              }`
                            : `block px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] rounded-xl transition-colors ${
                                isActive
                                  ? 'text-[#DC2626] bg-red-50 font-bold'
                                  : 'text-neutral-700 hover:text-[#DC2626] hover:bg-neutral-100'
                              }`
                        }
                      >
                        <span>{link.name}</span>
                        {isCatalog && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#DC2626] border border-red-200 shadow-2xs">
                            Featured
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Drawer footer with Inquiry & WhatsApp Actions */}
              <div className="px-4 pb-6 pt-3 border-t border-neutral-200 space-y-2.5 shrink-0 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { closeMobile(); setInquiryOpen(true); }}
                    className="btn-gold py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquiry</span>
                  </button>
                  <a
                    href="https://wa.me/919811869622?text=Hello%20Light-Hut%2C%20I%20am%20interested%20in%20your%20architectural%20lighting%20fixtures."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <a
                  href="mailto:lighthutdecorativedlh@gmail.com"
                  className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#DC2626] transition-colors px-1"
                >
                  <Mail className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span className="truncate">lighthutdecorativedlh@gmail.com</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
};
