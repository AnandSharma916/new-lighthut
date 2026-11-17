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

    // Auto-restore correct original images for LH-218GL Gate Lamp & LH-812 Hanging Lamp
    try {
      await Product.updateMany(
        { $or: [{ name: /218GL/i }, { sku: /CLASSIC DESIGN-1/i }, { name: /LH-218/i }] },
        {
          $set: {
            images: [
              {
                url: '/products/gate-lamp/lh-218-gate-outdoor-gate-lamp.jpg',
                alt: 'LH-218GL BLACK',
                isCover: true,
              },
              {
                url: '/products/gate-lamp/lh-218-gate-outdoor-gate-lamp-full.jpg',
                alt: 'LH-218GL BLACK Installed View',
                isCover: false,
              },
            ],
            mainImage: '/products/gate-lamp/lh-218-gate-outdoor-gate-lamp.jpg',
          },
        }
      );
      console.log('[Server] Auto-restored LH-218GL Gate Lamp original photos.');

      await Product.updateMany(
        { $or: [{ name: /812/i }, { sku: /LH-666415-555/i }, { sku: /LH-812/i }] },
        {
          $set: {
            images: [
              {
                url: '/products/led-hanging-lamp/lh-812-1l-3l-led-hanging-lamp.jpg',
                alt: 'LH-812/1L LED HANGING LAMP',
                isCover: true,
              },
              {
                url: '/products/led-hanging-lamp/lh-812-1l-3l-led-hanging-lamp-full.jpg',
                alt: 'LH-812/1L LED HANGING LAMP Installed View',
                isCover: false,
              },
            ],
            mainImage: '/products/led-hanging-lamp/lh-812-1l-3l-led-hanging-lamp.jpg',
          },
        }
      );
      console.log('[Server] Auto-restored LH-812 LED Hanging Lamp original photos.');
    } catch (restoreErr) {
      console.warn('[Server] Product photo restore warning:', restoreErr.message);
    }

    // Auto-heal random timestamp SKUs (e.g. LH-426162-413 -> LH-920GL)
    try {
      await Product.updateMany(
        { $or: [{ name: /920GL/i }, { slug: /920gl/i }, { sku: /LH-426162-413/i }] },
        { $set: { sku: 'LH-920GL' } }
      );

      const randomSkuProducts = await Product.find({ sku: /^LH-\d{5,8}-\d{3,4}$/ });
      for (const p of randomSkuProducts) {
        const lhMatch = (p.name || '').match(/\b(LH-[A-Za-z0-9\/-]+)/i);
        if (lhMatch) {
          const cleanSku = lhMatch[1].toUpperCase();
          const collision = await Product.findOne({ sku: cleanSku, _id: { $ne: p._id } });
          if (!collision) {
            p.sku = cleanSku;
            await p.save();
          }
        }
      }
      console.log('[Server] Auto-healed random timestamp SKUs.');
    } catch (skuErr) {
      console.warn('[Server] SKU heal warning:', skuErr.message);
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
        }
        if (changed) {
          await cat.save();
        }
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
