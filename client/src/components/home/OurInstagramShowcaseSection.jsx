import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ExternalLink, Play, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { LightHut } from '../common/BrandWordmark';

/* ── Light-Hut Instagram posts (client/public/instagram/posts) ──
   'reel' = 9:16 reel cover, 'post' = feed post. Feed posts are shown whole ('contain'). */
const INSTAGRAM_POSTS = [
  {
    id: 'insta-03',
    caption: 'Choose a chandelier that matches your space & style. ✨',
    image: '/instagram/posts/03-crystal-chandelier-living-room-choose-a-chandelier.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-04',
    caption: 'The power of lighting – crystal hanging lamps lining a warm corridor.',
    image: '/instagram/posts/04-crystal-hanging-lamps-corridor-power-of-lighting.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-05',
    caption: 'Elegant crystal design – a fan chandelier that cools and dazzles.',
    image: '/instagram/posts/05-crystal-fan-chandelier-elegant-crystal-design.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-06',
    caption: 'Interior styles that always look expensive, crowned by a floating LED ring chandelier.',
    image: '/instagram/posts/06-ring-led-chandelier-interior-styles-look-expensive.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-07',
    caption: 'A touch of brilliance for spaces that deserve to shine.',
    image: '/instagram/posts/07-crystal-chandelier-pink-glow-touch-of-brilliance.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-08',
    caption: 'Happy Krishna Janmashtami from the Light-Hut family. 🪈',
    image: '/instagram/posts/08-crystal-chandelier-happy-janmashtami.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-09',
    caption: 'Slim glass-and-gold wall lamps for a refined, modern wall.',
    image: '/instagram/posts/09-glass-wall-lamp-gold-collage.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-10',
    caption: 'Illuminate your space in style – the perfect blend of glamour, light & comfort.',
    image: '/instagram/posts/10-crystal-fan-chandelier-illuminate-your-space-in-style.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-11',
    caption: 'Sculpted white-and-gold leaf chandelier for statement ceilings.',
    image: '/instagram/posts/11-white-gold-leaf-chandelier.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-12',
    caption: 'This Raksha Bandhan, let Light-Hut be part of the moments that bring siblings closer. 🪔',
    image: '/instagram/posts/12-crystal-chandelier-raksha-bandhan.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-13',
    caption: 'Outdoor wall light – classic lanterns that welcome you home.',
    image: '/instagram/posts/13-outdoor-wall-light-lantern.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-14',
    caption: 'Feather-leaf chandelier, soft and sculptural.',
    image: '/instagram/posts/14-feather-leaf-chandelier-with-model.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-15',
    caption: 'Illuminate elegance – a feather-shaped LED wall lamp.',
    image: '/instagram/posts/15-feather-led-wall-lamp-illuminate-elegance.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-16',
    caption: 'Happy Independence Day – proud to be part of a brighter tomorrow. 🇮🇳',
    image: '/instagram/posts/16-grand-crystal-chandelier-happy-independence-day.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-17',
    caption: 'Globe gate lamp for modern pillars and gardens.',
    image: '/instagram/posts/17-outdoor-globe-gate-lamp-on-pillar.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-18',
    caption: 'Turn every ceiling into a statement – elegant crystal lighting for timeless interiors.',
    image: '/instagram/posts/18-amber-glass-chandelier-turn-every-ceiling-into-a-statement.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-19',
    caption: 'LH-920 GL outdoor gate lamp.',
    image: '/instagram/posts/19-lh-920-gl-outdoor-gate-lamp.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-20',
    caption: 'Illuminate every moment with a cascading crystal chandelier.',
    image: '/instagram/posts/20-crystal-chandelier-illuminate-every-moment.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-21',
    caption: 'Elegance that welcomes every entrance – classic outdoor wall lantern.',
    image: '/instagram/posts/21-outdoor-wall-lantern-elegance-that-welcomes-every-entrance.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-22',
    caption: 'Model Flora – illuminate every entrance with timeless style.',
    image: '/instagram/posts/22-flora-outdoor-gate-lamp-illuminate-every-entrance.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-23',
    caption: 'Crafted to shine, designed to captivate.',
    image: '/instagram/posts/23-leaf-chandelier-crafted-to-shine.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-24',
    caption: 'Luxury that lights the room.',
    image: '/instagram/posts/24-leaf-chandelier-luxury-that-lights-the-room.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-25',
    caption: 'A grand crystal chandelier for double-height living rooms.',
    image: '/instagram/posts/25-grand-crystal-chandelier-living-room.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-26',
    caption: 'Not every light is meant to blend in.',
    image: '/instagram/posts/26-double-height-crystal-cascade-chandelier-not-every-light-blends-in.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-27',
    caption: 'Transform your space with premium lighting – glass pendants over the dining table.',
    image: '/instagram/posts/27-glass-pendant-lights-dining-premium-lighting.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-28',
    caption: 'Designed to illuminate beautiful spaces.',
    image: '/instagram/posts/28-dining-chandelier-designed-to-illuminate-beautiful-spaces.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-29',
    caption: 'Lighting that speaks luxury.',
    image: '/instagram/posts/29-crystal-glass-wall-lamp-lighting-that-speaks-luxury.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-30',
    caption: 'The right lighting can completely transform how a room feels.',
    image: '/instagram/posts/30-spiral-ring-led-chandelier-staircase.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-31',
    caption: 'A statement piece for modern interiors.',
    image: '/instagram/posts/31-gold-curve-wall-lamp-statement-piece-for-modern-interiors.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-32',
    caption: 'The secret behind beautiful interiors.',
    image: '/instagram/posts/32-glass-pendant-cluster-secret-behind-beautiful-interiors.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-33',
    caption: 'Glow with elegance – premium quality, modern design, soft & warm glow.',
    image: '/instagram/posts/33-gold-wall-lamp-glow-with-elegance.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-34',
    caption: 'A gold bird wall lamp – art that lights up.',
    image: '/instagram/posts/34-gold-bird-wall-lamp.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-35',
    caption: 'Warm light, beautiful nights – glow with elegance.',
    image: '/instagram/posts/35-gold-ring-wall-lamp-glow-with-elegance-features.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-36',
    caption: 'Crafted to elevate every space – our wall lamp collection.',
    image: '/instagram/posts/36-wall-lamp-collection-crafted-to-elevate-every-space.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-37',
    caption: 'Warm light, beautiful nights.',
    image: '/instagram/posts/37-acrylic-led-wall-lamp-warm-light-beautiful-nights.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-38',
    caption: 'Soft light, safer steps – LED step lights with a 2-year warranty.',
    image: '/instagram/posts/38-led-step-light-soft-light-safer-steps.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-39',
    caption: 'Timeless comfort – wall lights that add warmth, charm & a timeless glow.',
    image: '/instagram/posts/39-glass-wall-lamp-timeless-comfort.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-40',
    caption: 'Illuminate every corner with elegance.',
    image: '/instagram/posts/40-antique-wall-lamp-collection-illuminate-every-corner.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-41',
    caption: 'Lights that bring warmth and elevate every moment.',
    image: '/instagram/posts/41-wall-lamp-collection-lights-that-bring-warmth.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-42',
    caption: 'Lighting that transforms every moment – modern geometric pendants.',
    image: '/instagram/posts/42-geometric-pendant-lights-lighting-that-transforms-every-moment.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-43',
    caption: 'Lighting that elevates your everyday.',
    image: '/instagram/posts/43-pendant-lights-lighting-that-elevates-your-everyday.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-44',
    caption: 'Lighting that elevates every moment – our pendant light collection.',
    image: '/instagram/posts/44-pendant-lights-lighting-that-elevates-every-moment.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-45',
    caption: 'Light that transforms every space.',
    image: '/instagram/posts/45-pendant-light-collection-transforms-every-space.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-46',
    caption: 'Decorative lights – trendy looks, timeless feels. Discover your new favourites today.',
    image: '/instagram/posts/46-decorative-lights-contact-us-banner.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-47',
    caption: 'Chandeliers and wall lamps from our collection.',
    image: '/instagram/posts/47-chandelier-and-wall-lamp-collage.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-48',
    caption: 'Classic wall lamp collection – model LH-155WL.',
    image: '/instagram/posts/48-lh-155wl-classic-wall-lamp-collection-banner.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-49',
    caption: 'Exclusive design of wall lamp.',
    image: '/instagram/posts/49-led-wall-lamp-exclusive-design.jpg',
    type: 'reel',
    fit: 'cover',
  },
  {
    id: 'insta-50',
    caption: '24V SMPS series – high quality and good performance.',
    image: '/instagram/posts/50-24v-smps-led-driver-series.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-51',
    caption: 'Foto LED picture light for mirrors and artwork.',
    image: '/instagram/posts/51-foto-led-picture-mirror-light.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-52',
    caption: 'Magic Series – rimless illumination for every space.',
    image: '/instagram/posts/52-magic-series-rimless-led-panel-light.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-53',
    caption: 'Gold deer-antler linear wall lamp.',
    image: '/instagram/posts/53-gold-deer-antler-linear-wall-lamp.jpg',
    type: 'post',
    fit: 'contain',
  },
  {
    id: 'insta-54',
    caption: 'Warm festive wishes from Light-Hut. 🔥',
    image: '/instagram/posts/54-happy-lohri-festival-greeting.jpg',
    type: 'reel',
    fit: 'cover',
  },
];

const INSTAGRAM_POSTS_ROW1 = INSTAGRAM_POSTS.slice(0, 26);
const INSTAGRAM_POSTS_ROW2 = INSTAGRAM_POSTS.slice(26);

const InstagramImage = ({ post }) =>
  post.fit === 'contain' ? (
    <>
      <img
        src={post.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-75"
        loading="lazy"
      />
      <img
        src={post.image}
        alt={post.caption}
        className="relative w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      />
    </>
  ) : (
    <img
      src={post.image}
      alt={post.caption}
      className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
      loading="lazy"
    />
  );

export const OurInstagramShowcaseSection = () => {
  const { settings } = useSettings();
  const [selectedPost, setSelectedPost] = useState(null);

  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/';

  const renderCard = (post, keyPrefix, idx) => (
    <div
      key={`${keyPrefix}-${post.id}-${idx}`}
      onClick={() => setSelectedPost(post)}
      className="group relative w-[160px] sm:w-[210px] md:w-[245px] aspect-[9/15] rounded-sm sm:rounded-md overflow-hidden bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-2xl cursor-pointer transition-all duration-500 shrink-0 border border-neutral-300/80 hover:-translate-y-1.5"
    >
      <InstagramImage post={post} />

      {/* Top Instagram badge */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium border border-white/10">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[1px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Instagram className="w-2.5 h-2.5 text-rose-600" />
            </div>
          </div>
          <LightHut className="text-white text-[10px]" />
        </div>

        {post.type === 'reel' && (
          <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center border border-white/10">
            <Play className="w-2.5 h-2.5 fill-white" />
          </div>
        )}
      </div>

      {/* Bottom subtle permanent gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

      {/* Interactive Hover Reveal with Instagram Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
        <p className="text-white/95 text-[11px] sm:text-xs leading-relaxed line-clamp-3 mb-3">
          {post.caption}
        </p>

        <div className="flex items-center justify-end text-white/90 text-xs pt-2 border-t border-white/20">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1">
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50 text-neutral-900 border-b border-neutral-200/80 overflow-hidden select-none">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* ── Section Header with Instagram Branding ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight whitespace-nowrap">
                Our Instagram
              </h2>
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
              Follow <span className="font-semibold text-neutral-900">@lighthutdecorativesolutions</span> for daily interior inspiration, behind-the-scenes lighting craft, and real-time installation reels.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-rose-500/25 transition-all hover:scale-105"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @lighthutdecorativesolutions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Continuous Dual-Row Instagram Feed Marquee ── */}
      <style>{`
        @keyframes marqueeL2R {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes marqueeR2L {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .lh-marquee-l2r {
          display: flex !important;
          flex-shrink: 0 !important;
          width: max-content !important;
          will-change: transform;
          animation: marqueeL2R 50s linear infinite !important;
        }
        .lh-marquee-r2l {
          display: flex !important;
          flex-shrink: 0 !important;
          width: max-content !important;
          will-change: transform;
          animation: marqueeR2L 50s linear infinite !important;
        }
      `}</style>

      <div className="marquee-container space-y-3 sm:space-y-4 relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none" />

        {/* Row 1: Continuous Seamless Scrolling Left to Right */}
        <div className="overflow-hidden w-full flex">
          <div
            className="lh-marquee-l2r flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4"
            style={{ animationPlayState: selectedPost ? 'paused' : 'running' }}
          >
            {INSTAGRAM_POSTS_ROW1.map((post, idx) => renderCard(post, 'r1-a', idx))}
          </div>
          <div
            className="lh-marquee-l2r flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4"
            aria-hidden="true"
            style={{ animationPlayState: selectedPost ? 'paused' : 'running' }}
          >
            {INSTAGRAM_POSTS_ROW1.map((post, idx) => renderCard(post, 'r1-b', idx))}
          </div>
        </div>

        {/* Row 2: Continuous Seamless Scrolling Right to Left */}
        <div className="overflow-hidden w-full flex">
          <div
            className="lh-marquee-r2l flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4"
            style={{ animationPlayState: selectedPost ? 'paused' : 'running' }}
          >
            {INSTAGRAM_POSTS_ROW2.map((post, idx) => renderCard(post, 'r2-a', idx))}
          </div>
          <div
            className="lh-marquee-r2l flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4"
            aria-hidden="true"
            style={{ animationPlayState: selectedPost ? 'paused' : 'running' }}
          >
            {INSTAGRAM_POSTS_ROW2.map((post, idx) => renderCard(post, 'r2-b', idx))}
          </div>
        </div>
      </div>

      {/* ── Instagram Post Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-neutral-900 text-white rounded-lg overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[4/5] bg-black">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.caption}
                    className="w-full h-full object-contain object-center"
                  />
                </div>

                <div className="p-6 sm:p-7 flex flex-col justify-between bg-neutral-900 border-t md:border-t-0 md:border-l border-white/10">
                  <div>
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-rose-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">lighthutdecorativesolutions</div>
                        <div className="text-[11px] text-neutral-400">Architectural & Designer Lighting</div>
                      </div>
                    </div>

                    <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed mb-6">
                      {selectedPost.caption}
                    </p>

                  </div>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xs bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>View Post on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
