/* ─────────────────────────────────────────────────────────────
   Architectural Lighting - Master Product Catalog & Categories Data
   10 Core Architectural Categories & Subcategories
───────────────────────────────────────────────────────────── */

export const MASTER_CATEGORIES = [
  // ── 1. CHANDELIERS ─────────────────────────────────────────
  {
    _id: 'cat-chandelier',
    name: 'Chandeliers',
    slug: 'chandelier',
    categoryKey: 'chandelier',
    icon: '✨',
    tag: 'Grand Statements',
    description: 'Magnificent multi-tier chandeliers spanning LED, Italian Murano glass, architectural profiles, classic antique, and ceiling fan hybrids.',
    specs: 'K9 Crystal • Precision Metal • Up to 5m Drops',
    image: '/categories/chandelier.jpg',
    featuredFixture: 'LH-CH101 Multi-Tier Ring Chandelier',
    productsCount: 9,
    total: 9,
    subcategories: [
      { name: 'LED Chandelier', slug: 'led-chandelier', count: 2, image: '/categories/chandelier.jpg' },
      { name: 'E14 Chandelier', slug: 'e14-chandelier', count: 2, image: '/categories/e14-chandelier.jpg' },
      { name: 'Profile Chandelier', slug: 'profile-chandelier', count: 2, image: '/categories/profile-chandelier.jpg' },
      { name: 'Glass Chandelier', slug: 'glass-chandelier', count: 2, image: '/categories/glass-chandelier.jpg' },
      { name: 'Italian Chandelier', slug: 'italian-chandelier', count: 2, image: '/categories/italian-chandelier.jpg' },
      { name: 'Modern Chandelier', slug: 'modern-chandelier', count: 2, image: '/categories/modern-chandelier.jpg' },
      { name: 'Antic Chandelier', slug: 'antic-chandelier', count: 2, image: '/categories/antic-chandelier.jpg' },
      { name: 'Fan Chandelier', slug: 'fan-chandelier', count: 2, image: '/categories/fan-chandelier.jpg' },
      { name: 'Celling Chandelier', slug: 'ceiling-chandelier', count: 2, image: '/categories/ceiling-chandelier.jpg' },
    ],
  },

  // ── 2. PENDANT LAMPS ────────────────────────────────────────
  {
    _id: 'cat-pendant-lamp',
    name: 'Pendant Lamps',
    slug: 'pendant-lamp',
    categoryKey: 'pendant',
    icon: '🔆',
    tag: 'Sculptural Suspensions',
    description: 'Suspended architectural lighting fixtures, mouth-blown fluted glass, and spun brass pendants for dining islands and reception spaces.',
    specs: 'LED & Classic • Dim-to-Warm • 1,200 - 3,400 lm',
    image: '/categories/pendant-lamp.jpg',
    featuredFixture: 'LH-842/1L-3L Led Hanging Lamp',
    productsCount: 87,
    total: 87,
    subcategories: [
      { name: 'LED Hanging Lamp', slug: 'led-hanging-lamp', count: 35, image: '/categories/led-hanging-lamp.jpg' },
      { name: 'Hanging Lamp', slug: 'classic-hanging-lamp', count: 52, image: '/categories/classic-hanging-lamp.jpg' },
      { name: 'LED Profile Pendant', slug: 'led-profile-pendant', count: 0, image: '/categories/profile-chandelier.jpg' },
    ],
  },

  // ── 3. WALL LAMPS ──────────────────────────────────────────
  {
    _id: 'cat-wall-lamp',
    name: 'Wall Lamps',
    slug: 'wall-lamp',
    categoryKey: 'wall',
    icon: '💡',
    tag: 'Architectural Sconces',
    description: 'Bi-directional wall grazers, fluted glass sconces, and indirect perimeter illumination for corridors, foyers, and bedside alcoves.',
    specs: 'LED & Classic • Ra > 95 • 3000K Warm • IP44 Rated',
    image: '/categories/wall-lamp.jpg',
    featuredFixture: 'LH-172W Led Wall Lamp',
    productsCount: 36,
    total: 36,
    subcategories: [
      { name: 'LED Wall Lamp', slug: 'led-wall-lamp', count: 25, image: '/categories/led-wall-lamp.jpg' },
      { name: 'Wall Lamp', slug: 'classic-wall-lamp', count: 11, image: '/categories/classic-wall-lamp.jpg' },
    ],
  },

  // ── 4. DOUBLE HEIGHT ──────────────────────────────────────
  {
    _id: 'cat-double-height',
    name: 'Double Height',
    slug: 'double-height',
    categoryKey: 'double-height',
    icon: '🏛️',
    tag: 'High-Ceiling Scale',
    description: 'Bespoke monumental cascade chandeliers and modern sculptural fixtures designed for 18ft+ double-height living rooms, stairwells, and grand foyers.',
    specs: 'Multi-Zone DALI Control • High Lumen • Heavy-Duty Suspension',
    image: '/categories/double-height.jpg',
    featuredFixture: 'LH-DH101 Grand Crystal Cascade',
    productsCount: 2,
    total: 2,
    subcategories: [
      { name: 'Crystal Chandelier', slug: 'crystal-chandelier', count: 1, image: '/categories/double-height.jpg' },
      { name: 'Modern Chandelier', slug: 'modern-chandelier-dh', count: 1, image: '/categories/modern-chandelier-dh.jpg' },
    ],
  },

  // ── 5. DINING TABLE LAMPS ──────────────────────────────────
  {
    _id: 'cat-dining-table-lamp',
    name: 'Dining Table Lamps',
    slug: 'dining-table-lamp',
    categoryKey: 'dining',
    icon: '🍽️',
    tag: 'Epicurean Warmth',
    description: 'Curated intimate dining luminaires, cordless rechargeable accent lamps, and low-profile warm illumination tailored for executive dining spaces.',
    specs: '2700K Warm Glow • Cordless Touch Dimming • High CRI > 95',
    image: '/categories/dining-table-lamp.jpg',
    featuredFixture: 'LH-DT101 Brushed Gold Dining Lamp',
    productsCount: 1,
    total: 1,
    subcategories: [],
  },

  // ── 6. OUTDOOR LIGHTS ──────────────────────────────────────
  {
    _id: 'cat-outdoor-light',
    name: 'Outdoor Lights',
    slug: 'outdoor-light',
    categoryKey: 'outdoor',
    icon: '🌿',
    tag: 'Weatherproof IP65',
    description: 'IP65-rated gate pillar lanterns and exterior wall grazers engineered with marine-grade aluminum to resist moisture, UV rays, and extreme weather.',
    specs: 'IP65 Rated • Die-Cast Aluminum • Weatherproof Glass',
    image: '/categories/outdoor-light.jpg',
    featuredFixture: 'LH-920 (Gate) Outdoor Gate Lamp',
    productsCount: 47,
    total: 47,
    subcategories: [
      { name: 'Gate Lamp', slug: 'gate-lamp', count: 25, image: '/categories/outdoor-light.jpg' },
      { name: 'Wall Lamp', slug: 'outdoor-wall-lamp', count: 22, image: '/hero-outdoor.jpg' },
      { name: 'Hanging Lamp', slug: 'outdoor-hanging-lamp', count: 0, image: '/categories/outdoor-light.jpg' },
    ],
  },

  // ── 7. TABLE LAMPS ─────────────────────────────────────────
  {
    _id: 'cat-table-lamp',
    name: 'Table Lamps',
    slug: 'table-lamp',
    categoryKey: 'table',
    icon: '🪔',
    tag: 'Sculptural Desks & Bedside',
    description: 'Designer bedside sconces, ceramic studio lamps, and solid brass task lights bringing focused reading light and atmospheric glow to bedside and console tables.',
    specs: 'Solid Brass & Ceramic • In-Line Dimmer • Fabric Cord',
    image: '/categories/table-lamp.jpg',
    featuredFixture: 'LH-TL101 Marble Base Mushroom Lamp',
    productsCount: 2,
    total: 2,
    subcategories: [],
  },

  // ── 8. FLOOR LAMPS ─────────────────────────────────────────
  {
    _id: 'cat-floor-lamp',
    name: 'Floor Lamps',
    slug: 'floor-lamp',
    categoryKey: 'floor',
    icon: '🕯️',
    tag: 'Freestanding Columns & Arcs',
    description: 'Statement arched floor lights, minimal vertical light bars, and mid-century tripod fixtures that define living room seating arrangements.',
    specs: 'Weighted Base • Foot Switch • Telescopic Height',
    image: '/categories/floor-lamp.jpg',
    featuredFixture: 'LH-FL101 Arched Brass Arc Floor Lamp',
    productsCount: 2,
    total: 2,
    subcategories: [],
  },

  // ── 9. LED FILAMENT BULBS ──────────────────────────────────
  {
    _id: 'cat-led-filament-bulb',
    name: 'LED Filament Bulbs',
    slug: 'led-filament-bulb',
    categoryKey: 'filament',
    icon: '💫',
    tag: 'Edison Heritage Glow',
    description: 'Vintage-style Amber and Golden tinted Edison LED filament bulbs with spiral and cross-pattern elements, offering antique warmth with 90% energy savings.',
    specs: 'Standard Screw Base • 2200K Amber Glow • 15,000h Lifespan',
    image: '/categories/led-filament-bulb.jpg',
    featuredFixture: 'LH-FB101 ST64 Amber Spiral Filament',
    productsCount: 3,
    total: 3,
    subcategories: [],
  },

  // ── 10. SPARE PARTS & DRIVERS ──────────────────────────────
  {
    _id: 'cat-spare-part',
    name: 'Spare Parts & Drivers',
    slug: 'spare-part',
    categoryKey: 'spares',
    icon: '🔧',
    tag: 'Hardware & Power Drivers',
    description: 'Heavy-duty multi-port hanging ceiling canopies, suspension wire kits, and precision constant-current LED replacement drivers for ongoing fixture maintenance.',
    specs: 'Universal Fit • 12V/24V/Constant Current • CE Certified',
    image: '/categories/spare-part.jpg',
    featuredFixture: 'LH-SP101 Multi-Port Ceiling Canopy Base',
    productsCount: 4,
    total: 4,
    subcategories: [
      { name: 'Hanging Base', slug: 'hanging-base', count: 2, image: '/categories/hanging-base.jpg' },
      { name: 'Spare Driver', slug: 'spare-driver', count: 2, image: '/categories/spare-driver.jpg' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Comprehensive Master Product Fixtures
───────────────────────────────────────────────────────────── */
export const MASTER_PRODUCTS = [
  // ── WALL LAMP: LED Wall Lamp ──
  {
    _id: 'prod-wl-101',
    name: 'LH-172W Led Wall Lamp',
    slug: 'lh-172w-led-wall-lamp',
    sku: 'LH-172W',
    category: 'wall-lamp',
    subcategory: 'led-wall-lamp',
    categoryName: 'Wall Lamp',
    shortDescription: 'Round mirror-black disc flanked by two fan-shaped crystal wings.',
    description: 'Round mirror-black disc flanked by two fan-shaped crystal wings. Iron / Crystal body in gun black finish with 3-in-1 colour-changing LED light.',
    price: 2050,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/led-wall-lamp/lh-172w-led-wall-lamp.jpg', alt: 'LH-172W Led Wall Lamp', isCover: true },
      { url: '/products/led-wall-lamp/lh-172w-led-wall-lamp-full.jpg', alt: 'LH-172W Led Wall Lamp installed view', isCover: false },
    ],
    specifications: {
      material: 'Iron / Crystal',
      finish: 'Gun Black',
      wattage: 'LED 3-in-1',
      colorTemperature: '3-in-1 (Warm / Natural / Cool White)',
      installationType: 'Wall Mounted',
    },
  },
  {
    _id: 'prod-wl-102',
    name: 'LH-169W Led Wall Lamp',
    slug: 'lh-169w-led-wall-lamp',
    sku: 'LH-169W',
    category: 'wall-lamp',
    subcategory: 'led-wall-lamp',
    categoryName: 'Wall Lamp',
    shortDescription: 'Black round core with sculpted crystal wings above and below.',
    description: 'Black round core with sculpted crystal wings above and below. Iron / Crystal body in gun black finish with 3-in-1 colour-changing LED light.',
    price: 2050,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/products/led-wall-lamp/lh-169w-led-wall-lamp.jpg', alt: 'LH-169W Led Wall Lamp', isCover: true },
      { url: '/products/led-wall-lamp/lh-169w-led-wall-lamp-full.jpg', alt: 'LH-169W Led Wall Lamp installed view', isCover: false },
    ],
    specifications: {
      material: 'Iron / Crystal',
      finish: 'Gun Black',
      wattage: 'LED 3-in-1',
      colorTemperature: '3-in-1 (Warm / Natural / Cool White)',
      installationType: 'Wall Mounted',
    },
  },

  // ── WALL LAMP: Wall Lamp ──
  {
    _id: 'prod-wl-201',
    name: 'LH-050W Modern Wall Lamp',
    slug: 'lh-050w-modern-wall-lamp',
    sku: 'LH-050W',
    category: 'wall-lamp',
    subcategory: 'classic-wall-lamp',
    categoryName: 'Wall Lamp',
    shortDescription: 'Slim gold rod sconce with a clear cylindrical glass shade.',
    description: 'Slim gold rod sconce with a clear cylindrical glass shade. Iron / Glass body in gold plating with one bulb holder.',
    price: 915,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/classic-wall-lamp/lh-050w-modern-wall-lamp.jpg', alt: 'LH-050W Modern Wall Lamp', isCover: true },
      { url: '/products/classic-wall-lamp/lh-050w-modern-wall-lamp-full.jpg', alt: 'LH-050W Modern Wall Lamp installed view', isCover: false },
    ],
    specifications: {
      dimensions: 'H440*W80mm',
      material: 'Iron / Glass',
      finish: 'Gold Plating',
      wattage: '1 Bulb Holder',
      installationType: 'Wall Mounted',
    },
  },

  // ── PENDANT LAMP: LED Hanging Lamp ──
  {
    _id: 'prod-pl-101',
    name: 'LH-8892-1L Led Crystal Hanging Lamp',
    slug: 'lh-8892-1l-led-crystal-hanging-lamp',
    sku: 'LH-8892-1L',
    category: 'pendant-lamp',
    subcategory: 'led-hanging-lamp',
    categoryName: 'Pendant Lamp',
    shortDescription: 'Textured crystal cube in a gold-plated frame that throws a sparkling pattern on nearby walls.',
    description: 'Textured crystal cube in a gold-plated frame that throws a sparkling pattern on nearby walls. Iron / Crystal body in gold plating with integrated LED light.',
    price: 3350,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/led-hanging-lamp/lh-8892-1l-led-crystal-hanging-lamp.jpg', alt: 'LH-8892-1L Led Crystal Hanging Lamp', isCover: true },
      { url: '/products/led-hanging-lamp/lh-8892-1l-led-crystal-hanging-lamp-full.jpg', alt: 'LH-8892-1L Led Crystal Hanging Lamp installed view', isCover: false },
    ],
    specifications: {
      dimensions: '225mm',
      material: 'Iron / Crystal',
      finish: 'Gold Plating',
      wattage: 'LED',
      installationType: 'Ceiling Hanging',
    },
  },

  // ── PENDANT LAMP: Hanging Lamp ──
  {
    _id: 'prod-pl-201',
    name: 'LH-26/1L-3L Metal Hanging Lamp',
    slug: 'lh-26-1l-3l-metal-hanging-lamp',
    sku: 'LH-26/1L-3L',
    category: 'pendant-lamp',
    subcategory: 'classic-hanging-lamp',
    categoryName: 'Pendant Lamp',
    shortDescription: 'Woven rope dome shades on a round black canopy.',
    description: 'Woven rope dome shades on a round black canopy. Iron / Rope body in natural rope finish with a bulb holder per light. Available as 1L (₹1,300) and 3L (₹3,855).',
    price: 1300,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/classic-hanging-lamp/lh-26-1l-3l-metal-hanging-lamp.jpg', alt: 'LH-26/1L-3L Metal Hanging Lamp', isCover: true },
      { url: '/products/classic-hanging-lamp/lh-26-1l-3l-metal-hanging-lamp-full.jpg', alt: 'LH-26/1L-3L Metal Hanging Lamp installed view', isCover: false },
    ],
    specifications: {
      dimensions: 'D200mm per lamp',
      material: 'Iron / Rope',
      finish: 'Natural Rope',
      installationType: 'Ceiling Hanging',
    },
  },

  // ── CHANDELIER: LED Chandelier ──
  {
    _id: 'prod-ch-101',
    name: 'LH-CH101 Multi-Tier Ring LED Chandelier',
    slug: 'lh-ch101-multi-tier-ring-led-chandelier',
    sku: 'LH-CH101',
    category: 'chandelier',
    subcategory: 'led-chandelier',
    categoryName: 'Chandelier',
    shortDescription: '3-Ring floating orbital LED chandelier with brushed champagne gold finish.',
    description: 'Three concentric circular rings suspended on ultra-fine stainless aircraft cables. Each ring features continuous internal silicone diffusers for seamless, 360-degree glare-free illumination.',
    price: 18999,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/chandelier.jpg', alt: 'LH-CH101 Orbital Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Rings: 800mm + 600mm + 400mm Dia',
      material: 'Aviation Aluminum & Optical Silicone',
      finish: 'Brushed Champagne Gold',
      wattage: '85W Integrated LED',
      voltage: 'AC 100-240V (Dimmable)',
      colorTemperature: '3000K / 4000K / 6000K Tri-Color',
      ipRating: 'IP20',
      installationType: 'Adjustable Cable Suspension',
      beamAngle: 'Omnidirectional Ring Glow',
      cri: 'Ra > 95',
      luminousFlux: '6800 Lumens',
    },
  },

  // ── CHANDELIER: E14 Chandelier ──
  {
    _id: 'prod-ch-201',
    name: 'LH-CH201 8-Arm E14 French Candelabra Chandelier',
    slug: 'lh-ch201-8-arm-e14-candelabra-chandelier',
    sku: 'LH-CH201',
    category: 'chandelier',
    subcategory: 'e14-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Classic 8-arm candelabra chandelier in antique brass with crystal bobeches.',
    description: 'Sweeping gracefully curved brass arms crowned by precision-cut crystal saucers. Compatible with E14 candle flame bulbs for a timeless palace aesthetic.',
    price: 14500,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/e14-chandelier.jpg', alt: 'LH-CH201 8-Arm E14 French Candelabra Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 750mm, Body Height: 620mm',
      material: 'Forged Brass & K9 Crystal',
      finish: 'Antique Hand-Rubbed Brass',
      wattage: '8 x E14 (Max 40W each)',
      voltage: 'AC 220-240V',
      colorTemperature: 'Warm Candelabra',
      ipRating: 'IP20',
      installationType: 'Ceiling Chain Suspension',
      beamAngle: '360° Ambient',
      cri: 'Bulb Dependent',
      luminousFlux: 'Approx 3200 Lumens',
    },
  },

  // ── CHANDELIER: Profile Chandelier ──
  {
    _id: 'prod-ch-301',
    name: 'LH-CH301 Linear Architectural Profile Chandelier',
    slug: 'lh-ch301-linear-profile-chandelier',
    sku: 'LH-CH301',
    category: 'chandelier',
    subcategory: 'profile-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Minimalist linear architectural profile fixture with dual-directional light.',
    description: 'Precision extruded matte black profile featuring downward task lighting and upward indirect ceiling wash. Perfect for boardroom tables and contemporary luxury dining.',
    price: 12800,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/profile-chandelier.jpg', alt: 'LH-CH301 Linear Architectural Profile Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Length: 1500mm, Width: 45mm, Height: 75mm',
      material: 'Extruded 6063 Aluminum',
      finish: 'Anodized Matte Jet Black',
      wattage: '48W Up/Down LED',
      voltage: 'AC 100-240V',
      colorTemperature: '3000K / 4000K Neutral',
      ipRating: 'IP20',
      installationType: 'Adjustable Aircraft Cable',
      beamAngle: '100° Down / 120° Up',
      cri: 'Ra > 95',
      luminousFlux: '4600 Lumens',
    },
  },

  // ── CHANDELIER: Glass Chandelier ──
  {
    _id: 'prod-ch-401',
    name: 'LH-CH401 Murano Cloud Glass Chandelier',
    slug: 'lh-ch401-murano-cloud-glass-chandelier',
    sku: 'LH-CH401',
    category: 'chandelier',
    subcategory: 'glass-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Cluster of 18 hand-blown frosted bubble glass spheres with warm ambient glow.',
    description: 'Organic clustered formation of frosted and clear glass globes suspended at staggered elevations. Creates a floating luminous cloud centerpiece.',
    price: 24500,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/glass-chandelier.jpg', alt: 'LH-CH401 Murano Cloud Glass Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Cluster Span: 900mm, Max Drop: 1800mm',
      material: 'Blown Borosilicate Glass & Brass',
      finish: 'Frosted Opal & Brushed Gold',
      wattage: '18 x G9 LED 4W (72W Total)',
      voltage: 'AC 220-240V',
      colorTemperature: '2700K Warm Gold',
      ipRating: 'IP20',
      installationType: 'Ceiling Rose Canopy',
      beamAngle: '360° Omnidirectional',
      cri: 'Ra > 92',
      luminousFlux: '5400 Lumens',
    },
  },

  // ── CHANDELIER: Italian Chandelier ──
  {
    _id: 'prod-ch-501',
    name: 'LH-CH501 Venetian Filigree Italian Chandelier',
    slug: 'lh-ch501-venetian-filigree-italian-chandelier',
    sku: 'LH-CH501',
    category: 'chandelier',
    subcategory: 'italian-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Authentic Italian style chandelier with hand-shaped crystal scrollwork.',
    description: 'Master artisan crafted Italian silhouette with intricate filigree arms, hanging crystal prisms, and amber glass flourishes.',
    price: 32000,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/italian-chandelier.jpg', alt: 'LH-CH501 Venetian Filigree Italian Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 880mm, Height: 780mm',
      material: 'Italian Crystal & Gilded Brass',
      finish: 'Venetian Gold & Clear Crystal',
      wattage: '12 x E14 LED 5W',
      voltage: 'AC 220-240V',
      colorTemperature: '2700K Warm White',
      ipRating: 'IP20',
      installationType: 'Heavy-Duty Ceiling Hook',
      beamAngle: '360° Prismatic Dispersion',
      cri: 'Ra > 97',
      luminousFlux: '6200 Lumens',
    },
  },

  // ── CHANDELIER: Modern Chandelier ──
  {
    _id: 'prod-ch-601',
    name: 'LH-CH601 Sputnik Brass Geometric Modern Chandelier',
    slug: 'lh-ch601-sputnik-brass-modern-chandelier',
    sku: 'LH-CH601',
    category: 'chandelier',
    subcategory: 'modern-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Mid-century modern radial sputnik chandelier with multi-directional brass rods.',
    description: 'Dynamic radial design that extends outward from a central orb with 12 intersecting arms tipped with exposed filament globes or frosted diffusers.',
    price: 11500,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/modern-chandelier.jpg', alt: 'LH-CH601 Sputnik Brass Geometric Modern Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 820mm, Drop: 600mm',
      material: 'Seamless Brass Alloy',
      finish: 'Electroplated Brushed Brass',
      wattage: '12 Lights (Max 48W)',
      voltage: 'AC 100-240V',
      colorTemperature: '3000K Warm',
      ipRating: 'IP20',
      installationType: 'Rod Ceiling Mount',
      beamAngle: '360° Radial Array',
      cri: 'Ra > 90',
      luminousFlux: '4200 Lumens',
    },
  },

  // ── CHANDELIER: Antic Chandelier ──
  {
    _id: 'prod-ch-701',
    name: 'LH-CH701 Heritage Wrought Iron Antic Chandelier',
    slug: 'lh-ch701-heritage-wrought-iron-antic-chandelier',
    sku: 'LH-CH701',
    category: 'chandelier',
    subcategory: 'antic-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Rustic antique black wrought iron chandelier with distressed brass candle cups.',
    description: 'Forged iron bands sculpted into an open armillary sphere, encasing a multi-tiered candelabra cluster for historical and industrial heritage estates.',
    price: 15800,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/antic-chandelier.jpg', alt: 'LH-CH701 Heritage Wrought Iron Antic Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 700mm, Height: 750mm',
      material: 'Hand-Forged Wrought Iron & Solid Brass',
      finish: 'Distressed Antique Bronze',
      wattage: '6 x E14 Candelabra',
      voltage: 'AC 220-240V',
      colorTemperature: '2200K - 2700K Warm',
      ipRating: 'IP20',
      installationType: 'Heavy Iron Link Chain',
      beamAngle: '360° Open Beam',
      cri: 'Ra > 90',
      luminousFlux: '2800 Lumens',
    },
  },

  // ── CHANDELIER: Fan Chandelier ──
  {
    _id: 'prod-ch-801',
    name: 'LH-CH801 Retractable Blade LED Fan Chandelier',
    slug: 'lh-ch801-retractable-blade-fan-chandelier',
    sku: 'LH-CH801',
    category: 'chandelier',
    subcategory: 'fan-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Fandelier with invisible retractable acrylic blades, crystal ring, and remote control.',
    description: 'Combines the cooling comfort of a whisper-quiet DC motor ceiling fan with the visual grandeur of a crystal LED chandelier. Blades automatically retract out of sight when fan is turned off.',
    price: 16999,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/fan-chandelier.jpg', alt: 'LH-CH801 Fan Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Open: 1060mm (42"), Closed: 500mm',
      material: 'Clear Acrylic Blades, K9 Crystal, Steel',
      finish: 'French Gold & Prismatic Crystal',
      wattage: 'LED 36W + DC Motor 35W',
      voltage: 'AC 220-240V 50Hz',
      colorTemperature: 'Tri-Color (3000K/4000K/6500K)',
      ipRating: 'IP20',
      installationType: 'Dual Downrod Mount',
      beamAngle: 'Downlight Graze + Crystal Halo',
      cri: 'Ra > 90',
      luminousFlux: '3200 Lumens',
    },
  },

  // ── CHANDELIER: Ceiling Chandelier ──
  {
    _id: 'prod-ch-901',
    name: 'LH-CH901 Flush Mount Crystal Ceiling Chandelier',
    slug: 'lh-ch901-flush-mount-crystal-ceiling-chandelier',
    sku: 'LH-CH901',
    category: 'chandelier',
    subcategory: 'ceiling-chandelier',
    categoryName: 'Chandelier',
    shortDescription: 'Low-profile flush ceiling chandelier for 9ft-10ft standard height ceilings.',
    description: 'Specifically engineered for apartments and standard-height ceilings where drop chains are impractical. Features dense tiers of cascading faceted crystal droplets.',
    price: 9999,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/ceiling-chandelier.jpg', alt: 'LH-CH901 Flush Mount Crystal Ceiling Chandelier', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 500mm, Total Depth: 220mm',
      material: 'Mirror Stainless Steel Base & K9 Crystal',
      finish: 'Mirror Chrome & Clear Crystal',
      wattage: '40W Integrated LED',
      voltage: 'AC 100-240V',
      colorTemperature: '3000K Warm White',
      ipRating: 'IP20',
      installationType: 'Direct Flush Ceiling Mount',
      beamAngle: 'Wide Downward Dispersion',
      cri: 'Ra > 92',
      luminousFlux: '3600 Lumens',
    },
  },

  // ── DOUBLE HEIGHT: Crystal Chandelier ──
  {
    _id: 'prod-dh-101',
    name: 'LH-DH101 Grand Crystal Cascade Double Height Chandelier',
    slug: 'lh-dh101-grand-crystal-cascade-double-height-chandelier',
    sku: 'LH-DH101',
    category: 'double-height',
    subcategory: 'crystal-chandelier',
    categoryName: 'Double Height',
    shortDescription: '10-Foot cascading helical crystal chandelier for double-height foyers and villas.',
    description: 'Dramatic multi-tier cascading spiral of over 1,200 precision cut K9 crystals engineered for 18ft+ vertical voids. Delivers a celestial prismatic spectacle from both upper balconies and ground level.',
    price: 48999,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/double-height.jpg', alt: 'LH-DH101 Grand Crystal', isCover: true },
    ],
    specifications: {
      dimensions: 'Base Diameter: 800mm, Suspension Drop: 3000mm (10 Feet)',
      material: 'High-Purity K9 Crystal & Heavy-Gauge Stainless Steel',
      finish: 'Mirror Polished Gold Canopy',
      wattage: '120W High-Lumen Integrated LED + GU10 Spot Emitters',
      voltage: 'AC 100-240V (Remote Dimmable)',
      colorTemperature: '3000K Warm Gold',
      ipRating: 'IP20',
      installationType: 'Reinforced Concrete Ceiling Anchor',
      beamAngle: 'Volumetric Downward Cascade',
      cri: 'Ra > 98',
      luminousFlux: '11,000 Lumens',
    },
  },

  // ── DOUBLE HEIGHT: Modern Chandelier ──
  {
    _id: 'prod-dh-201',
    name: 'LH-DH201 Modern Staggered Geometric Rings Double Height',
    slug: 'lh-dh201-modern-staggered-rings-double-height',
    sku: 'LH-DH201',
    category: 'double-height',
    subcategory: 'modern-chandelier-dh',
    categoryName: 'Double Height',
    shortDescription: '5-Ring architectural suspended chandelier with 4-meter adjustable drop cables.',
    description: 'Five monumental interlocking oval rings suspended on independent motorized or manual cables to create custom geometric silhouettes inside high-ceiling luxury atriums.',
    price: 42000,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/modern-chandelier-dh.jpg', alt: 'LH-DH201 Modern Staggered Geometric Rings Double Height', isCover: true },
    ],
    specifications: {
      dimensions: 'Largest Ring: 1200mm Dia, Drop: Up to 4000mm',
      material: 'Extruded Structural Aluminum & Optical Silicone',
      finish: 'Brushed Champagne Bronze',
      wattage: '140W Integrated Driver',
      voltage: 'AC 100-240V DALI / 0-10V Dimming',
      colorTemperature: '3000K Warm White',
      ipRating: 'IP20',
      installationType: 'Heavy-Duty Reinforced Suspension',
      beamAngle: 'Continuous 360° Ring Wash',
      cri: 'Ra > 95',
      luminousFlux: '12,500 Lumens',
    },
  },

  // ── 5. DINING TABLE LAMP ──
  {
    _id: 'prod-dt-101',
    name: 'LH-DT101 Brushed Gold Rechargeable Dining Table Lamp',
    slug: 'lh-dt101-brushed-gold-dining-table-lamp',
    sku: 'LH-DT101',
    category: 'dining-table-lamp',
    subcategory: '',
    categoryName: 'Dining Table Lamp',
    shortDescription: 'Cordless rechargeable tabletop lamp with touch step-dimming for dining spaces.',
    description: 'Designed to elevate dining ambiance without unsightly cables across the table. Solid aluminum stem with a downward anti-glare optical head casting warm illumination onto gourmet dishes.',
    price: 2499,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/dining-table-lamp.jpg', alt: 'LH-DT101 Dining Table Lamp', isCover: true },
    ],
    specifications: {
      dimensions: 'Base Dia: 100mm, Height: 350mm, Top Dia: 110mm',
      material: 'Machined Aluminum Alloy',
      finish: 'Electroplated Brushed Gold',
      wattage: '3.5W Warm LED (5200mAh Lithium Battery)',
      voltage: 'USB-C 5V Fast Charge (12-18 Hours Run Time)',
      colorTemperature: '2700K Warm Gold (Stepless Touch Dimming)',
      ipRating: 'IP54 Splashproof',
      installationType: 'Portable Freestanding',
      beamAngle: 'Downward Anti-Glare Conical Wash',
      cri: 'Ra > 96',
      luminousFlux: '320 Lumens',
    },
  },

  // ── 6. OUTDOOR LIGHT: Gate Lamp ──
  {
    _id: 'prod-od-101',
    name: 'LH-920 (Gate) Outdoor Gate Lamp',
    slug: 'lh-920-gate-outdoor-gate-lamp',
    sku: 'LH-920 (Gate)',
    category: 'outdoor-light',
    subcategory: 'gate-lamp',
    categoryName: 'Outdoor Light',
    shortDescription: 'Classic lantern with frosted glass panels, also available as a wall lamp.',
    description: 'Classic lantern with frosted glass panels, also available as a wall lamp. Aluminium / Glass body in black / coffee + antique brass finish with frosted glass and a bulb holder.',
    price: 3415,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/gate-lamp/lh-920-gate-outdoor-gate-lamp.jpg', alt: 'LH-920 (Gate) Outdoor Gate Lamp', isCover: true },
      { url: '/products/gate-lamp/lh-920-gate-outdoor-gate-lamp-full.jpg', alt: 'LH-920 (Gate) Outdoor Gate Lamp installed view', isCover: false },
    ],
    specifications: {
      dimensions: '400*200mm',
      material: 'Aluminium / Glass',
      finish: 'Black / Coffee + Antique Brass (Frosted glass)',
      installationType: 'Gate / Pillar Mounted',
    },
  },

  // ── 6. OUTDOOR LIGHT: Outdoor Wall Lamp ──
  {
    _id: 'prod-od-201',
    name: 'LH-920 (Wall) Outdoor Wall Lamp',
    slug: 'lh-920-wall-outdoor-wall-lamp',
    sku: 'LH-920 (Wall)',
    category: 'outdoor-light',
    subcategory: 'outdoor-wall-lamp',
    categoryName: 'Outdoor Light',
    shortDescription: 'Classic wall lantern with frosted glass panels, also available as a gate lamp.',
    description: 'Classic wall lantern with frosted glass panels, also available as a gate lamp. Aluminium / Glass body in black / coffee + antique brass finish with frosted glass and a bulb holder.',
    price: 3415,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/products/outdoor-wall-lamp/lh-920-wall-outdoor-wall-lamp.jpg', alt: 'LH-920 (Wall) Outdoor Wall Lamp', isCover: true },
      { url: '/products/outdoor-wall-lamp/lh-920-wall-outdoor-wall-lamp-full.jpg', alt: 'LH-920 (Wall) Outdoor Wall Lamp installed view', isCover: false },
    ],
    specifications: {
      dimensions: '400*200mm',
      material: 'Aluminium / Glass',
      finish: 'Black / Coffee + Antique Brass (Frosted glass)',
      installationType: 'Wall Mounted',
    },
  },

  // ── 7. TABLE LAMP ──
  {
    _id: 'prod-tl-101',
    name: 'LH-TL101 Marble Base Mushroom Table Lamp',
    slug: 'lh-tl101-marble-base-mushroom-table-lamp',
    sku: 'LH-TL101',
    category: 'table-lamp',
    subcategory: '',
    categoryName: 'Table Lamp',
    shortDescription: 'Italian Carrara marble base table lamp with spun brass domed reflector.',
    description: 'A striking sculptural centerpiece for nightstands, credenzas, and consoles. The white Carrara marble pedestal supports a solid spun brass dome that reflects indirect ambient warmth.',
    price: 4999,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/table-lamp.jpg', alt: 'LH-TL101 Marble Lamp', isCover: true },
    ],
    specifications: {
      dimensions: 'Dome Dia: 320mm, Height: 410mm, Base Dia: 140mm',
      material: 'Natural Carrara Marble & Spun Brass',
      finish: 'Honed Marble & Satin Brushed Brass',
      wattage: '2 x G9 LED 4W (Included)',
      voltage: 'AC 220-240V (Rotary Cord Dimmer)',
      colorTemperature: '2700K Warm Sunset Glow',
      ipRating: 'IP20',
      installationType: 'Tabletop Freestanding',
      beamAngle: 'Indirect Downward Mushroom Spread',
      cri: 'Ra > 95',
      luminousFlux: '700 Lumens',
    },
  },

  // ── 8. FLOOR LAMP ──
  {
    _id: 'prod-fl-101',
    name: 'LH-FL101 Arched Brass Arc Floor Lamp',
    slug: 'lh-fl101-arched-brass-floor-lamp',
    sku: 'LH-FL101',
    category: 'floor-lamp',
    subcategory: '',
    categoryName: 'Floor Lamp',
    shortDescription: 'Dramatic cantilevered arch floor lamp with heavy black marble counterweight.',
    description: 'Extending a graceful brass arc over corner sofas and reading armchairs. The heavy solid Nero Marquina marble counterweight ensures rock-solid stability while maintaining an airy profile.',
    price: 9800,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/floor-lamp.jpg', alt: 'LH-FL101 Arc Floor Lamp', isCover: true },
    ],
    specifications: {
      dimensions: 'Total Height: 2100mm, Arc Reach: 1800mm, Base: 400mm Dia',
      material: 'Solid Brass Tubing & Heavy Nero Marble',
      finish: 'Brushed Golden Brass & Polished Black Marble',
      wattage: 'Bulb Socket (Max 60W)',
      voltage: 'AC 220-240V (Foot Tap Switch on Braided Cable)',
      colorTemperature: 'Depends on Bulb',
      ipRating: 'IP20',
      installationType: 'Freestanding Floor Mount',
      beamAngle: 'Downlight Dome Wash',
      cri: 'Ra > 90',
      luminousFlux: '1100 Lumens',
    },
  },

  // ── 9. LED FILAMENT BULB ──
  {
    _id: 'prod-fb-101',
    name: 'LH-FB101 ST64 Vintage Amber Spiral LED Filament Bulb',
    slug: 'lh-fb101-st64-amber-spiral-filament-bulb',
    sku: 'LH-FB101',
    category: 'led-filament-bulb',
    subcategory: '',
    categoryName: 'LED Filament Bulb',
    shortDescription: 'Teardrop Edison bulb with flexible curved spiral LED filament and amber glass.',
    description: 'Recreates the nostalgic vintage carbon-filament glow of 19th-century Edison lamps while consuming only 4W. Fits standard pendant sockets and exposed-bulb chandeliers.',
    price: 499,
    isFeatured: true,
    isPublished: true,
    images: [
      { url: '/categories/led-filament-bulb.jpg', alt: 'LH-FB101 Filament Bulb', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 64mm, Length: 142mm',
      material: 'Amber Tinted Glass & Brass Base',
      finish: 'Vintage Amber Glass',
      wattage: '4W (Equivalent to 40W Incandescent)',
      voltage: 'AC 220-240V 50Hz (Smooth Dimmable)',
      colorTemperature: '2200K Golden Warm Glow',
      ipRating: 'IP20',
      installationType: 'Screw Base',
      beamAngle: '360° Omnidirectional',
      cri: 'Ra > 95',
      luminousFlux: '350 Lumens (15,000 Hours Lifespan)',
    },
  },

  // ── 10. SPARE PART: Hanging Base ──
  {
    _id: 'prod-sp-101',
    name: 'LH-SP101 Heavy-Duty Multi-Port Ceiling Canopy Hanging Base',
    slug: 'lh-sp101-multi-port-ceiling-canopy-hanging-base',
    sku: 'LH-SP101',
    category: 'spare-part',
    subcategory: 'hanging-base',
    categoryName: 'Spare Part',
    shortDescription: 'Reinforced 3-port / 5-port circular ceiling canopy base with strain relief grip.',
    description: 'Premium metal canopy rose engineered for multi-pendant cluster configurations. Internal reinforced bracket supports up to 25kg weight and includes brass strain relief cord grips.',
    price: 1299,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/hanging-base.jpg', alt: 'LH-SP101 Hanging Base', isCover: true },
    ],
    specifications: {
      dimensions: 'Diameter: 300mm, Depth: 35mm',
      material: 'Thick-Gauge Pressed Carbon Steel',
      finish: 'Matte Jet Black / Brushed Brass Options',
      wattage: 'Rated up to 250V 16A',
      voltage: 'Universal AC Compatible',
      colorTemperature: 'N/A Hardware',
      ipRating: 'IP20',
      installationType: 'Ceiling Junction Box Mount',
      beamAngle: 'Hardware Accessory',
      cri: 'N/A',
      luminousFlux: 'Supports 25kg fixture weight',
    },
  },

  // ── 10. SPARE PART: Spare Driver ──
  {
    _id: 'prod-sp-201',
    name: 'LH-SP201 Triac Dimmable Constant Current LED Driver 50W',
    slug: 'lh-sp201-triac-dimmable-led-driver-50w',
    sku: 'LH-SP201',
    category: 'spare-part',
    subcategory: 'spare-driver',
    categoryName: 'Spare Part',
    shortDescription: 'Flicker-free constant current replacement driver compatible with luxury lighting fixtures.',
    description: 'High-performance replacement driver with built-in short circuit, over-voltage, and thermal overload protection. Supports leading/trailing edge Triac dimmers with zero buzzing.',
    price: 1499,
    isFeatured: false,
    isPublished: true,
    images: [
      { url: '/categories/spare-driver.jpg', alt: 'LH-SP201 Spare Driver', isCover: true },
    ],
    specifications: {
      dimensions: '145mm x 48mm x 28mm',
      material: 'Flame-Retardant Polycarbonate Casing',
      finish: 'Matte Industrial Grey',
      wattage: '50W Max Output (700mA - 1200mA Adjustable)',
      voltage: 'Input: AC 200-240V, Output: DC 24-42V',
      colorTemperature: 'N/A Power Electronic',
      ipRating: 'IP20 Class II Double Insulated',
      installationType: 'In-Canopy / In-Cove Concealed',
      beamAngle: 'PF > 0.95 Flicker-Free',
      cri: 'N/A',
      luminousFlux: 'Efficiency > 88%',
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   Fallback Helper Queries (Matches Backend REST API contract)
───────────────────────────────────────────────────────────── */

export const getFallbackCategories = () => {
  return {
    success: true,
    categories: MASTER_CATEGORIES,
    count: MASTER_CATEGORIES.length,
  };
};

export const getFallbackCategoryBySlug = (slug) => {
  if (!slug) return { success: false, category: null };
  const target = slug.toLowerCase();

  // Try matching direct category slug
  let found = MASTER_CATEGORIES.find((c) => c.slug.toLowerCase() === target);

  // If not found, try matching subcategories
  if (!found) {
    for (const cat of MASTER_CATEGORIES) {
      if (cat.subcategories && cat.subcategories.some((s) => s.slug.toLowerCase() === target)) {
        const sub = cat.subcategories.find((s) => s.slug.toLowerCase() === target);
        found = {
          _id: `sub-${sub.slug}`,
          name: `${cat.name} – ${sub.name}`,
          slug: sub.slug,
          parentCategory: cat.slug,
          description: `${sub.name} fixtures from our ${cat.name} architectural collection.`,
          image: sub.image || cat.image,
          specs: cat.specs,
          tag: sub.name,
          productsCount: sub.count || 2,
        };
        break;
      }
    }
  }

  return {
    success: !!found,
    category: found || null,
  };
};

export const getFallbackProducts = (params = {}) => {
  let filtered = [...MASTER_PRODUCTS];

  // Category filter
  if (params.category && params.category !== 'all') {
    const catTarget = params.category.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.category && p.category.toLowerCase() === catTarget) ||
        (p.subcategory && p.subcategory.toLowerCase() === catTarget)
    );
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.specifications && Object.values(p.specifications).some((val) => String(val).toLowerCase().includes(q)))
    );
  }

  // Featured filter
  if (params.featured === true || params.featured === 'true') {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  // Sort
  if (params.sort === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params.sort === 'name_desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (params.sort === 'sku_asc') {
    filtered.sort((a, b) => a.sku.localeCompare(b.sku));
  }

  const total = filtered.length;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '12', 10);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    success: true,
    products: paginated,
    total,
    page,
    totalPages,
  };
};

export const getFallbackProductBySlug = (slug) => {
  if (!slug) return { success: false, product: null };
  const target = slug.toLowerCase();
  const product = MASTER_PRODUCTS.find((p) => p.slug.toLowerCase() === target);

  if (!product) {
    return { success: false, product: null, relatedProducts: [] };
  }

  const relatedProducts = MASTER_PRODUCTS.filter(
    (p) => p._id !== product._id && p.category === product.category
  ).slice(0, 12);

  return {
    success: true,
    product,
    relatedProducts,
  };
};
