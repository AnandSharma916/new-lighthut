import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  Shield,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { LightHut } from './BrandWordmark';

/**
 * Luxury Architectural Lighting Footer & Above-Footer Section
 * Matches the editorial IMDC architectural aesthetic:
 * 1. Above Footer: Textured architectural wall with glowing sconces & climbing ivy,
 *    frosted glassmorphic card with "Luxury lighting without risk." & "Explore Our Products" button.
 * 2. Footer: Pitch black layout with 4 vertical divider-separated columns,
 *    warm gold column header accents, and bronze bottom sub-footer bar.
 */
export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="w-full relative bg-black text-neutral-300 overflow-hidden select-none">
      
      {/* ════════════════════════════════════════════════════════
          1. ABOVE FOOTER SECTION: LUXURY FROSTED GLASS BANNER
          (Exact match to reference design)
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-neutral-950">
        
        {/* Background Architectural Wall with Glowing Sconces & Climbing Ivy */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/above-footer-bg.jpg"
            onError={(e) => {
              e.target.src = '/showroom-hero-hd.jpg';
            }}
            alt="Architectural Lighting Wall"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            loading="lazy"
          />
          {/* Subtle gradient vignette to blend into black footer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50 pointer-events-none" />
        </div>

        {/* Central Frosted Glassmorphism Card */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] sm:rounded-[36px] bg-white/[0.10] backdrop-blur-[24px] -webkit-backdrop-blur-[24px] border border-white/25 p-8 sm:p-12 lg:p-14 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col gap-8 transition-all duration-300">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10">
              {/* Left: Brand Logo & Typography */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center">
                  <div className="px-3.5 py-2 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <img
                      src={settings?.logo || '/categories/logo.png'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.png';
                      }}
                      alt="LightHut Decorative Solutions"
                      className="h-10 sm:h-11 w-auto object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-light tracking-tight text-white leading-[1.2] drop-shadow-sm">
                  Luxury lighting without risk.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-200/90 font-light leading-relaxed">
                  Design, support, and assurance — from bespoke consultation to site installation.
                </p>
              </div>

              {/* Right: Primary Action Buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-white text-neutral-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-0.5"
                >
                  <span>Explore Catalog</span>
                  <span className="w-8 h-8 rounded-full bg-[#DC2626] group-hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors duration-300 shadow">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all backdrop-blur-sm"
                >
                  <span>Contact Showroom</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. MAIN FOOTER: 4 DIVIDER-SEPARATED COLUMNS
          (Pitch black with gold column top accents)
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 bg-black pt-16 sm:pt-20 pb-16 sm:pb-20 border-t border-neutral-900">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
            
            {/* ── COLUMN 1: BRAND LOGO & EDITORIAL MISSION (Span 5) ── */}
            <div className="lg:col-span-5 pr-0 md:pr-8 lg:pr-14 pb-10 md:pb-0 space-y-5">
              
              {/* Brand Logo Image Added */}
              <Link to="/" className="inline-flex items-center group">
                <div className="px-3.5 py-2 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <img
                    src={settings?.logo || '/categories/logo.png'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.png';
                    }}
                    alt="LightHut Decorative Solutions"
                    className="h-10 sm:h-11 w-auto object-contain"
                  />
                </div>
              </Link>

              {/* Uppercase Category Headline */}
              <h3 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 pt-2">
                PRESENTING THE FINEST IN ARCHITECTURAL LIGHTING
              </h3>

              {/* Paragraph 1 */}
              <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-md">
                <LightHut className="text-white" /> is the exclusive promoter and distributor of premier architectural lighting designs, handcrafted crystal chandeliers, and designer luminaires. Our curated collections feature statement pendants, wall sconces, and exterior fixtures crafted for exceptional living spaces.
              </p>

              {/* Paragraph 2 */}
              <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-md">
                Our mission is to assist our clients through a premium bespoke service, tailored to their exact specifications, helping them create the perfect spatial ambiance with unique, luxurious, and innovative designer lighting.
              </p>

            </div>

            {/* ── COLUMN 2: QUICK LINKS (Span 2) ── */}
            <div className="lg:col-span-2 px-0 md:px-6 lg:px-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Quick Links
                </h4>
                <ul className="space-y-3.5 text-xs sm:text-[13px] text-neutral-400 font-light">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors duration-200 block">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors duration-200 block">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalog" className="hover:text-white transition-colors duration-200 block">
                      Collections & Brands
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalog" className="hover:text-white transition-colors duration-200 block">
                      Products Catalog
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="hover:text-white transition-colors duration-200 block">
                      Showcase Projects
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition-colors duration-200 block">
                      Contact Showroom
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/login" className="flex items-center gap-1.5 text-neutral-400 hover:text-[#DC2626] transition-colors duration-200">
                      <Shield className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Admin Portal</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* ── COLUMN 3: CONTACT & WORKS (Span 3) ── */}
            <div className="lg:col-span-3 px-0 md:px-6 lg:px-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Contact & Works
                </h4>
                <div className="space-y-4 text-xs sm:text-[13px] text-neutral-400 font-light">
                  
                  {/* Showroom Address with Google Maps Link */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                      Showroom Address:
                    </span>
                    <a
                      href={settings?.mapUrl || 'https://www.google.com/maps/place//@28.6394399,77.0974272,17.01z/data=!4m6!1m5!3m4!2zMjjCsDM4JzIyLjAiTiA3N8KwMDYnMDAuMCJF!8m2!3d28.6394482!4d77.1000061?hl=en'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-neutral-300 hover:text-white transition-colors group/addr"
                      title="Open Showroom in Google Maps"
                    >
                      <MapPin className="w-4 h-4 text-[#DC2626] group-hover/addr:scale-110 transition-transform shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="block text-white font-bold text-xs group-hover/addr:text-red-300 transition-colors font-calibri tracking-wide">
                          M/S <LightHut className="text-white" /> DECORATIVE SOLUTIONS
                        </strong>
                        <span className="text-neutral-300">4B/27, Upper floor, Opp Govt School Gate no-02</span>
                        <br />
                        <span className="text-neutral-300">Devki Nandan road, Lighting market</span>
                        <br />
                        <span className="text-neutral-300">Tilak Nagar, New Delhi - 110018</span>
                        <span className="block text-[11px] text-[#DC2626] font-medium mt-1">
                          View Showroom on Google Maps ↗
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* Works Address */}
                  <div className="pt-3 border-t border-neutral-800/80 space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                      Works Address:
                    </span>
                    <a
                      href={settings?.worksMapUrl || 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-neutral-300 hover:text-white transition-colors group/addr"
                      title="Open Works in Google Maps"
                    >
                      <MapPin className="w-4 h-4 text-neutral-500 group-hover/addr:text-[#DC2626] transition-colors shrink-0 mt-0.5" />
                      <div className="leading-relaxed text-xs">
                        <span className="text-neutral-300">C37/4, Lawrence Road, Industrial Area</span>
                        <br />
                        <span className="text-neutral-300">New Delhi - 110035</span>
                        <br />
                        <span className="text-neutral-400 text-[11px]">(Near Metro Station Kanhaiya Nagar)</span>
                        <span className="block text-[11px] text-neutral-400 hover:text-[#DC2626] font-medium mt-1">
                          View Works on Google Maps ↗
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* Official Email */}
                  <a
                    href="mailto:lighthutdecorativedlh@gmail.com"
                    className="flex items-center gap-3 hover:text-white transition-colors group pt-2 border-t border-neutral-800"
                  >
                    <Mail className="w-4 h-4 text-[#8C6D4F] group-hover:text-amber-300 transition-colors shrink-0" />
                    <span className="truncate">lighthutdecorativedlh@gmail.com</span>
                  </a>

                </div>
              </div>
            </div>

            {/* ── COLUMN 4: SOCIAL MEDIA (Span 2) ── */}
            <div className="lg:col-span-2 pl-0 md:pl-6 lg:pl-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Social media
                </h4>
                
                {/* Rounded Icon Circles */}
                <div className="flex items-center gap-3">
                  <a
                    href={settings?.socialLinks?.facebook || 'https://www.facebook.com/profile.php?id=61584975975926'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white hover:border-[#8C6D4F] flex items-center justify-center transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>

                  <a
                    href={settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white hover:border-[#8C6D4F] flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>

                  <a
                    href={settings?.socialLinks?.youtube || 'https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-[#FF0000] hover:border-[#FF0000] text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          3. SUB-FOOTER BOTTOM BAR: HIGH VISIBILITY ADMIN & COPYRIGHT
      ════════════════════════════════════════════════════════ */}
      <div className="bg-[#090A0D] text-neutral-400 py-4 px-4 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] font-medium tracking-wide">
          
          <div className="text-neutral-400 text-center sm:text-left font-calibri">
            © 2026 M/S <LightHut className="text-neutral-200" /> Decorative Solutions. All Rights Reserved.
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181B22] hover:bg-[#DC2626] border border-white/20 hover:border-[#DC2626] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-md group"
              title="Access LightHut Admin Management Panel"
            >
              <Shield className="w-4 h-4 text-[#DC2626] group-hover:text-white transition-colors" />
              <span>Admin Panel</span>
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
};
