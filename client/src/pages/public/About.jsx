import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Building2,
  Compass,
  Hammer,
  Eye,
  Truck,
  Mail,
  HelpCircle,
  FileCheck2,
  FileText,
  Download,
  ExternalLink,
  X,
  Factory,
  Handshake,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { LightHut } from '../../components/common/BrandWordmark';

export const About = () => {
  const { settings } = useSettings();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeProjectImg, setActiveProjectImg] = useState(0);
  const [certModal, setCertModal] = useState(null);

  const tradeProjectImages = [
    {
      url: '/hero-double-height.jpg',
      title: 'Grand Duplex Atrium',
      sub: 'Custom 16-foot spiral crystal cascade',
      badge: 'Duplex Atrium',
    },
    {
      url: '/hero-chandelier.jpg',
      title: 'Royal Palace Residence',
      sub: 'Imperial 24K gold tiered crystal chandelier',
      badge: 'Heritage Villa',
    },
    {
      url: '/hero-pendant.jpg',
      title: 'Penthouse Dining Room',
      sub: 'Mouth-blown organic glass pendant cluster',
      badge: 'Modern Dining',
    },
    {
      url: '/hero-wall-lamp.jpg',
      title: 'Acoustic Lounge Wall',
      sub: 'Bi-directional solid brass sconces',
      badge: 'Wall Lighting',
    },
  ];

  useEffect(() => {
    document.title = `About Us, Heritage & Craftsmanship | ${settings.companyName || 'Lighting Studio'}`;
  }, [settings.companyName]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const craftsmanshipPillars = [
    {
      icon: <Factory className="w-6 h-6 text-[#DC2626]" />,
      title: 'In-House Manufacturing Excellence',
      subtitle: 'State-of-the-Art Infrastructure',
      description:
        'We take pride in possessing state-of-the-art manufacturing facilities, which enable us to develop innovative products while maintaining high quality. This infrastructure also allows us to ensure timely delivery to our customers, as we believe that customer satisfaction is the key to our success.',
      specs: 'Advanced Facilities • Innovative Design • On-Time Delivery',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#DC2626]" />,
      title: 'Quality Ensuring',
      subtitle: 'BIS-Approved Standards',
      description:
        'All our products are BIS-approved in accordance with Government of India standards. This instills confidence and guarantees that our products are of excellent quality and long life.',
      specs: 'BIS Certified • Govt. of India Compliant • Guaranteed Long Life',
    },
    {
      icon: <Award className="w-6 h-6 text-[#DC2626]" />,
      title: 'Our Strength / Why Customers Choose Us...',
      subtitle: 'Zero Compromise on Quality',
      description:
        'We sell only quality products and do not compromise on quality for any reason. We value our customers’ money.',
      specs: 'Strict Quality Control • Uncompromising Standards • True Value',
    },
    {
      icon: <Handshake className="w-6 h-6 text-[#DC2626]" />,
      title: 'Our Belief and Policy',
      subtitle: 'Quality Consistency & Fair Terms',
      description:
        'Rate negotiations are acceptable as long as quality consistency is maintained.',
      specs: 'Transparent Pricing • Quality Consistency • Enduring Relationships',
    },
  ];

  const qualitySteps = [
    {
      step: '01',
      title: 'Highest Standard Material Testing',
      description:
        'The ingredients and materials that make up every product are tested to the highest industry standards for purity and resilience.',
    },
    {
      step: '02',
      title: 'Premium LEDs & Drivers',
      description:
        "Only good quality LED lights and drivers are used, so you don't have to face the hassle of frequent replacements.",
    },
    {
      step: '03',
      title: 'Expert Designer Aesthetics',
      description:
        'The design of each product is created by skilled designers to enhance the beauty of your home and rooms with an amazing feeling.',
    },
    {
      step: '04',
      title: 'Durable Quality Plating',
      description:
        'Only the best quality plating and surface treatments are used to maintain superior durability and long-lasting lustre.',
    },
    {
      step: '05',
      title: 'Priority After-Sales Service',
      description:
        'After sales, providing comprehensive service to our customers and resolving their problems promptly is our first priority.',
    },
  ];

  const faqs = [
    {
      q: 'How do I choose the right chandelier size for my double-height ceiling or living room?',
      a: 'A proven architectural rule of thumb is: Room Width (ft) + Room Length (ft) = Chandelier Diameter in inches. For example, a 16ft × 20ft living room ideally suits a 36-inch diameter luminaire. For double-height ceilings (18ft to 24ft+), we recommend multi-tiered or cascading drops that fill the vertical volume while keeping the bottom of the chandelier at least 8 to 9 feet above floor level. Our team provides complimentary scale consultations via our design desk.',
    },
    {
      q: 'Are your chandeliers and hanging lights dimmable with home automation?',
      a: 'Yes. Most of our LED luminaires and pendant collections are engineered with dimmable constant-current drivers compatible with Triac wall dimmers, 0-10V systems, and smart home automation protocols including DALI-2, Lutron, and KNX. Please specify your automation system when ordering so we configure the matching driver.',
    },
    {
      q: 'How do you guarantee safe delivery of delicate crystals and glass across India?',
      a: 'We ship nationwide using a specialized triple-layer packaging protocol: each crystal and glass shade is individually nested in precision-cut high-density EPE foam, packed inside heavy-duty corrugated cartons, and encased in a shock-absorbing reinforced wooden crate. Every shipment is 100% insured—if any component is damaged in transit, we dispatch a replacement part immediately at zero charge.',
    },
    {
      q: 'Can wire drops and suspension rods be customized for specific ceiling heights?',
      a: 'Absolutely. Every home and villa is unique. We provide custom suspension wire lengths (up to 10 meters) and segmented metal extension rods upon request. Simply provide your floor-to-ceiling height during consultation, and we will tailor the drop to perfection.',
    },
    {
      q: 'Are your outdoor and gate lights rust-proof in heavy coastal or monsoon climates?',
      a: 'Yes. Our outdoor luminaires are cast from marine-grade die-cast aluminum with multi-layer thermoset powder coating and silicone weather-gaskets rated IP65/IP66. They are chemically resistant to saline air, UV degradation, and heavy monsoon rains.',
    },
    {
      q: 'Do you offer replacement bulbs, extra crystals, and spare drivers?',
      a: 'Yes. We maintain a dedicated inventory of replacement optical crystals, spare drivers, vintage warm filament LED bulbs, and mounting hardware for all current and legacy collections. You can order spares directly through our catalog or concierge team.',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen text-neutral-900">
      {/* ── HEADER BANNER ── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-neutral-800 overflow-hidden bg-neutral-900">
        {/* Architectural Workshop & Showroom Background — Ultra Bright & High Definition */}
        <div className="absolute inset-0 z-0">
          <img
            src="/showroom-hero-hd.jpg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/categories/chandelier.jpg';
            }}
            alt="Heritage & Architectural Vision - LightHut Flagship Showroom"
            loading="eager"
            className="w-full h-full object-cover object-center brightness-110 contrast-105"
          />
          {/* Subtle directional scrim to preserve natural light while enabling crisp reading */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl bg-neutral-950/60 backdrop-blur-md p-6 sm:p-9 rounded-3xl border border-white/20 shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-luxury shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Heritage & Architectural Vision</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-tight">
              Illuminating India's Finest Homes With Artistry & Warmth
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
              For over a decade, we have dedicated ourselves to the mastery of light. We blend timeless craftsmanship, pure metals, hand-cut optical crystals, and flicker-free circadian LEDs to transform living spaces into sanctuaries of luxury and comfort.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: THE STORY & VALUES ── */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xl aspect-[4/3] bg-neutral-100 group">
              <img
                src="/craft-main.jpg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt="Master Artisan Crafting Chandelier"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-3 sm:bottom-6 sm:right-6 bg-white/95 border border-neutral-200 rounded-2xl p-5 shadow-xl backdrop-blur-md max-w-[260px]">
              <div className="flex items-center gap-2.5 mb-1">
                <Award className="w-5 h-5 text-[#DC2626]" />
                <span className="font-serif-luxury text-2xl font-bold text-neutral-900">10,000+</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Penthouses, villas, and boutique spaces illuminated PAN India.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-2">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 leading-snug">
                Lighting is Not Merely Utility; It is the Soul of an Interior
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              LIGHT-HUT Decorative Solutions is a professional brand specializing in commercial and fancy decorative lighting, capable of providing high quality lighting products of all types. Although the company was established in 2022, we bring over 12 years of experience in the lighting industry.
            </p>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              We have an excellent team dedicated to product design and quality assurance, and all our products are manufactured under the supervision of experts. We consistently strive to offer our customers top quality products featuring the latest designs at highly affordable rates.
            </p>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-200">
              <div>
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#DC2626] block">1000+</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">Fixtures in Catalog</span>
              </div>
              <div>
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#DC2626] block">100%</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">Insured Safe Transit</span>
              </div>
              <div>
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#DC2626] block">Ra &gt; 95</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">High Color Fidelity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 4 PILLARS OF CRAFTSMANSHIP ── */}
      <section className="py-20 bg-[#f8fafc] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
              The 4 Pillars of Our Craftsmanship
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              From state-of-the-art in-house manufacturing to BIS-approved quality assurance and customer-first policies, discover what sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {craftsmanshipPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#DC2626] hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">
                      {pillar.title}
                    </h3>
                    <span className="text-xs text-[#DC2626] font-medium tracking-wide">
                      {pillar.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>{pillar.specs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: 5-STEP QUALITY & ZERO-BREAKAGE CRATING LIFECYCLE ── */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
            Quality Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
            Our 5-Point Quality & Service Standards
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-normal">
            From tested materials and expert design to durable plating and dedicated after-sales service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {qualitySteps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative flex flex-col justify-between hover:border-[#DC2626]/50 transition-colors"
            >
              <div>
                <span className="font-mono text-3xl font-bold text-red-600/30 block mb-3">
                  {s.step}
                </span>
                <h3 className="font-serif-luxury text-base font-bold text-neutral-900 mb-2 leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {s.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1 text-[10.5px] font-semibold text-[#DC2626]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: ARCHITECT & DESIGNER TRADE PROGRAM (2-Column With Project Installation Image) ── */}
      <section className="py-12 sm:py-16 bg-neutral-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden my-10 border border-neutral-800 shadow-2xl">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Trade Program Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Architect & Interior Designer Trade Partnership</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight">
              Partner With Us For Your Luxury Projects
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              We collaborate closely with leading interior designers, architects, and builders across India. From providing 3D CAD/IES lighting files to custom ceiling drop calculations and tiered volume pricing, our dedicated trade desk ensures seamless specification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 transition-colors">
                <FileCheck2 className="w-5 h-5 text-red-400 mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Photometric & CAD</h4>
                <p className="text-[11px] text-neutral-400 mt-1">IES lighting files & high-res models for 3D renderings.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 transition-colors">
                <Compass className="w-5 h-5 text-red-400 mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Custom Scaling</h4>
                <p className="text-[11px] text-neutral-400 mt-1">Bespoke wire drops, canopy plates, and finish swatches.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 transition-colors">
                <Truck className="w-5 h-5 text-red-400 mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Priority Site Crating</h4>
                <p className="text-[11px] text-neutral-400 mt-1">Staggered delivery matched to your project handover timeline.</p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2 shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>Connect With Trade Desk</span>
              </Link>
              <Link
                to="/projects"
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-white text-xs font-bold uppercase tracking-luxury text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Installed Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Architectural Project Showcase With Multiple Project Images */}
          <div className="lg:col-span-5 space-y-3">
            {/* Main Featured Project Image */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/3] bg-neutral-900 group relative">
              <img
                src={tradeProjectImages[activeProjectImg].url}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt={tradeProjectImages[activeProjectImg].title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-wide">
                    {tradeProjectImages[activeProjectImg].title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-300">
                    {tradeProjectImages[activeProjectImg].sub}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#DC2626] font-bold text-white shrink-0">
                  {tradeProjectImages[activeProjectImg].badge}
                </span>
              </div>
            </div>

            {/* 4 Interactive Project Thumbnails */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {tradeProjectImages.map((proj, idx) => (
                <button
                  key={proj.title}
                  onClick={() => setActiveProjectImg(idx)}
                  className={`group relative rounded-xl overflow-hidden border aspect-[4/3] transition-all cursor-pointer ${
                    activeProjectImg === idx
                      ? 'border-[#DC2626] ring-2 ring-red-500/50 scale-[1.02]'
                      : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={proj.title}
                >
                  <img
                    src={proj.url}
                    alt={proj.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: OFFICIAL GOVERNMENT CERTIFICATES & COMPLIANCE ── */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
              Statutory Verification & Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
              Government Registrations & Official Certifications
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              M/S <LightHut /> DECORATIVE SOLUTIONS is a fully verified, legally registered enterprise certified by the Government of India for 100% statutory compliance, transparent B2B GST tax credit (ITC), and Ministry of MSME industrial recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* ── Certificate 1: GST Registration Certificate (Form GST REG-06) ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-neutral-200/90 hover:border-red-500/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-100/60 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shadow-2xs">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-luxury font-bold text-[#DC2626] block">
                        Government of India
                      </span>
                      <span className="text-xs font-semibold text-neutral-600 block">
                        Ministry of Finance • GST Portal
                      </span>
                    </div>
                  </div>
                  <span className="text-[10.5px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                    ● Verified & Active
                  </span>
                </div>

                <h3 className="text-2xl font-serif-luxury font-bold text-neutral-900 group-hover:text-[#DC2626] transition-colors mb-2">
                  GST Registration Certificate
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-5 font-normal">
                  Statutory registration under the Central Goods and Services Tax Act, 2017. Valid for seamless Input Tax Credit (ITC), B2B tax billing, and all commercial architectural tenders PAN India.
                </p>

                {/* Visual Document Parchment Preview */}
                <div
                  onClick={() =>
                    setCertModal({
                      title: 'GST Registration Certificate (Form GST REG-06)',
                      subtitle: 'Government of India • Ministry of Finance • Tax Identification',
                      url: '/LH GST CERTIFICATE.pdf',
                    })
                  }
                  className="rounded-2xl border border-neutral-300 bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 p-4 sm:p-5 mb-5 cursor-pointer relative group/doc hover:border-[#DC2626] hover:shadow-md transition-all"
                  title="Click to preview official GST PDF"
                >
                  <div className="flex items-start justify-between border-b border-neutral-200/80 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-6 h-6 text-[#DC2626]" />
                      <div>
                        <p className="text-xs font-serif-luxury font-bold text-neutral-900">
                          FORM GST REG-06
                        </p>
                        <p className="text-[10px] text-neutral-500">Government of India Registration Certificate</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      Official Seal
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">Legal Name:</span>
                      <span className="font-bold text-neutral-900 font-calibri text-right text-xs">
                        M/S <LightHut /> DECORATIVE SOLUTIONS
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">GSTIN / UIN:</span>
                      <span className="font-bold text-[#DC2626] tracking-wider text-sm bg-red-50 px-2 py-0.5 rounded border border-red-200/60">
                        07BSYPK8425N1ZP
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">Jurisdiction:</span>
                      <span className="font-medium text-neutral-700 font-sans text-right">
                        Delhi Ward / Industrial Zone 07
                      </span>
                    </div>
                  </div>

                  {/* Document Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      <span>Click To Preview PDF</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() =>
                    setCertModal({
                      title: 'GST Registration Certificate (Form GST REG-06)',
                      subtitle: 'Government of India • Ministry of Finance • Tax Identification',
                      url: '/LH GST CERTIFICATE.pdf',
                    })
                  }
                  className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-red-400" />
                  <span>Preview Certificate</span>
                </button>

                <a
                  href="/LH GST CERTIFICATE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-red-50 hover:bg-[#DC2626] text-[#DC2626] hover:text-white border border-red-200 hover:border-[#DC2626] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs hover:shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* ── Certificate 2: UDYAM MSME Registration Certificate ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-neutral-200/90 hover:border-amber-500/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-luxury font-bold text-amber-600 block">
                        Government of India
                      </span>
                      <span className="text-xs font-semibold text-neutral-600 block">
                        Ministry of Micro, Small & Medium Enterprises
                      </span>
                    </div>
                  </div>
                  <span className="text-[10.5px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs">
                    ● Recognized MSME
                  </span>
                </div>

                <h3 className="text-2xl font-serif-luxury font-bold text-neutral-900 group-hover:text-amber-600 transition-colors mb-2">
                  Udyam MSME Certificate
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-5 font-normal">
                  Officially accredited by the Ministry of MSME, Government of India, endorsing <LightHut /> domestic manufacturing, architectural lighting craftsmanship, and Make-in-India production excellence.
                </p>

                {/* Visual Document Parchment Preview */}
                <div
                  onClick={() =>
                    setCertModal({
                      title: 'Udyam Registration Certificate',
                      subtitle: 'Ministry of Micro, Small & Medium Enterprises, Government of India',
                      url: '/LIGHT HUT UDYAM CERTIFICATE.pdf',
                    })
                  }
                  className="rounded-2xl border border-neutral-300 bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 p-4 sm:p-5 mb-5 cursor-pointer relative group/doc hover:border-amber-500 hover:shadow-md transition-all"
                  title="Click to preview official Udyam MSME PDF"
                >
                  <div className="flex items-start justify-between border-b border-neutral-200/80 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="text-xs font-serif-luxury font-bold text-neutral-900">
                          UDYAM REGISTRATION
                        </p>
                        <p className="text-[10px] text-neutral-500">Ministry of MSME Enterprise Accreditation</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Make In India
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">Enterprise Name:</span>
                      <span className="font-bold text-neutral-900 font-calibri text-right text-xs">
                        <LightHut /> DECORATIVE SOLUTIONS
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">Type of Enterprise:</span>
                      <span className="font-bold text-amber-600 tracking-wider text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        Manufacturing / Lighting Solutions
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-sans">Accreditation:</span>
                      <span className="font-medium text-neutral-700 font-sans text-right">
                        Govt. Registered Luminaire Atelier
                      </span>
                    </div>
                  </div>

                  {/* Document Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Click To Preview PDF</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() =>
                    setCertModal({
                      title: 'Udyam Registration Certificate',
                      subtitle: 'Ministry of Micro, Small & Medium Enterprises, Government of India',
                      url: '/LIGHT HUT UDYAM CERTIFICATE.pdf',
                    })
                  }
                  className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Certificate</span>
                </button>

                <a
                  href="/LIGHT HUT UDYAM CERTIFICATE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs hover:shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE PDF PREVIEW MODAL ── */}
      <AnimatePresence>
        {certModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setCertModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-300"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/90 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif-luxury font-bold text-neutral-900">
                      {certModal.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-sans">
                      {certModal.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={certModal.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                  <button
                    onClick={() => setCertModal(null)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Native PDF Viewer Body */}
              <div className="flex-1 bg-neutral-100 p-2 sm:p-4 overflow-hidden">
                <iframe
                  src={certModal.url}
                  title={certModal.title}
                  className="w-full h-[68vh] rounded-2xl border border-neutral-300 shadow-inner bg-white"
                />
              </div>

              {/* Modal Footer Note */}
              <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-[11px] text-neutral-600 flex flex-wrap items-center justify-between gap-2 shrink-0 font-sans">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Statutory Certified Document • Government of India
                </span>
                <span className="text-neutral-700 font-calibri font-bold text-xs">
                  M/S <LightHut /> DECORATIVE SOLUTIONS
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECTION: ATELIER & SHOWROOM PHOTO GALLERY ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
            Craftsmanship in Focus
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
            Inside Our Lighting Atelier & Showroom
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-normal">
            Take a visual tour through our Delhi showroom, precision crystal setting ateliers, and bespoke luxury installations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/showroom-hero-hd.jpg"
              alt="LightHut Flagship Showroom Display"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Delhi Flagship</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">Showroom Gallery & Ateliers</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/hero-double-height.jpg"
              alt="Grand Duplex Atrium Chandelier"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Villa Residence</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">Double-Height Spiral Chandelier</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/hero-chandelier.jpg"
              alt="Royal Palace Imperial Chandelier"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Heritage Palace</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">24K Tiered Crystal Luminaire</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/hero-pendant.jpg"
              alt="Penthouse Dining Table Suspension"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Penthouse Collection</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">Artisan Glass Dining Pendant</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/craft-detail.jpg"
              alt="K9 Optical Crystal Setting"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Artisan Precision</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">K9 Crystal Hand-Beveling</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden border border-neutral-200 shadow-md aspect-[4/3] bg-neutral-100 relative">
            <img
              src="/hero-wall-lamp.jpg"
              alt="Architectural Acoustic Wall Sconce"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-red-400 text-[10px] uppercase tracking-luxury font-bold">Architectural Sconce</span>
              <span className="text-white text-sm font-serif-luxury font-bold drop-shadow">Bi-Directional Solid Brass Wall Lamp</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-20 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-normal">
            Helpful answers to common inquiries regarding sizing, dimmers, transit protection, and installation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-luxury text-base font-bold text-neutral-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-red-50 text-[#DC2626]' : 'text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 6: DIRECT CONSULTATION CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#f8fafc] border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block">
              Personalized Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
              Need Expert Advice for Your Space?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
              Share your room dimensions, floor plan, or ceiling photos with our lighting specialists for complimentary luminaire recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/contact"
              className="btn-gold w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury text-center inline-flex items-center justify-center gap-2 shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Inquire With Specialists</span>
            </Link>
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 bg-white text-xs font-bold uppercase tracking-luxury text-center transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
