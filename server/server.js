// Must be the first import: ES module imports are hoisted, so modules that read
// process.env at load time (e.g. config/cloudinary.js) need .env loaded before them.
import 'dotenv/config';
import express from 'express';
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

// Connect to MongoDB and Auto-seed if empty
const initDB = async () => {
  await connectDB();
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
          // If this is the chandelier category, migrate any legacy Led Chandelier subcategory
          if (cat.slug === 'chandelier') {
            const legacyLedChandelier = cat.subcategories.find(
              (s) => s.slug === 'led-chandelier' || s.name.toLowerCase() === 'led chandelier'
            );
            if (legacyLedChandelier) {
              legacyLedChandelier.name = 'Classic Chandelier';
              legacyLedChandelier.slug = 'classic-chandelier';
              legacyLedChandelier.desc = 'Architectural Geometric Rings & Heritage Centerpieces';
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

    // Auto-migrate standalone Led Chandelier to Classic Chandelier
    try {
      const existingLedChandelierCat = await Category.findOne({ slug: 'led-chandelier' });
      if (existingLedChandelierCat) {
        existingLedChandelierCat.name = 'Classic Chandelier';
        existingLedChandelierCat.slug = 'classic-chandelier';
        existingLedChandelierCat.seoTitle = 'Classic Chandeliers | LightHut';
        await existingLedChandelierCat.save();
        console.log('[Server] Migrated led-chandelier category to Classic Chandelier.');
      } else {
        const existingClassicChandelierCat = await Category.findOne({ slug: 'classic-chandelier' });
        if (!existingClassicChandelierCat) {
          await Category.create({
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
          console.log('[Server] Created standalone Classic Chandelier category in MongoDB.');
        }
      }

      const updatedProducts = await Product.updateMany(
        { subcategory: 'led-chandelier' },
        { $set: { subcategory: 'classic-chandelier', subcategoryName: 'Classic Chandelier' } }
      );
      if (updatedProducts.modifiedCount > 0) {
        console.log(`[Server] Updated ${updatedProducts.modifiedCount} product(s) to Classic Chandelier.`);
      }
    } catch (migChandelierErr) {
      console.warn('[Server] Classic Chandelier migration notice:', migChandelierErr.message);
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

// Shared DB init promise. On Vercel each cold start re-runs this; requests wait for it.
// A failed attempt is cleared so the next request retries instead of failing forever.
let dbReady = null;
const ensureDB = () => {
  if (!dbReady) {
    dbReady = initDB().catch((err) => {
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

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'operational',
    service: 'LightHut Lighting Catalog API',
    timestamp: new Date().toISOString(),
  });
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
