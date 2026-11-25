import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mail } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

/**
 * Floating Action Widget with Individual Social Media & Contact Buttons
 * Features:
 * 1. Separate distinct buttons for Facebook, Instagram, YouTube, and Mail.
 * 2. Position adapts dynamically on product detail pages so it does NOT block the mobile sticky action bar.
 * 3. Scroll-To-Top button appears on scroll > 250px.
 */
export const FloatingActionWidget = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [showTopBtn, setShowTopBtn] = useState(false);

  const isProductDetail = location.pathname.startsWith('/product/');

  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/';
  const facebookUrl = settings?.socialLinks?.facebook || 'https://www.facebook.com/profile.php?id=61584975975926';
  const youtubeUrl = settings?.socialLinks?.youtube || 'https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C';
  const email = settings?.email || 'lighthutdecorativedlh@gmail.com';
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent('Inquiry: Light-Hut Luxury Lighting')}`;

  // Scroll visibility
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 250) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Floating social media and contact links"
      className={`fixed ${
        isProductDetail ? 'bottom-20 sm:bottom-6' : 'bottom-5 sm:bottom-6'
      } right-3 sm:right-6 z-50 flex flex-col items-center gap-2 sm:gap-3 select-none pointer-events-auto`}
    >
      {/* ── Scroll-To-Top Button (Appears when scrolled down) ── */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            onClick={scrollToTop}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-neutral-800 shadow-lg border border-neutral-200/90 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all cursor-pointer group relative"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline-flex absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-neutral-900/95 text-white text-[11px] font-medium tracking-wide shadow-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Facebook Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1877F2] hover:bg-[#1466d3] text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Follow on Facebook"
          aria-label="Facebook page"
        >
          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Facebook
        </span>
      </div>

      {/* ── Instagram Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Follow on Instagram"
          aria-label="Instagram profile"
        >
          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Instagram
        </span>
      </div>

      {/* ── YouTube Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FF0000] hover:bg-[#d00000] text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Watch on YouTube"
          aria-label="YouTube channel"
        >
          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          YouTube
        </span>
      </div>

      {/* ── Mail Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={mailtoUrl}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border border-white/15"
          title={`Email: ${email}`}
          aria-label={`Email ${email}`}
        >
          <Mail className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Email Us
        </span>
      </div>
    </aside>
  );
};
