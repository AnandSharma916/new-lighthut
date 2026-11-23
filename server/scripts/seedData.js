import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import HomepageSection from '../models/HomepageSection.js';
import SiteSettings from '../models/SiteSettings.js';
import { LED_HANGING_LAMPS } from './data/ledHangingLamps.js';
import { WALL_LAMPS } from './data/wallLamps.js';
import { CLASSIC_HANGING_LAMPS } from './data/classicHangingLamps.js';
import { OUTDOOR_LAMPS } from './data/outdoorLamps.js';

dotenv.config();

const seedAll = async (isStandalone = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('[Seed] Clearing existing collections for fresh catalog setup...');
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await HomepageSection.deleteMany({});
    await SiteSettings.deleteMany({});

    // 1. Seed Administrative Accounts
    console.log('[Seed] Seeding administrative accounts...');
    const defaultAdmins = [
      {
        name: 'LightHut Administrator',
        email: (process.env.ADMIN_EMAIL || 'admin@lighthut.com').toLowerCase().trim(),
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
      },
      {
        name: 'LightHut Administrator',
        email: 'admin@lighthut.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
      }
    ];

    for (const adm of defaultAdmins) {
      const exists = await Admin.findOne({ email: adm.email });
      if (!exists) {
        await Admin.create(adm);
        console.log(`[Seed] Admin created: ${adm.email}`);
      }
    }

    // 2. Seed Categories
    console.log('[Seed] Seeding product categories...');
    const categoriesData = [
      // ── 1. WALL LAMP ─────────────────────────────────────
      {
        name: 'Wall Lamp',
        slug: 'wall-lamp',
        description: 'Decorative and functional wall-mounted lamps for every interior style.',
        image: '/categories/wall-lamp.jpg',
        sortOrder: 0,
        isActive: true,
        seoTitle: 'Wall Lamps – LED & Classic | LightHut',
        seoDescription: 'Shop LED and classic wall lamps for modern, classic, and luxury interiors.',
      },
      {
        name: 'LED Wall Lamp',
        slug: 'led-wall-lamp',
        description: 'Energy-efficient LED wall lamps with sleek modern designs for living rooms, bedrooms, and corridors.',
        image: '/categories/led-wall-lamp.jpg',
        sortOrder: 1,
        isActive: true,
        seoTitle: 'LED Wall Lamps | LightHut',
        seoDescription: 'Browse our collection of high-efficiency LED wall lamps with premium finishes.',
      },
      {
        name: 'Wall Lamp',
        slug: 'classic-wall-lamp',
        description: 'Classic socket wall lamps compatible with standard bulbs – ideal for bedside and hallway use.',
        image: '/categories/classic-wall-lamp.jpg',
        sortOrder: 2,
        isActive: true,
        seoTitle: 'Wall Lamps | LightHut',
        seoDescription: 'Wall lamps for classic and contemporary spaces.',
      },
      // ── 2. PENDANT LAMP ───────────────────────────────────
      {
        name: 'Pendant Lamp',
        slug: 'pendant-lamp',
        description: 'Statement hanging pendant lamps for dining rooms, kitchens, and reception areas.',
        image: '/categories/pendant-lamp.jpg',
        sortOrder: 10,
        isActive: true,
        seoTitle: 'Pendant Lamps – LED & Classic Hanging Lights | LightHut',
        seoDescription: 'Explore pendant lamps in LED and classic variants for stylish suspended lighting.',
      },
      {
        name: 'LED Hanging Lamp',
        slug: 'led-hanging-lamp',
        description: 'Modern LED hanging pendant lamps with integrated drivers – zero maintenance, maximum style.',
        image: '/categories/led-hanging-lamp.jpg',
        sortOrder: 11,
        isActive: true,
        seoTitle: 'LED Hanging Lamps | LightHut',
        seoDescription: 'Energy-saving LED pendant lamps for dining, kitchen, and feature spaces.',
      },
      {
        name: 'Hanging Lamp',
        slug: 'classic-hanging-lamp',
        description: 'Versatile pendant lamps with decorative fabric cords and adjustable drop heights.',
        image: '/categories/classic-hanging-lamp.jpg',
        sortOrder: 12,
        isActive: true,
        seoTitle: 'Hanging Lamps | LightHut',
        seoDescription: 'Socket pendant lamps compatible with decorative filament bulbs.',
      },
      {
        name: 'LED Profile Pendant',
        slug: 'led-profile-pendant',
        description: 'Contemporary LED linear profile pendants and geometric architectural suspension lights.',
        image: '/categories/profile-chandelier.jpg',
        sortOrder: 13,
        isActive: true,
        seoTitle: 'LED Profile Pendants | LightHut',
        seoDescription: 'Architectural LED linear and geometric profile pendant lighting fixtures.',
      },
      // ── 3. CHANDELIER ────────────────────────────────────
      {
        name: 'Chandelier',
        slug: 'chandelier',
        description: 'Magnificent chandeliers for grand living rooms, lobbies, and luxury spaces.',
        image: '/categories/chandelier.jpg',
        sortOrder: 20,
        isActive: true,
        seoTitle: 'Chandeliers – All Styles | LightHut',
        seoDescription: 'Discover LED, glass, Italian, antique, modern, and fan chandeliers at LightHut.',
      },
      {
        name: 'LED Chandelier',
        slug: 'led-chandelier',
        description: 'Integrated LED chandeliers offering brilliant illumination with ultra-low energy consumption.',
        image: '/categories/chandelier.jpg',
        sortOrder: 21,
        isActive: true,
        seoTitle: 'LED Chandeliers | LightHut',
        seoDescription: 'LED chandeliers for luxury interiors with modern and classic designs.',
      },
      {
        name: 'E14 Chandelier',
        slug: 'e14-chandelier',
        description: 'Multi-arm E14 candelabra chandeliers with replaceable bulbs for a classic elegant look.',
        image: '/categories/e14-chandelier.jpg',
        sortOrder: 22,
        isActive: true,
        seoTitle: 'E14 Chandeliers | LightHut',
        seoDescription: 'E14 multi-arm chandeliers for dining rooms, foyers, and hotel lobbies.',
      },
      {
        name: 'Profile Chandelier',
        slug: 'profile-chandelier',
        description: 'Sleek linear profile chandeliers with architectural LED strips for modern interiors.',
        image: '/categories/profile-chandelier.jpg',
        sortOrder: 23,
        isActive: true,
        seoTitle: 'Profile Chandeliers | LightHut',
        seoDescription: 'Linear profile LED chandeliers for contemporary dining and meeting rooms.',
      },
      {
        name: 'Glass Chandelier',
        slug: 'glass-chandelier',
        description: 'Handcrafted glass chandeliers with blown, ribbed, and crystal-clear glass elements.',
        image: '/categories/glass-chandelier.jpg',
        sortOrder: 24,
        isActive: true,
        seoTitle: 'Glass Chandeliers | LightHut',
        seoDescription: 'Elegant glass chandeliers in modern, classic, and art-glass styles.',
      },
      {
        name: 'Italian Chandelier',
        slug: 'italian-chandelier',
        description: 'Artisan Italian-crafted chandeliers inspired by Venetian glass and European luxury traditions.',
        image: '/categories/italian-chandelier.jpg',
        sortOrder: 25,
        isActive: true,
        seoTitle: 'Italian Chandeliers | LightHut',
        seoDescription: 'Authentic Italian-style chandeliers for luxury homes, hotels, and palaces.',
      },
      {
        name: 'Modern Chandelier',
        slug: 'modern-chandelier',
        description: 'Contemporary geometric and sculptural chandeliers for minimalist and modern interiors.',
        image: '/categories/modern-chandelier.jpg',
        sortOrder: 26,
        isActive: true,
        seoTitle: 'Modern Chandeliers | LightHut',
        seoDescription: 'Sleek modern chandeliers in metal, acrylic, and mixed-material finishes.',
      },
      {
        name: 'Antique Chandelier',
        slug: 'antique-chandelier',
        description: 'Heritage-inspired antique finish chandeliers with classic ironwork, crystals, and candelabra arms.',
        image: '/categories/antic-chandelier.jpg',
        sortOrder: 27,
        isActive: true,
        seoTitle: 'Antique Chandeliers | LightHut',
        seoDescription: 'Classic antique chandeliers for traditional and heritage interior spaces.',
      },
      {
        name: 'Fan Chandelier',
        slug: 'fan-chandelier',
        description: 'Ceiling fan chandeliers combining decorative lighting with powerful airflow for living rooms.',
        image: '/categories/fan-chandelier.jpg',
        sortOrder: 28,
        isActive: true,
        seoTitle: 'Fan Chandeliers | LightHut',
        seoDescription: 'Decorative fan chandeliers with integrated lighting for living rooms and bedrooms.',
      },
      {
        name: 'Ceiling Chandelier',
        slug: 'ceiling-chandelier',
        description: 'Flush and semi-flush ceiling chandeliers ideal for rooms with standard ceiling heights.',
        image: '/categories/ceiling-chandelier.jpg',
        sortOrder: 29,
        isActive: true,
        seoTitle: 'Ceiling Chandeliers | LightHut',
        seoDescription: 'Flush and semi-flush ceiling chandeliers for standard-height rooms.',
      },
      // ── 4. DOUBLE HEIGHT ─────────────────────────────────
      {
        name: 'Double Height',
        slug: 'double-height',
        description: 'Dramatic large-scale chandeliers engineered for double-height foyers, stairwells, and grand halls.',
        image: '/categories/double-height.jpg',
        sortOrder: 30,
        isActive: true,
        seoTitle: 'Double Height Chandeliers | LightHut',
        seoDescription: 'Grand double-height crystal and modern chandeliers for luxury foyers and atriums.',
      },
      {
        name: 'Crystal Chandelier',
        slug: 'crystal-chandelier',
        description: 'Precision-cut K9 crystal chandeliers delivering spectacular prismatic light for grand double-height spaces.',
        image: '/categories/double-height.jpg',
        sortOrder: 31,
        isActive: true,
        seoTitle: 'Crystal Chandeliers | LightHut',
        seoDescription: 'K9 crystal chandeliers for foyers, ballrooms, and luxury double-height spaces.',
      },
      {
        name: 'Modern Double Height Chandelier',
        slug: 'modern-double-height-chandelier',
        description: 'Architectural large-scale modern chandeliers designed for soaring ceilings and open-plan grand halls.',
        image: '/categories/modern-chandelier-dh.jpg',
        sortOrder: 32,
        isActive: true,
        seoTitle: 'Modern Double Height Chandeliers | LightHut',
        seoDescription: 'Contemporary large-scale chandeliers for double-height and high-ceiling spaces.',
      },
      // ── 5. DINING TABLE LAMP ─────────────────────────────
      {
        name: 'Dining Table Lamp',
        slug: 'dining-table-lamp',
        description: 'Elegant table lamps designed to complement dining spaces with warm, welcoming illumination.',
        image: '/categories/dining-table-lamp.jpg',
        sortOrder: 40,
        isActive: true,
        seoTitle: 'Dining Table Lamps | LightHut',
        seoDescription: 'Premium dining table lamps with warm-white illumination for elegant dining experiences.',
      },
      // ── 6. OUTDOOR LIGHT ─────────────────────────────────
      {
        name: 'Outdoor Light',
        slug: 'outdoor-light',
        description: 'Weather-resistant outdoor lighting solutions for gates, facades, gardens, and pathways.',
        image: '/categories/outdoor-light.jpg',
        sortOrder: 50,
        isActive: true,
        seoTitle: 'Outdoor Lights – Gate & Wall | LightHut',
        seoDescription: 'Durable IP-rated outdoor lights for gates, walls, and exterior facades.',
      },
      {
        name: 'Gate Lamp',
        slug: 'gate-lamp',
        description: 'Classic and modern gate post lamps to elevate your entrance with style and security.',
        image: '/categories/outdoor-light.jpg',
        sortOrder: 51,
        isActive: true,
        seoTitle: 'Gate Lamps | LightHut',
        seoDescription: 'Decorative and durable gate post lamps for residential and commercial entrances.',
      },
      {
        name: 'Outdoor Wall Lamp',
        slug: 'outdoor-wall-lamp',
        description: 'IP65 weatherproof outdoor wall lamps for exterior facades, porches, and garden walls.',
        image: '/hero-outdoor.jpg',
        sortOrder: 52,
        isActive: true,
        seoTitle: 'Outdoor Wall Lamps | LightHut',
        seoDescription: 'Weatherproof outdoor wall lights for facades, porches, and garden areas.',
      },
      {
        name: 'Outdoor Hanging Lamp',
        slug: 'outdoor-hanging-lamp',
        description: 'Weatherproof outdoor hanging lamps and exterior pendants for porches, gazebos, and entrance canopies.',
        image: '/categories/outdoor-light.jpg',
        sortOrder: 53,
        isActive: true,
        seoTitle: 'Outdoor Hanging Lamps | LightHut',
        seoDescription: 'Weatherproof IP-rated outdoor hanging lamps and pendants.',
      },
      // ── 7. TABLE LAMP ────────────────────────────────────
      {
        name: 'Table Lamp',
        slug: 'table-lamp',
        description: 'Sculptural and functional table lamps for bedside, study, and living room accent lighting.',
        image: '/categories/table-lamp.jpg',
        sortOrder: 60,
        isActive: true,
        seoTitle: 'Table Lamps | LightHut',
        seoDescription: 'Designer table lamps in ceramic, metal, glass, and wood for every interior.',
      },
      // ── 8. FLOOR LAMP ────────────────────────────────────
      {
        name: 'Floor Lamp',
        slug: 'floor-lamp',
        description: 'Statement floor lamps for living rooms, reading corners, and home office spaces.',
        image: '/categories/floor-lamp.jpg',
        sortOrder: 70,
        isActive: true,
        seoTitle: 'Floor Lamps | LightHut',
        seoDescription: 'Premium floor lamps with arched, tripod, and column designs for modern interiors.',
      },
      // ── 9. LED FILAMENT BULB ─────────────────────────────
      {
        name: 'LED Filament Bulb',
        slug: 'led-filament-bulb',
        description: 'Vintage-style LED filament bulbs with warm Edison glow and modern energy efficiency.',
        image: '/categories/led-filament-bulb.jpg',
        sortOrder: 80,
        isActive: true,
        seoTitle: 'LED Filament Bulbs | LightHut',
        seoDescription: 'Vintage Edison LED filament bulbs – warm glow, low energy, long life.',
      },
      // ── 10. SPARE PART ───────────────────────────────────
      {
        name: 'Spare Part',
        slug: 'spare-part',
        description: 'Replacement parts and accessories for lamps and chandeliers.',
        image: '/categories/spare-part.jpg',
        sortOrder: 90,
        isActive: true,
        seoTitle: 'Spare Parts – Lamp Accessories | LightHut',
        seoDescription: 'Original spare parts including hanging bases, drivers, and lamp accessories.',
      },
      {
        name: 'Hanging Base',
        slug: 'hanging-base',
        description: 'Universal ceiling canopy bases and hanging hardware for pendant and chandelier installations.',
        image: '/categories/hanging-base.jpg',
        sortOrder: 91,
        isActive: true,
        seoTitle: 'Hanging Bases & Canopies | LightHut',
        seoDescription: 'Ceiling canopy bases, rose covers, and suspension hardware for chandeliers and pendants.',
      },
      {
        name: 'Spare Driver',
        slug: 'spare-driver',
        description: 'Replacement LED drivers and transformers compatible with a wide range of LightHut luminaires.',
        image: '/categories/spare-driver.jpg',
        sortOrder: 92,
        isActive: true,
        seoTitle: 'LED Spare Drivers & Transformers | LightHut',
        seoDescription: 'OEM-compatible LED drivers and power supplies for LightHut fixtures.',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Created ${createdCategories.length} categories.`);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Products
    console.log('[Seed] Seeding LightHut product catalog...');
    const productsData = [
      // ── WALL LAMP: LED + Classic ──────────────────────────────────────
      // Catalogue products: see ./data/wallLamps.js
      ...WALL_LAMPS.map(({ categorySlug, ...p }) => ({ ...p, category: catMap[categorySlug] })),
      // ── LED HANGING LAMP ──────────────────────────────────────────
      // Catalogue products: see ./data/ledHangingLamps.js
      ...LED_HANGING_LAMPS.map((p) => ({ ...p, category: catMap['led-hanging-lamp'] })),
      // ── HANGING LAMP (+ one LED foam lamp) ────────────────────
      // Catalogue products: see ./data/classicHangingLamps.js
      ...CLASSIC_HANGING_LAMPS.map(({ categorySlug, ...p }) => ({ ...p, category: catMap[categorySlug] })),
      // ── LED CHANDELIER ────────────────────────────────────────────
      {
        name: 'LH-CH101 Sputnik LED Chandelier',
        slug: 'lh-ch101-sputnik-led-chandelier',
        sku: 'LH-CH101',
        category: catMap['led-chandelier'],
        shortDescription: 'Mid-century Sputnik-style 12-arm LED chandelier in matte black and gold tips.',
        description: 'Twelve radiating arms extend in every direction from the central sphere, each tipped with a precision LED capsule. Makes a bold architectural statement in living rooms, hotel lobbies, and restaurant interiors.',
        images: [
          { url: '/categories/chandelier.jpg', alt: 'LH-CH101 Sputnik LED Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Spread: 800mm Dia, Height: 700mm',
          material: 'Steel & Aluminum',
          finish: 'Matte Black with Gold Tips',
          wattage: '12 x 5W G9 LED (60W Total)',
          voltage: 'AC 100-240V',
          colorTemperature: '3000K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Ceiling Mount with Steel Cable',
          beamAngle: 'Multi-Directional',
          cri: 'Ra > 90',
          luminousFlux: '5400 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── E14 CHANDELIER ────────────────────────────────────────────
      {
        name: 'LH-CH201 Classic 8-Arm E14 Chandelier',
        slug: 'lh-ch201-classic-8-arm-e14-chandelier',
        sku: 'LH-CH201',
        category: catMap['e14-chandelier'],
        shortDescription: 'Traditional 8-arm candelabra chandelier in antique gold with E14 candle-style sockets.',
        description: 'A masterpiece of classical European design. Eight graceful curved arms radiate from a central column, each terminating in a decorative drip canopy and E14 socket for candelabra LED bulbs.',
        images: [
          { url: '/categories/e14-chandelier.jpg', alt: 'LH-CH201 Classic E14 Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Spread: 700mm Dia, Height: 600mm',
          material: 'Cast Iron & Zinc Alloy',
          finish: 'Antique Gold Electroplate',
          wattage: '8 x E14 Max 25W (Bulbs Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Ceiling Chain Suspension',
          beamAngle: 'Omnidirectional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── PROFILE CHANDELIER ────────────────────────────────────────
      {
        name: 'LH-CH301 Linear Profile LED Chandelier',
        slug: 'lh-ch301-linear-profile-led-chandelier',
        sku: 'LH-CH301',
        category: catMap['profile-chandelier'],
        shortDescription: 'Ultra-slim 1200mm linear LED profile chandelier with dimmable warm-white output.',
        description: 'A razor-sharp luminous line suspended above dining and conference tables. The extruded aluminum profile houses a high-density LED strip behind a micro-prismatic diffuser, producing a seamless luminous surface.',
        images: [
          { url: '/categories/profile-chandelier.jpg', alt: 'LH-CH301 Linear Profile Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: '1200mm x 60mm x 60mm',
          material: 'Extruded Aluminum',
          finish: 'Matte Black / Brushed Gold',
          wattage: '36W Integrated LED',
          voltage: 'AC 100-240V (Dimmable)',
          colorTemperature: '3000K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Wire Suspension (Aircraft Cable)',
          beamAngle: '120° Diffuse Downlight',
          cri: 'Ra > 95',
          luminousFlux: '3200 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── GLASS CHANDELIER ──────────────────────────────────────────
      {
        name: 'LH-CH401 Blown Glass Orb Chandelier',
        slug: 'lh-ch401-blown-glass-orb-chandelier',
        sku: 'LH-CH401',
        category: catMap['glass-chandelier'],
        shortDescription: 'Seven mouth-blown frosted glass orbs cascading at varying heights from a brushed nickel canopy.',
        description: 'Each globe is individually mouth-blown by skilled artisans, meaning no two are exactly alike. The cluster creates an organic, cloud-like composition that transforms any living room or foyer.',
        images: [
          { url: '/categories/glass-chandelier.jpg', alt: 'LH-CH401 Glass Orb Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Canopy: 500mm Dia, Drop: up to 3000mm',
          material: 'Mouth-Blown Borosilicate Glass & Nickel',
          finish: 'Frosted White / Brushed Nickel',
          wattage: '7 x 5W G9 LED (35W Total)',
          voltage: 'AC 100-240V',
          colorTemperature: '2700K Warm Amber',
          ipRating: 'IP20 Indoor',
          installationType: 'High Ceiling Canopy Mount',
          beamAngle: 'Omnidirectional',
          cri: 'Ra > 92',
          luminousFlux: '3150 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── ITALIAN CHANDELIER ────────────────────────────────────────
      {
        name: 'LH-CH501 Murano-Style Italian Chandelier',
        slug: 'lh-ch501-murano-style-italian-chandelier',
        sku: 'LH-CH501',
        category: catMap['italian-chandelier'],
        shortDescription: 'Venetian art-glass chandelier with hand-applied gold leaf detailing on each glass petal.',
        description: 'Crafted following authentic Venetian glassmaking traditions, the LH-CH501 features an explosion of delicate glass flowers and leaves radiating from a gilded steel chassis.',
        images: [
          { url: '/categories/italian-chandelier.jpg', alt: 'LH-CH501 Italian Murano Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Dia: 900mm, Fixture Height: 800mm, Drop: 4500mm max',
          material: 'Venetian Art Glass & Gilded Steel',
          finish: 'Gold Leaf & Multi-Colour Glass',
          wattage: '12 x E14 Max 25W (Bulbs Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Reinforced Ceiling Mount',
          beamAngle: 'Omnidirectional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── MODERN CHANDELIER ─────────────────────────────────────────
      {
        name: 'LH-CH601 Geometric Ring Modern Chandelier',
        slug: 'lh-ch601-geometric-ring-modern-chandelier',
        sku: 'LH-CH601',
        category: catMap['modern-chandelier'],
        shortDescription: 'Concentric ring LED chandelier in brushed gold – the ultimate modern statement piece.',
        description: 'Three concentric circular LED rings suspended at staggered heights create a mesmerising orbital effect. Warm-white LED strips are factory-dimmable for living rooms, open-plan spaces, and hotel lobbies.',
        images: [
          { url: '/categories/modern-chandelier.jpg', alt: 'LH-CH601 Ring Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Outer Ring: 800mm Dia, Height: 500mm',
          material: 'Steel & Aluminum',
          finish: 'Brushed Gold',
          wattage: '72W Integrated LED',
          voltage: 'AC 100-240V (Dimmable)',
          colorTemperature: '3000K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Aircraft Cable Ceiling Mount',
          beamAngle: '360° Ring Diffuse',
          cri: 'Ra > 90',
          luminousFlux: '6200 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── ANTIQUE CHANDELIER ────────────────────────────────────────
      {
        name: 'LH-CH701 Wrought Iron Antique Chandelier',
        slug: 'lh-ch701-wrought-iron-antique-chandelier',
        sku: 'LH-CH701',
        category: catMap['antique-chandelier'],
        shortDescription: 'Hand-forged wrought iron antique chandelier with 6 candelabra arms and distressed bronze finish.',
        description: 'Reminiscent of grand heritage manor houses. The LH-CH701 is hand-forged from solid wrought iron and individually distressed by artisans to achieve its authentic aged bronze patina.',
        images: [
          { url: '/categories/antic-chandelier.jpg', alt: 'LH-CH701 Antique Iron Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Spread: 650mm Dia, Height: 550mm',
          material: 'Hand-Forged Wrought Iron',
          finish: 'Distressed Antique Bronze',
          wattage: '6 x E14 Max 40W (Bulbs Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Chain Ceiling Mount',
          beamAngle: 'Omnidirectional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      },
      // ── FAN CHANDELIER ────────────────────────────────────────────
      {
        name: 'LH-CH801 Crystal Fan Chandelier',
        slug: 'lh-ch801-crystal-fan-chandelier',
        sku: 'LH-CH801',
        category: catMap['fan-chandelier'],
        shortDescription: '52" decorative ceiling fan with K9 crystal chandelier skirt and dimmable LED light kit.',
        description: 'The LH-CH801 blends the cool airflow of a 52-inch high-efficiency fan with the grandeur of a crystal chandelier. Six reversible blades and remote-controlled dimming for master bedrooms and living rooms.',
        images: [
          { url: '/categories/fan-chandelier.jpg', alt: 'LH-CH801 Crystal Fan Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Blade Span: 52 inch (1320mm)',
          material: 'Steel Motor Housing & K9 Crystal Trim',
          finish: 'Brushed Chrome & Clear Crystal',
          wattage: '65W Motor + 30W LED Light Kit',
          voltage: 'AC 220V 50Hz',
          colorTemperature: '3000K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Ceiling Direct Mount or Downrod',
          beamAngle: 'Downward Diffuse',
          cri: 'Ra > 80',
          luminousFlux: '2700 Lumens (Light Kit)',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── CEILING CHANDELIER ────────────────────────────────────────
      {
        name: 'LH-CH901 Flush Mount Ceiling Chandelier',
        slug: 'lh-ch901-flush-mount-ceiling-chandelier',
        sku: 'LH-CH901',
        category: catMap['ceiling-chandelier'],
        shortDescription: 'Semi-flush ceiling chandelier with frosted glass shade and chrome detailing – suits 8-9ft ceilings.',
        description: 'Perfect for rooms where a hanging chandelier is impractical. The LH-CH901 sits close to the ceiling providing a chandelier-like aesthetic without requiring a high ceiling.',
        images: [
          { url: '/categories/ceiling-chandelier.jpg', alt: 'LH-CH901 Flush Mount Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Dia: 500mm, Height: 300mm (from ceiling)',
          material: 'Steel & Frosted Glass',
          finish: 'Chrome & Frosted White',
          wattage: '4 x E14 Max 25W (Bulbs Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Semi-Flush Ceiling Mount',
          beamAngle: 'Omnidirectional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      },
      // ── CRYSTAL CHANDELIER (DOUBLE HEIGHT) ────────────────────────
      {
        name: 'LH-DH101 Grand K9 Crystal Chandelier',
        slug: 'lh-dh101-grand-k9-crystal-chandelier',
        sku: 'LH-DH101',
        category: catMap['crystal-chandelier'],
        shortDescription: 'Cascading 5-tier K9 crystal chandelier for double-height foyers and ballrooms.',
        description: 'The LH-DH101 is the crown jewel of our chandelier collection. Five cascading tiers of precision-cut K9 crystal prisms capture every light ray and scatter it into thousands of glittering rainbow reflections.',
        images: [
          { url: '/categories/double-height.jpg', alt: 'LH-DH101 Grand Crystal Chandelier', isCover: true },
          { url: '/hero-chandelier.jpg', alt: 'Crystal Detail View', isCover: false },
        ],
        specifications: {
          dimensions: 'Dia: 1200mm, Fixture Height: 1500mm, Drop: 6000mm max',
          material: 'K9 Optical Crystal & Chromed Steel Frame',
          finish: 'Chrome & Clear Crystal',
          wattage: '24 x E14 Max 40W (Bulbs Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Reinforced Ceiling Plate (Structural Hook)',
          beamAngle: 'Prismatic Multi-Directional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-DH102 Grand Raindrop Crystal Chandelier',
        slug: 'lh-dh102-grand-raindrop-crystal-chandelier',
        sku: 'LH-DH102',
        category: catMap['crystal-chandelier'],
        shortDescription: 'Cascading raindrop K9 crystal chandelier – 1500mm Dia, ideal for grand ballrooms.',
        description: 'Thousands of tear-drop cut crystal prisms descend like a shimmering rainfall from a polished chrome ceiling plate. Each prism is individually hand-strung and contributes to an overwhelming spectacle of reflected light.',
        images: [
          { url: '/categories/double-height.jpg', alt: 'LH-DH102 Raindrop Crystal Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Dia: 1500mm, Drop: 8000mm max',
          material: 'K9 Crystal & Chrome Steel',
          finish: 'Chrome & Raindrop Crystal',
          wattage: '36 x E14 Max 40W',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Structural Ceiling Hook',
          beamAngle: 'Prismatic Omnidirectional',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
      // ── MODERN DOUBLE HEIGHT CHANDELIER ───────────────────────────
      {
        name: 'LH-DH201 Helix Modern Double Height Chandelier',
        slug: 'lh-dh201-helix-modern-double-height-chandelier',
        sku: 'LH-DH201',
        category: catMap['modern-double-height-chandelier'],
        shortDescription: 'Dramatic helical LED chandelier sculpture for soaring double-height spaces – 3m drop.',
        description: 'A sculptural helix of illuminated LED rings spirals downwards from the ceiling plate, creating a dynamic focal point in grand staircases, atrium lobbies, and contemporary mansions.',
        images: [
          { url: '/categories/modern-chandelier-dh.jpg', alt: 'LH-DH201 Helix Chandelier', isCover: true },
        ],
        specifications: {
          dimensions: 'Dia: 600mm, Drop: 3000mm (customisable)',
          material: 'Precision Steel & Aluminum',
          finish: 'Matte Black / Brushed Gold',
          wattage: '120W Integrated LED',
          voltage: 'AC 100-240V',
          colorTemperature: '3000K Warm White (Dimmable)',
          ipRating: 'IP20 Indoor',
          installationType: 'Structural Ceiling Mount',
          beamAngle: '360° Spiral Diffuse',
          cri: 'Ra > 90',
          luminousFlux: '10000 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── DINING TABLE LAMP ─────────────────────────────────────────
      {
        name: 'LH-DTL101 Ceramic Dining Table Lamp',
        slug: 'lh-dtl101-ceramic-dining-table-lamp',
        sku: 'LH-DTL101',
        category: catMap['dining-table-lamp'],
        shortDescription: 'Hand-thrown ceramic dining table lamp with linen drum shade and warm-white LED bulb.',
        description: 'Each ceramic base is thrown by hand on the potter\'s wheel, giving it a unique tactile surface. Paired with a natural linen drum shade, the LH-DTL101 casts warm, diffused light perfect for dining sideboards and buffets.',
        images: [
          { url: '/categories/dining-table-lamp.jpg', alt: 'LH-DTL101 Ceramic Dining Lamp', isCover: true },
        ],
        specifications: {
          dimensions: 'Height: 520mm, Shade Dia: 300mm',
          material: 'Hand-Thrown Ceramic & Linen',
          finish: 'Matte Ivory Glaze & Natural Linen',
          wattage: 'Max 25W (LED Bulb Included)',
          voltage: 'AC 220-240V',
          colorTemperature: '2700K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Freestanding Table Lamp',
          beamAngle: '360° Diffuse',
          cri: 'Ra > 90',
          luminousFlux: '800 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      // ── OUTDOOR LIGHT: GATE LAMP + OUTDOOR WALL LAMP ─────────────
      // Catalogue products: see ./data/outdoorLamps.js
      ...OUTDOOR_LAMPS.map(({ categorySlug, ...p }) => ({ ...p, category: catMap[categorySlug] })),
      // ── TABLE LAMP ────────────────────────────────────────────────
      {
        name: 'LH-TL101 Marble & Brass Table Lamp',
        slug: 'lh-tl101-marble-brass-table-lamp',
        sku: 'LH-TL101',
        category: catMap['table-lamp'],
        shortDescription: 'Solid white marble base with polished brass stem and ivory pleated shade.',
        description: 'The combination of genuine Carrara white marble and hand-polished brass creates a sophisticated statement piece. The custom-crafted ivory pleated shade softens and diffuses light for a warm, inviting ambience.',
        images: [
          { url: '/categories/table-lamp.jpg', alt: 'LH-TL101 Marble Table Lamp', isCover: true },
        ],
        specifications: {
          dimensions: 'Height: 580mm, Shade Dia: 320mm',
          material: 'Carrara Marble & Solid Brass',
          finish: 'Natural White Marble / Polished Brass',
          wattage: 'Max 25W (LED Bulb Included)',
          voltage: 'AC 220-240V',
          colorTemperature: '2700K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Freestanding Table Lamp',
          beamAngle: '360° Diffuse',
          cri: 'Ra > 95',
          luminousFlux: '700 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-TL102 Rattan Bedside Table Lamp',
        slug: 'lh-tl102-rattan-bedside-table-lamp',
        sku: 'LH-TL102',
        category: catMap['table-lamp'],
        shortDescription: 'Handwoven rattan drum table lamp with warm fabric inner lining for cosy bedroom lighting.',
        description: 'A natural, earthy accent for bedrooms and living rooms. The hand-woven rattan drum shade casts intricate geometric patterns on surrounding walls when illuminated.',
        images: [
          { url: '/categories/table-lamp.jpg', alt: 'LH-TL102 Rattan Table Lamp', isCover: true },
        ],
        specifications: {
          dimensions: 'Height: 420mm, Shade Dia: 280mm',
          material: 'Rattan & Bamboo',
          finish: 'Natural Rattan',
          wattage: 'Max 25W (Bulb Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Freestanding Table Lamp',
          beamAngle: '360° Textured Diffuse',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
      // ── FLOOR LAMP ────────────────────────────────────────────────
      {
        name: 'LH-FL101 Arc Floor Lamp',
        slug: 'lh-fl101-arc-floor-lamp',
        sku: 'LH-FL101',
        category: catMap['floor-lamp'],
        shortDescription: 'Elegant arched floor lamp in brushed gold with a wide dome shade and inline dimmer.',
        description: 'The sweeping arc of the LH-FL101 projects over sofas, armchairs, and reading nooks, delivering a focused pool of warm light from above. The inline rotary dimmer allows you to set the perfect ambience.',
        images: [
          { url: '/categories/floor-lamp.jpg', alt: 'LH-FL101 Arc Floor Lamp', isCover: true },
        ],
        specifications: {
          dimensions: 'Height: 1800mm, Arc Reach: 1200mm, Base: 300mm',
          material: 'Steel & Aluminum',
          finish: 'Brushed Gold / Matte Black Shade Interior',
          wattage: 'Max 40W (LED Bulb Included)',
          voltage: 'AC 220-240V',
          colorTemperature: '2700K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Freestanding Floor Lamp',
          beamAngle: '150° Downward',
          cri: 'Ra > 90',
          luminousFlux: '1200 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-FL102 Tripod Walnut Floor Lamp',
        slug: 'lh-fl102-tripod-walnut-floor-lamp',
        sku: 'LH-FL102',
        category: catMap['floor-lamp'],
        shortDescription: 'Mid-century tripod floor lamp in walnut-finish wood legs with a linen drum shade.',
        description: 'The classic tripod silhouette with solid wood-effect legs in a warm walnut stain. The natural linen drum shade complements any Scandinavian, mid-century, or organic-modern interior.',
        images: [
          { url: '/categories/floor-lamp.jpg', alt: 'LH-FL102 Tripod Floor Lamp', isCover: true },
        ],
        specifications: {
          dimensions: 'Height: 1600mm, Shade Dia: 400mm',
          material: 'Solid Wood & Linen',
          finish: 'Walnut Stain / Natural Linen',
          wattage: 'Max 40W (Bulb Not Included)',
          voltage: 'AC 220-240V',
          colorTemperature: 'Depends on Bulb',
          ipRating: 'IP20 Indoor',
          installationType: 'Freestanding Floor Lamp',
          beamAngle: '360° Diffuse',
          cri: 'Depends on Bulb',
          luminousFlux: 'Depends on Bulb',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
      // ── LED FILAMENT BULB ─────────────────────────────────────────
      {
        name: 'LH-FB101 ST64 Edison LED Filament Bulb',
        slug: 'lh-fb101-st64-edison-led-filament-bulb',
        sku: 'LH-FB101',
        category: catMap['led-filament-bulb'],
        shortDescription: 'ST64 vintage Edison LED filament bulb 6W – warm 2200K amber glow, screw base.',
        description: 'Recreates the warm, amber nostalgia of the original carbon filament lamp with 90% less energy consumption. The visible spiral LED filament is seen through the smoke-tinted globe for an authentic vintage aesthetic.',
        images: [
          { url: '/categories/led-filament-bulb.jpg', alt: 'LH-FB101 ST64 Filament Bulb', isCover: true },
        ],
        specifications: {
          dimensions: 'ST64: Dia 64mm, Height: 142mm',
          material: 'Glass & Tungsten Filament LED',
          finish: 'Smoke Tinted Globe',
          wattage: '6W LED (Equiv. 60W Incandescent)',
          voltage: 'AC 220-240V',
          colorTemperature: '2200K Sunset Amber',
          ipRating: 'IP20 Indoor',
          installationType: 'Screw Base',
          beamAngle: '360° Omnidirectional',
          cri: 'Ra > 80',
          luminousFlux: '550 Lumens',
        },
        isFeatured: true,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-FB102 G95 Globe LED Filament Bulb',
        slug: 'lh-fb102-g95-globe-led-filament-bulb',
        sku: 'LH-FB102',
        category: catMap['led-filament-bulb'],
        shortDescription: 'G95 large globe LED filament bulb 8W – clear glass, warm 2700K, screw base.',
        description: 'The LH-FB102 features a 95mm diameter globe with a clear glass envelope showcasing the full spiral filament array. Perfect for exposed-bulb pendant lamps, industrial pendants, and decorative chandeliers.',
        images: [
          { url: '/categories/led-filament-bulb.jpg', alt: 'LH-FB102 G95 Globe Filament Bulb', isCover: true },
        ],
        specifications: {
          dimensions: 'G95: Dia 95mm, Height: 152mm',
          material: 'Clear Glass & LED Filament',
          finish: 'Clear Glass',
          wattage: '8W LED (Equiv. 75W Incandescent)',
          voltage: 'AC 220-240V',
          colorTemperature: '2700K Warm White',
          ipRating: 'IP20 Indoor',
          installationType: 'Screw Base',
          beamAngle: '360° Omnidirectional',
          cri: 'Ra > 80',
          luminousFlux: '750 Lumens',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
      {
        name: 'LH-FB103 T10 Tubular LED Filament Bulb',
        slug: 'lh-fb103-t10-tubular-led-filament-bulb',
        sku: 'LH-FB103',
        category: catMap['led-filament-bulb'],
        shortDescription: 'T10 tubular LED filament bulb 4W – vintage amber 2200K, ideal for bar cart and decorative holders.',
        description: 'The slender tubular form of the LH-FB103 is inspired by the original tubular incandescent. Perfect for exposed-bulb wall sconces, vintage bar pendants, and Edison-style lanterns.',
        images: [
          { url: '/categories/led-filament-bulb.jpg', alt: 'LH-FB103 Tubular Filament Bulb', isCover: true },
        ],
        specifications: {
          dimensions: 'T10: Dia 30mm, Height: 110mm',
          material: 'Clear Glass & LED Filament',
          finish: 'Clear / Amber Tint',
          wattage: '4W LED (Equiv. 40W Incandescent)',
          voltage: 'AC 220-240V',
          colorTemperature: '2200K Amber',
          ipRating: 'IP20 Indoor',
          installationType: 'Screw Base',
          beamAngle: '360° Omnidirectional',
          cri: 'Ra > 80',
          luminousFlux: '400 Lumens',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 2,
      },
      // ── HANGING BASE ──────────────────────────────────────────────
      {
        name: 'LH-SP101 Universal Ceiling Canopy Base',
        slug: 'lh-sp101-universal-ceiling-canopy-base',
        sku: 'LH-SP101',
        category: catMap['hanging-base'],
        shortDescription: 'Round ceiling canopy rose cover in brushed gold – fits all standard pendant and chandelier installations.',
        description: 'The LH-SP101 is a universal ceiling rose cover plate suitable for use with any pendant cord or chandelier suspension system. Its deep recess neatly conceals junction box wiring for a clean, professional finish.',
        images: [
          { url: '/categories/hanging-base.jpg', alt: 'LH-SP101 Ceiling Canopy', isCover: true },
        ],
        specifications: {
          dimensions: 'Dia: 120mm, Depth: 55mm',
          material: 'Zinc Alloy',
          finish: 'Brushed Gold / Matte Black / Chrome',
          wattage: 'N/A (Spare Part)',
          voltage: 'N/A',
          colorTemperature: 'N/A',
          ipRating: 'IP20 Indoor',
          installationType: 'Ceiling Junction Box Cover',
          beamAngle: 'N/A',
          cri: 'N/A',
          luminousFlux: 'N/A',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-SP102 Large Square Ceiling Canopy 200mm',
        slug: 'lh-sp102-large-square-ceiling-canopy',
        sku: 'LH-SP102',
        category: catMap['hanging-base'],
        shortDescription: 'Square 200mm ceiling canopy for multi-cord chandelier and cluster pendant installations.',
        description: 'The LH-SP102 large square canopy is designed to house multiple pendant cords or chandelier cables from a single junction box. Available in matte black, brushed gold, and polished chrome finishes.',
        images: [
          { url: '/categories/hanging-base.jpg', alt: 'LH-SP102 Square Canopy', isCover: true },
        ],
        specifications: {
          dimensions: '200mm x 200mm x 60mm',
          material: 'Zinc Alloy',
          finish: 'Matte Black / Brushed Gold / Chrome',
          wattage: 'N/A (Spare Part)',
          voltage: 'N/A',
          colorTemperature: 'N/A',
          ipRating: 'IP20 Indoor',
          installationType: 'Ceiling Junction Box Cover',
          beamAngle: 'N/A',
          cri: 'N/A',
          luminousFlux: 'N/A',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
      // ── SPARE DRIVER ──────────────────────────────────────────────
      {
        name: 'LH-SP201 24V 60W Dimmable LED Driver',
        slug: 'lh-sp201-24v-60w-led-driver',
        sku: 'LH-SP201',
        category: catMap['spare-driver'],
        shortDescription: 'Constant-voltage 24V 60W dimmable LED driver – compatible with most LightHut LED products.',
        description: 'The LH-SP201 is a high-efficiency constant-voltage LED driver suitable as a replacement for failed drivers in LightHut LED chandeliers and pendant lamps. Built-in short-circuit, over-voltage, and over-temperature protection.',
        images: [
          { url: '/categories/spare-driver.jpg', alt: 'LH-SP201 LED Driver', isCover: true },
        ],
        specifications: {
          dimensions: '180mm x 38mm x 30mm',
          material: 'Aluminum Housing',
          finish: 'Silver',
          wattage: '60W Output',
          voltage: 'Input: AC 100-240V / Output: 24V DC',
          colorTemperature: 'N/A',
          ipRating: 'IP20 Indoor',
          installationType: 'Internal Driver Replacement',
          beamAngle: 'N/A',
          cri: 'N/A',
          luminousFlux: 'N/A',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      },
      {
        name: 'LH-SP202 12V 36W Constant Voltage LED Driver',
        slug: 'lh-sp202-12v-36w-led-driver',
        sku: 'LH-SP202',
        category: catMap['spare-driver'],
        shortDescription: '12V 36W constant voltage LED driver – replacement for LightHut 12V wall lamps and pendants.',
        description: 'The LH-SP202 is a compact 12V constant-voltage replacement driver for wall lamps and smaller pendant fixtures. Features active power factor correction (PFC) and a silent fanless cooling design.',
        images: [
          { url: '/categories/spare-driver.jpg', alt: 'LH-SP202 12V LED Driver', isCover: true },
        ],
        specifications: {
          dimensions: '130mm x 35mm x 25mm',
          material: 'Aluminum Housing',
          finish: 'Silver',
          wattage: '36W Output',
          voltage: 'Input: AC 100-240V / Output: 12V DC',
          colorTemperature: 'N/A',
          ipRating: 'IP20 Indoor',
          installationType: 'Internal Driver Replacement',
          beamAngle: 'N/A',
          cri: 'N/A',
          luminousFlux: 'N/A',
        },
        isFeatured: false,
        isPublished: true,
        sortOrder: 1,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log('[Seed] Created products: ' + createdProducts.length);

    // 4. Seed Homepage Sections (Editable and Reorderable via Admin CMS)
    console.log('[Seed] Seeding homepage CMS sections...');
    const homepageSectionsData = [
      {
        sectionKey: 'hero',
        name: 'Hero Banner Section',
        title: 'Illuminating Architectural Masterpieces',
        subtitle: 'Decorative Solutions & Technical Precision',
        description: 'Pioneering contemporary architectural lighting fixtures, precision engineered wall luminaires, and bespoke statement chandeliers designed for world-class residential and commercial spaces.',
        images: [
          '/hero-wall-lamp.jpg',
        ],
        buttonText: 'Explore Catalog',
        buttonLink: '/catalog',
        secondaryButtonText: 'Company Profile',
        secondaryButtonLink: '/about',
        isEnabled: true,
        order: 0,
        metadata: {
          badge: '2026 Architectural Catalog Edition',
          features: [
            'Die-Cast Aluminum Engineering',
            'Museum-Grade CRI > 95 Optics',
            'Bespoke Specifier Support',
          ],
        },
      },
      {
        sectionKey: 'categories',
        name: 'Curated Categories Showcase',
        title: 'Explore By Architectural Category',
        subtitle: 'Engineered For Every Space & Elevation',
        description: 'Navigate our comprehensive range of interior sconces, suspended pendants, sculptural task lamps, and exterior facade luminaires.',
        buttonText: 'View All Categories',
        buttonLink: '/catalog',
        isEnabled: true,
        order: 1,
      },
      {
        sectionKey: 'about',
        name: 'Company Profile & Craftsmanship',
        title: 'Precision Craftsmanship Meets Optical Mastery',
        subtitle: 'About LightHut Decorative Solutions',
        description: 'With decades of dedicated expertise in architectural illumination, LightHut manufactures and supplies premier lighting fixtures engineered for high-performance residential estates, boutique hotels, and landmark commercial pavilions.',
        images: [
          '/banner-amalfi.jpg',
        ],
        buttonText: 'Read Full Company Profile',
        buttonLink: '/about',
        isEnabled: true,
        order: 2,
        metadata: {
          experienceYears: '25+',
          projectsCompleted: '1,200+',
          specifiers: '850+',
          gstNumber: '',
        },
      },
      {
        sectionKey: 'featured_products',
        name: 'Featured Luminaires Showcase',
        title: 'Curated Signature Fixtures',
        subtitle: 'Spotlight On Architectural Highlights',
        description: 'Hand-selected luminaires representing our highest echelon of optical engineering, material purity, and timeless form factor.',
        buttonText: 'Browse Full Catalog',
        buttonLink: '/catalog',
        isEnabled: true,
        order: 3,
      },
      {
        sectionKey: 'projects',
        name: 'Projects & Installation Showcase',
        title: 'Architectural Lighting In Practice',
        subtitle: 'Global Portfolios & Installed Excellence',
        description: 'From luxury seaside villas to prestigious hotel atriums, discover how our luminaires transform spatial aesthetics into immersive environments.',
        buttonText: 'View Portfolio',
        buttonLink: '/projects',
        isEnabled: true,
        order: 4,
        metadata: {
          portfolioItems: [
            {
              title: 'The Amanora Residence',
              location: 'New Delhi, India',
              category: 'Luxury Villa',
              image: '/hero-chandelier.jpg',
            },
            {
              title: 'Meridian Atrium & Spa',
              location: 'Mumbai, India',
              category: 'Hospitality',
              image: '/hero-pendant.jpg',
            },
            {
              title: 'Horizon Business Pavilion',
              location: 'Bengaluru, India',
              category: 'Commercial Headquarters',
              image: '/categories/outdoor-light.jpg',
            },
          ],
        },
      },
      {
        sectionKey: 'cta',
        name: 'Inquiry CTA',
        title: 'Need Help Choosing the Right Light?',
        subtitle: 'Our Lighting Experts Are Ready to Help',
        description: 'Whether you need a single table lamp or a complete lighting solution for a hotel project, our team is here to assist with product selection, specifications, and pricing.',
        buttonText: 'Get a Quote',
        buttonLink: '/contact',
        secondaryButtonText: 'Browse Catalog',
        secondaryButtonLink: '/catalog',
        isEnabled: true,
        order: 5,
      },
      {
        sectionKey: 'contact',
        name: 'Showroom & Contact Details',
        title: 'Visit Our Showroom',
        subtitle: 'Experience the Collection in Person',
        description: 'Come and see our full range of lighting products on display at our showroom. Our team is available to help you find the perfect lighting for your home or project.',
        buttonText: 'Contact Us',
        buttonLink: '/contact',
        isEnabled: true,
        order: 6,
      },
    ];

    await HomepageSection.insertMany(homepageSectionsData);
    console.log('[Seed] Created homepage CMS sections.');

    // 5. Seed Site Settings
    console.log('[Seed] Seeding site-wide settings...');
    await SiteSettings.create({
      companyName: 'M/S LIGHT-HUT DECORATIVE SOLUTIONS',
      tagline: 'Premium Decorative Lighting for Every Space',
      logo: '',
      favicon: '/favicon.svg',
      email: 'lighthutdecorativedlh@gmail.com',
      address: '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018',
      showroomAddress: '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018',
      worksAddress: 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)',
      mapUrl: 'https://www.google.com/maps/place//@28.6394399,77.0974272,17.01z/data=!4m6!1m5!3m4!2zMjjCsDM4JzIyLjAiTiA3N8KwMDYnMDAuMCJF!8m2!3d28.6394482!4d77.1000061?hl=en',
      mapEmbedUrl: 'https://maps.google.com/maps?q=28.6394482,77.1000061&hl=en&z=17&output=embed',
      worksMapUrl: 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en',
      socialLinks: {
        instagram: 'https://www.instagram.com/lighthutdecorativesolutions/',
        facebook: 'https://www.facebook.com/profile.php?id=61584975975926',
        pinterest: 'https://pinterest.com/lighthut',
        youtube: 'https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C',
      },
      footerContent: {
        copyrightText: '© 2026 LightHut Decorative Solutions. All Rights Reserved.',
        aboutText: 'LightHut is a premium decorative lighting brand offering wall lamps, chandeliers, pendants, table lamps, floor lamps, and outdoor lights for homes, hotels, and commercial spaces.',
        gstNumber: '',
      },
      defaultSeoTitle: 'LightHut | Premium Decorative Lighting – Wall Lamps, Chandeliers & More',
      defaultSeoDescription: 'Shop wall lamps, LED chandeliers, pendant lights, table lamps, floor lamps, and outdoor lights at LightHut – India\'s premium decorative lighting store.',
    });
    console.log('[Seed] Site settings created.');

    console.log('[Seed] ✅ LightHut catalog seeded successfully!');
    console.log(`[Seed] Categories: ${createdCategories.length}`);
    console.log(`[Seed] Products: ${createdProducts.length}`);
    if (isStandalone) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (isStandalone) process.exit(1);
    throw error;
  }
};

export const seedDatabase = seedAll;

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('seedData.js') || process.argv[1].includes('seedData'));
if (isDirectRun) {
  seedAll(true);
}
