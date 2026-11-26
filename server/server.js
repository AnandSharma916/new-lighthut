// Must be the first import: ES module imports are hoisted, so modules that read
// process.env at load time (e.g. config/cloudinary.js) need .env loaded before them.
import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';

import Category from './models/Category.js';
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import { seedDatabase } from './scripts/seedData.js';
import { syncCatalogProducts } from './scripts/syncCatalogProducts.js';
import { removeE27Text } from './scripts/removeE27Text.js';
import { normalizeLegacySlug } from './utils/legacySlug.js';
import { CATALOG_CATEGORY_GROUPS } from './controllers/catalogController.js';

// Background database auto-sync and migrations (executed asynchronously)
const initDB = async () => {
  try {
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Server] Fresh database detected. Auto-seeding lighting catalog & admin...');
      await seedDatabase(false);
    } else {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        console.log('[Server] No admin user detected. Creating default admin account...');
        await Admin.create({
          name: process.env.ADMIN_NAME || 'LightHut Administrator',
          email: (process.env.ADMIN_EMAIL || 'admin@lighthut.com').toLowerCase().trim(),
          password: process.env.ADMIN_PASSWORD || 'admin123456',
          role: 'admin',
        });
        console.log('[Server] Default admin account ready: admin@lighthut.com / admin123456');
      }
    }

    // One-time startup migrations check: executed only once across all serverless invocations
    const migrations = Category.db.collection('migrations');
    const MIGRATION_KEY = 'server-init-chandelier-indexes-v3';
    const migrationApplied = await migrations.findOne({ _id: MIGRATION_KEY });

    if (!migrationApplied) {
      console.log('[Server] Running one-time startup migrations and indexes sync...');
      // Make SKU optional: drop legacy unique index and wipe auto-generated random SKU patterns
    try {
      await Product.collection.dropIndex('sku_1');
      console.log('[Server] Dropped legacy sku_1 unique index to allow optional empty SKUs.');
    } catch (idxErr) {
      // Index not found or already dropped
    }

    try {
      const cleaned = await Product.updateMany(
        { sku: { $regex: /^LH-\d{6}-\d{3}$/ } },
        { $set: { sku: '' } }
      );
      if (cleaned.modifiedCount > 0) {
        console.log(`[Server] Removed auto-generated random SKUs from ${cleaned.modifiedCount} product(s).`);
      }
    } catch (cleanErr) {
      console.warn('[Server] SKU cleanup warning:', cleanErr.message);
    }

    try {
      await Product.syncIndexes();
      console.log('[Server] High-performance compound indexes synced.');
    } catch (syncErr) {
      console.warn('[Server] Product index sync warning:', syncErr.message);
    }

    // Auto-sync subcategories, icon, and tag into existing Category records in MongoDB
    for (const group of CATALOG_CATEGORY_GROUPS) {
      const cat = await Category.findOne({ slug: group.slug });
      if (cat) {
        let changed = false;
        if (!cat.icon || cat.icon === '💡') {
          cat.icon = group.icon;
          changed = true;
        }
        if (!cat.tag) {
          cat.tag = group.tag;
          changed = true;
        }
        if (!cat.subcategories || cat.subcategories.length === 0) {
          if (group.subcategories && group.subcategories.length > 0) {
            cat.subcategories = group.subcategories.map((sub, idx) => ({
              name: sub.name,
              slug: sub.slug,
              image: sub.image || group.image,
              desc: sub.desc || '',
              sortOrder: idx,
              isActive: true,
            }));
            changed = true;
          }
        } else if (group.subcategories && group.subcategories.length > 0) {
          // Synchronize and normalize Chandelier subcategories
          if (cat.slug === 'chandelier') {
            const anticSub = cat.subcategories.find(
              (s) => s.slug === 'antic-chandelier' || s.name.toLowerCase().includes('antic')
            );
            if (anticSub) {
              anticSub.name = 'Antique Chandelier';
              anticSub.slug = 'antique-chandelier';
              anticSub.desc = 'Heritage Gilded & Classic Ironwork';
              if (!anticSub.image) anticSub.image = '/categories/antic-chandelier.jpg';
              changed = true;
            }

            const classicSub = cat.subcategories.find(
              (s) => s.slug === 'classic-chandelier' || s.name.toLowerCase().includes('classic')
            );
            if (classicSub) {
              classicSub.name = 'Classic Chandelier';
              classicSub.slug = 'classic-chandelier';
              classicSub.desc = 'Architectural Geometric Rings & Heritage Centerpieces';
              if (!classicSub.image) classicSub.image = '/categories/chandelier.jpg';
              changed = true;
            }

            const ledSub = cat.subcategories.find(
              (s) => s.slug === 'led-chandelier' || s.name.toLowerCase() === 'led chandelier'
            );
            if (!ledSub) {
              cat.subcategories.unshift({
                name: 'LED Chandelier',
                slug: 'led-chandelier',
                image: '/categories/chandelier.jpg',
                desc: 'Modern LED Rings & Contemporary Sculptural Centerpieces',
                sortOrder: 0,
                isActive: true,
              });
              changed = true;
            } else if (ledSub.name !== 'LED Chandelier') {
              ledSub.name = 'LED Chandelier';
              ledSub.slug = 'led-chandelier';
              changed = true;
            }
          }

          for (const sub of group.subcategories) {
            const exists = cat.subcategories.some((s) => s.slug === sub.slug);
            if (!exists) {
              cat.subcategories.push({
                name: sub.name,
                slug: sub.slug,
                image: sub.image || group.image,
                desc: sub.desc || '',
                sortOrder: cat.subcategories.length,
                isActive: true,
              });
              changed = true;
            }
          }
        }
        if (changed) {
          await cat.save();
        }
      }
    }

    // Auto-migrate and synchronize Led Chandelier & Antique Chandelier categories and products
    try {
      const chandelierParent = await Category.findOne({ slug: 'chandelier' });

      // 1. Ensure standalone Antique Chandelier is named Antique Chandelier
      const antiqueCats = await Category.find({ slug: { $in: ['antique-chandelier', 'antic-chandelier'] } });
      for (const ac of antiqueCats) {
        if (ac.name !== 'Antique Chandelier' || ac.slug !== 'antique-chandelier') {
          ac.name = 'Antique Chandelier';
          ac.slug = 'antique-chandelier';
          ac.seoTitle = 'Antique Chandeliers | LightHut';
          await ac.save();
        }
      }
      if (antiqueCats.length === 0) {
        await Category.create({
          name: 'Antique Chandelier',
          slug: 'antique-chandelier',
          icon: '✨',
          tag: 'Heritage Gilded & Classic Ironwork',
          description: 'Timeless antique, rustic, and artisan wrought iron chandeliers crafted for heritage estates and luxury dining.',
          image: '/categories/antic-chandelier.jpg',
          sortOrder: 22,
          isActive: true,
          seoTitle: 'Antique Chandeliers | LightHut',
          seoDescription: 'Shop handcrafted antique chandeliers in brass, wrought iron, and heritage finishes.',
          subcategories: [],
        });
      }

      // 2. Ensure standalone LED Chandelier & Classic Chandelier
      let standaloneLed = await Category.findOne({ slug: 'led-chandelier' });
      if (!standaloneLed) {
        standaloneLed = await Category.create({
          name: 'LED Chandelier',
          slug: 'led-chandelier',
          icon: '✨',
          tag: 'Modern LED Rings & Centerpieces',
          description: 'Contemporary architectural LED chandeliers featuring geometric silhouettes and integrated high-efficiency LED modules.',
          image: '/categories/chandelier.jpg',
          sortOrder: 20,
          isActive: true,
          seoTitle: 'LED Chandeliers | LightHut',
          seoDescription: 'Shop modern architectural LED chandeliers.',
          subcategories: [],
        });
      } else if (standaloneLed.name !== 'LED Chandelier') {
        standaloneLed.name = 'LED Chandelier';
        await standaloneLed.save();
      }

      let standaloneClassic = await Category.findOne({ slug: 'classic-chandelier' });
      if (!standaloneClassic) {
        standaloneClassic = await Category.create({
          name: 'Classic Chandelier',
          slug: 'classic-chandelier',
          icon: '✨',
          tag: 'Heritage & Grand Statement Centerpieces',
          description: 'Timeless classic and architectural chandeliers crafted for luxury dining, living rooms, and lobbies.',
          image: '/categories/chandelier.jpg',
          sortOrder: 21,
          isActive: true,
          seoTitle: 'Classic Chandeliers | LightHut',
          seoDescription: 'Shop handcrafted classic chandeliers in crystal, brass, and artisanal finishes.',
          subcategories: [],
        });
      } else if (standaloneClassic.name !== 'Classic Chandelier') {
        standaloneClassic.name = 'Classic Chandelier';
        await standaloneClassic.save();
      }

      // 3. Migrate Products assigned to standalone Antique Chandelier or with legacy 'antic' slugs
      if (chandelierParent) {
        const antiqueCatIds = (await Category.find({ slug: { $in: ['antique-chandelier', 'antic-chandelier'] } }).select('_id')).map(c => c._id);

        // Reassign products saved under standalone antique category to parent Chandelier with subcategory
        const remappedStandalone = await Product.updateMany(
          { category: { $in: antiqueCatIds } },
          { $set: { category: chandelierParent._id, subcategory: 'antique-chandelier', subcategoryName: 'Antique Chandelier' } }
        );
        if (remappedStandalone.modifiedCount > 0) {
          console.log(`[Server] Reassigned ${remappedStandalone.modifiedCount} product(s) from standalone antique category to Chandelier -> Antique Chandelier.`);
        }

        // Fix products matching 4012 (e.g. LH-4012/5L)
        const remapped4012 = await Product.updateMany(
          { name: /4012/i },
          { $set: { category: chandelierParent._id, subcategory: 'antique-chandelier', subcategoryName: 'Antique Chandelier' } }
        );
        if (remapped4012.modifiedCount > 0) {
          console.log(`[Server] Ensured product 4012 is assigned to Chandelier -> Antique Chandelier.`);
        }

        // Reassign products with antic-chandelier subcategory to antique-chandelier
        const updatedAnticSubs = await Product.updateMany(
          { subcategory: { $in: ['antic-chandelier', 'antic'] } },
          { $set: { subcategory: 'antique-chandelier', subcategoryName: 'Antique Chandelier' } }
        );
        if (updatedAnticSubs.modifiedCount > 0) {
          console.log(`[Server] Updated ${updatedAnticSubs.modifiedCount} product(s) to subcategory antique-chandelier.`);
        }

        // Ensure Fan Chandelier products get assigned to fan-chandelier
        await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /FAN/i }, { sku: /FAN/i }]
          },
          { $set: { subcategory: 'fan-chandelier', subcategoryName: 'Fan chandelier' } }
        );

        // Ensure Profile Chandelier products get assigned to profile-chandelier
        await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /PROFILE/i }, { sku: /PROFILE/i }, { name: /B2045/i }, { sku: /B2045/i }]
          },
          { $set: { subcategory: 'profile-chandelier', subcategoryName: 'Profile Chandelier' } }
        );

        // Ensure Modern Chandelier products get assigned to modern-chandelier
        await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /MODERN/i }, { sku: /MODERN/i }, { name: /9629/i }, { sku: /9629/i }]
          },
          { $set: { subcategory: 'modern-chandelier', subcategoryName: 'Modern chandelier' } }
        );

        // Ensure E14 Chandelier products get assigned to e14-chandelier
        await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /E14/i }, { sku: /E14/i }, { name: /8051/i }, { sku: /8051/i }, { name: /6098/i }, { name: /7688/i }]
          },
          { $set: { subcategory: 'e14-chandelier', subcategoryName: 'E14 Chandelier' } }
        );

        // Assign products with LED in title or sku under Chandelier that have an empty subcategory to led-chandelier
        const remappedLedProducts = await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /LED/i }, { sku: /LED/i }],
            subcategory: { $in: ['', null] }
          },
          { $set: { subcategory: 'led-chandelier', subcategoryName: 'LED Chandelier' } }
        );
        if (remappedLedProducts.modifiedCount > 0) {
          console.log(`[Server] Assigned ${remappedLedProducts.modifiedCount} LED chandelier product(s) to subcategory led-chandelier.`);
        }

        // Assign products with GLASS in title or sku under Chandelier that have an empty subcategory to glass-chandelier
        const remappedGlassProducts = await Product.updateMany(
          {
            category: chandelierParent._id,
            $or: [{ name: /GLASS/i }, { sku: /GLASS/i }],
            subcategory: { $in: ['', null] }
          },
          { $set: { subcategory: 'glass-chandelier', subcategoryName: 'Glass Chandelier' } }
        );
        if (remappedGlassProducts.modifiedCount > 0) {
          console.log(`[Server] Assigned ${remappedGlassProducts.modifiedCount} Glass chandelier product(s) to subcategory glass-chandelier.`);
        }

        // Assign remaining Chandelier products with empty subcategory to classic-chandelier
        const remappedClassicProducts = await Product.updateMany(
          {
            category: chandelierParent._id,
            subcategory: { $in: ['', null] }
          },
          { $set: { subcategory: 'classic-chandelier', subcategoryName: 'Classic Chandelier' } }
        );
        if (remappedClassicProducts.modifiedCount > 0) {
          console.log(`[Server] Assigned ${remappedClassicProducts.modifiedCount} Classic chandelier product(s) to subcategory classic-chandelier.`);
        }

        // Standardize Classic Chandelier subcategory names
        await Product.updateMany(
          { subcategory: 'classic-chandelier' },
          { $set: { subcategoryName: 'Classic Chandelier' } }
        );

        // Standardize LED Chandelier subcategory names
        await Product.updateMany(
          { subcategory: 'led-chandelier' },
          { $set: { subcategoryName: 'LED Chandelier' } }
        );

        // Replace 'Antic' with 'Antique' in product titles
        const anticTitleProducts = await Product.find({ name: /antic/i });
        for (const p of anticTitleProducts) {
          p.name = p.name.replace(/antic/gi, (match) => match === 'ANTIC' ? 'ANTIQUE' : match === 'Antic' ? 'Antique' : 'antique');
          if (p.shortDescription) {
            p.shortDescription = p.shortDescription.replace(/antic/gi, (match) => match === 'ANTIC' ? 'ANTIQUE' : match === 'Antic' ? 'Antique' : 'antique');
          }
          if (p.description) {
            p.description = p.description.replace(/antic/gi, (match) => match === 'ANTIC' ? 'ANTIQUE' : match === 'Antic' ? 'Antique' : 'antique');
          }
          await p.save();
        }
        if (anticTitleProducts.length > 0) {
          console.log(`[Server] Normalized spelling from Antic to Antique in ${anticTitleProducts.length} product(s).`);
        }
      }
    } catch (migChandelierErr) {
      console.warn('[Server] Chandelier synchronization notice:', migChandelierErr.message);
    }

    // Ensure standalone Outdoor Hanging Lamp category exists for direct category queries
    try {
      const existingHangingCat = await Category.findOne({ slug: 'outdoor-hanging-lamp' });
      if (!existingHangingCat) {
        await Category.create({
          name: 'Outdoor Hanging Lamp',
          slug: 'outdoor-hanging-lamp',
          icon: '🌿',
          tag: 'Suspended Exterior Weatherproof Fixtures',
          description: 'Weatherproof outdoor hanging lamps and exterior pendants for porches, gazebos, and entrance canopies.',
          image: '/categories/outdoor-light.jpg',
          sortOrder: 53,
          isActive: true,
          seoTitle: 'Outdoor Hanging Lamps | LightHut',
          seoDescription: 'Weatherproof IP-rated outdoor hanging lamps and pendants.',
          subcategories: [],
        });
        console.log('[Server] Created standalone Outdoor Hanging Lamp category in MongoDB.');
      }
    } catch (hangingCatErr) {
      console.warn('[Server] Outdoor Hanging Lamp standalone creation notice:', hangingCatErr.message);
    }

    // Ensure standalone LED Profile Pendant category exists for direct category queries
    try {
      const existingProfilePendantCat = await Category.findOne({ slug: 'led-profile-pendant' });
      if (!existingProfilePendantCat) {
        await Category.create({
          name: 'LED Profile Pendant',
          slug: 'led-profile-pendant',
          icon: '🔆',
          tag: 'Architectural Linear & Geometric Suspensions',
          description: 'Contemporary LED linear profile pendants and geometric architectural suspension lights for offices, dining, and open ceilings.',
          image: '/categories/profile-chandelier.jpg',
          sortOrder: 13,
          isActive: true,
          seoTitle: 'LED Profile Pendants | LightHut',
          seoDescription: 'Architectural LED linear and geometric profile pendant lighting fixtures.',
          subcategories: [],
        });
        console.log('[Server] Created standalone LED Profile Pendant category in MongoDB.');
      }
    } catch (profilePendantCatErr) {
      console.warn('[Server] LED Profile Pendant standalone creation notice:', profilePendantCatErr.message);
    }

    try {
      await migrations.insertOne({ _id: MIGRATION_KEY, appliedAt: new Date() });
      console.log('[Server] Startup migrations completed and marked as applied.');
    } catch (migRecordErr) {
      // Ignored if already inserted
    }
  }
  } catch (err) {
    console.warn('[Server] Auto-seed/sync check notice:', err.message);
  }

  // Before the catalogue sync, so existing products already carry the current slugs
  try {
    await removeE27Text();
  } catch (err) {
    console.warn('[Server] E27 cleanup notice:', err.message);
  }

  try {
    await syncCatalogProducts();
  } catch (err) {
    console.warn('[Server] Catalogue product sync notice:', err.message);
  }
};

let migrationsExecuted = false;
const runBackgroundTasks = async () => {
  if (migrationsExecuted) return;
  migrationsExecuted = true;
  await initDB();
};

// Shared DB connection promise. On Vercel each cold start connects in ~150ms.
// Background sync and migrations run asynchronously without blocking API requests.
let dbReady = null;
const ensureDB = async () => {
  if (Category.db?.readyState === 1) return;
  if (!dbReady) {
    dbReady = connectDB()
      .then(() => {
        runBackgroundTasks().catch((err) => {
          console.warn('[Server] Background task notice:', err.message);
        });
      })
      .catch((err) => {
        dbReady = null;
        throw err;
      });
  }
  return dbReady;
};
ensureDB().catch((err) => console.error('[DB] Initial connection failed:', err.message));

const app = express();

// Behind Vercel / Render proxies: needed for correct client IPs in rate limiting
app.set('trust proxy', 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows images to be displayed in frontend
  })
);

// High-speed HTTP response compression (gzip/deflate) to drastically reduce TTFB and payload size
app.use(compression());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed list or Vercel domains or allow all in production/development
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        !process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting on authentication and public inquiry submissions
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // max 20 inquiries per IP per hour
  message: { success: false, message: 'Too many inquiries submitted from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve local uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve public assets (categories, banners, certificates, catalog PDF)
app.use(express.static(path.join(__dirname, '../client/public')));

// Diagnostic check: Two-Stage Query vs Single-Stage Query
app.get('/api/health/diagnostics', async (req, res) => {
  try {
    await ensureDB();
    const t0 = Date.now();
    // Step 1: Index-only scan for 12 IDs
    const idDocs = await Product.find({ isPublished: true })
      .select('_id')
      .sort({ subcategory: 1, isFeatured: -1, sortOrder: 1, createdAt: -1 })
      .limit(12)
      .lean();
    const tStep1 = Date.now() - t0;

    // Step 2: Fetch only those 12 documents by ID
    const t1 = Date.now();
    const ids = idDocs.map((d) => d._id);
    const rawProducts = await Product.find({ _id: { $in: ids } })
      .populate('category', 'name slug')
      .lean();
    const tStep2 = Date.now() - t1;

    res.status(200).json({
      success: true,
      tStep1IdsMs: tStep1,
      tStep2DocsMs: tStep2,
      totalTwoStageMs: Date.now() - t0,
      count: rawProducts.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Keep old e27 category/product links working (e.g. ?category=e27-wall-lamp)
app.use('/api', (req, res, next) => {
  if (req.url.includes('e27')) {
    req.url = normalizeLegacySlug(req.url);
    for (const [key, value] of Object.entries(req.query)) {
      req.query[key] = normalizeLegacySlug(value);
    }
  }
  next();
});

// Wait for the database before handling any other API request
app.use('/api', async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/inquiries', inquiryLimiter, inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/catalog', catalogRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// On Vercel the app is exported as a serverless handler (see /api/index.js), not listened on
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] LightHut API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Server Error] Unhandled Rejection:', err);
});

// LightHut API Server - Live
export default app;
