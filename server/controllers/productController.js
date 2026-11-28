import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';
import { clearCatalogCache, getCachedQueryResult, setCachedQueryResult } from '../utils/catalogCache.js';

const CATEGORY_FAMILY_MAP = {
  'pendant-lamp': ['pendant-lamp', 'led-hanging-lamp', 'classic-hanging-lamp', 'led-profile-pendant', 'profile-pendant', 'pendant'],
  'led-profile-pendant': ['led-profile-pendant', 'profile-pendant'],
  'wall-lamp': ['wall-lamp', 'led-wall-lamp', 'classic-wall-lamp', 'wall'],
  'chandelier': [
    'chandelier',
    'classic-chandelier',
    'led-chandelier',
    'e14-chandelier',
    'profile-chandelier',
    'glass-chandelier',
    'italian-chandelier',
    'modern-chandelier',
    'antique-chandelier',
    'antic-chandelier',
    'fan-chandelier',
    'ceiling-chandelier',
  ],
  'classic-chandelier': ['classic-chandelier', 'chandelier'],
  'led-chandelier': ['led-chandelier', 'chandelier'],
  'antique-chandelier': ['antique-chandelier', 'antic-chandelier', 'chandelier'],
  'antic-chandelier': ['antique-chandelier', 'antic-chandelier', 'chandelier'],
  'double-height': ['double-height', 'crystal-chandelier', 'modern-double-height-chandelier'],
  'outdoor-light': ['outdoor-light', 'gate-lamp', 'outdoor-wall-lamp', 'outdoor-hanging-lamp', 'outdoor'],
  'outdoor-hanging-lamp': ['outdoor-hanging-lamp', 'outdoor-hanging', 'hanging-lamp'],
  'spare-part': ['spare-part', 'hanging-base', 'spare-driver', 'spares'],
  'dining-table-lamp': ['dining-table-lamp', 'dining'],
  'table-lamp': ['table-lamp', 'table'],
  'floor-lamp': ['floor-lamp', 'floor'],
  'led-filament-bulb': ['led-filament-bulb', 'filament'],
};

export const STANDALONE_SUBCAT_MAP = {
  'antique-chandelier': { parentSlug: 'chandelier', subcategory: 'antique-chandelier', subcategoryName: 'Antique Chandelier' },
  'antic-chandelier': { parentSlug: 'chandelier', subcategory: 'antique-chandelier', subcategoryName: 'Antique Chandelier' },
  'classic-chandelier': { parentSlug: 'chandelier', subcategory: 'classic-chandelier', subcategoryName: 'Classic Chandelier' },
  'led-chandelier': { parentSlug: 'chandelier', subcategory: 'led-chandelier', subcategoryName: 'LED Chandelier' },
  'e14-chandelier': { parentSlug: 'chandelier', subcategory: 'e14-chandelier', subcategoryName: 'E14 Chandelier' },
  'profile-chandelier': { parentSlug: 'chandelier', subcategory: 'profile-chandelier', subcategoryName: 'Profile Chandelier' },
  'glass-chandelier': { parentSlug: 'chandelier', subcategory: 'glass-chandelier', subcategoryName: 'Glass Chandelier' },
  'italian-chandelier': { parentSlug: 'chandelier', subcategory: 'italian-chandelier', subcategoryName: 'Italian Chandelier' },
  'modern-chandelier': { parentSlug: 'chandelier', subcategory: 'modern-chandelier', subcategoryName: 'Modern Chandelier' },
  'fan-chandelier': { parentSlug: 'chandelier', subcategory: 'fan-chandelier', subcategoryName: 'Fan Chandelier' },
  'ceiling-chandelier': { parentSlug: 'chandelier', subcategory: 'ceiling-chandelier', subcategoryName: 'Ceiling Chandelier' },
  'crystal-chandelier': { parentSlug: 'double-height', subcategory: 'crystal-chandelier', subcategoryName: 'Crystal Chandelier' },
  'modern-double-height-chandelier': { parentSlug: 'double-height', subcategory: 'modern-chandelier-dh', subcategoryName: 'Modern Chandelier' },
  'gate-lamp': { parentSlug: 'outdoor-light', subcategory: 'gate-lamp', subcategoryName: 'Gate Lamp' },
  'outdoor-wall-lamp': { parentSlug: 'outdoor-light', subcategory: 'outdoor-wall-lamp', subcategoryName: 'Wall Lamp' },
  'outdoor-hanging-lamp': { parentSlug: 'outdoor-light', subcategory: 'outdoor-hanging-lamp', subcategoryName: 'Hanging Lamp' },
  'led-hanging-lamp': { parentSlug: 'pendant-lamp', subcategory: 'led-hanging-lamp', subcategoryName: 'Led Hanging Lamp' },
  'classic-hanging-lamp': { parentSlug: 'pendant-lamp', subcategory: 'classic-hanging-lamp', subcategoryName: 'Hanging Lamp' },
  'led-profile-pendant': { parentSlug: 'pendant-lamp', subcategory: 'led-profile-pendant', subcategoryName: 'LED Profile Pendant' },
  'led-wall-lamp': { parentSlug: 'wall-lamp', subcategory: 'led-wall-lamp', subcategoryName: 'Led Wall Lamp' },
  'classic-wall-lamp': { parentSlug: 'wall-lamp', subcategory: 'classic-wall-lamp', subcategoryName: 'Wall Lamp' },
  'hanging-base': { parentSlug: 'spare-part', subcategory: 'hanging-base', subcategoryName: 'Hanging Base' },
  'spare-driver': { parentSlug: 'spare-part', subcategory: 'spare-driver', subcategoryName: 'Spare Driver' },
};

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      sub,
      search,
      featured,
      published,
      finish,
      material,
      cct,
      colorTemperature,
      ipRating,
      installationType,
      minPrice,
      maxPrice,
      sort = 'sortOrder',
      page = 1,
      limit = 12,
      admin = 'false',
    } = req.query;

    const isPublicQuery = admin !== 'true';
    const cacheKey = isPublicQuery ? `products_${JSON.stringify(req.query)}` : null;
    if (cacheKey) {
      const cached = getCachedQueryResult(cacheKey);
      if (cached) {
        res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
        return res.status(200).json(cached);
      }
    }

    const query = {};

    // For public website, only return published products unless admin explicitly requests all
    if (admin === 'true') {
      if (published !== undefined && published !== '') {
        query.isPublished = published === 'true';
      }
    } else {
      query.isPublished = true;
    }

    // Filter by featured
    if (featured !== undefined && featured !== '') {
      query.isFeatured = featured === 'true';
    }

    // Filter by subcategory (if provided directly or via standalone category)
    let effectiveCategory = category;
    let targetSub = (subcategory || sub || '').trim().toLowerCase();

    if (effectiveCategory && STANDALONE_SUBCAT_MAP[effectiveCategory]) {
      const mapping = STANDALONE_SUBCAT_MAP[effectiveCategory];
      effectiveCategory = mapping.parentSlug;
      if (!targetSub) {
        targetSub = mapping.subcategory;
      }
    }

    if (targetSub && targetSub !== 'all') {
      const cleanSub = targetSub.replace(/[-_]/g, ' ');
      const subConditions = [
        { subcategory: new RegExp(`^${targetSub}$`, 'i') },
        { subcategory: new RegExp(`^${cleanSub}$`, 'i') },
        { subcategoryName: new RegExp(`^${cleanSub}$`, 'i') },
      ];
      if (targetSub.includes('wall')) {
        subConditions.push({ subcategory: /wall/i });
        subConditions.push({ subcategoryName: /wall/i });
      } else if (targetSub.includes('gate')) {
        subConditions.push({ subcategory: /gate/i });
        subConditions.push({ subcategoryName: /gate/i });
      } else if (targetSub.includes('antic') || targetSub.includes('antique')) {
        subConditions.push({ subcategory: /antic-chandelier|antique-chandelier/i });
        subConditions.push({ subcategoryName: /antic|antique/i });
        subConditions.push({ name: /4012|antic|antique/i });
        subConditions.push({ sku: /4012|antic|antique/i });
      } else if (targetSub === 'led-chandelier' || targetSub === 'led chandelier') {
        const ledCats = await Category.find({ slug: 'led-chandelier' }).select('_id');
        subConditions.push({
          $and: [
            {
              $or: [
                { subcategory: /^led-chandelier$/i },
                { subcategoryName: /^led chandelier$/i },
                { name: /\bled\b/i },
                { sku: /\bled\b/i },
                ...(ledCats.length > 0 ? [{ category: { $in: ledCats.map(lc => lc._id) } }] : [])
              ]
            },
            {
              subcategory: {
                $nin: [
                  'profile-chandelier',
                  'modern-chandelier',
                  'fan-chandelier',
                  'e14-chandelier',
                  'glass-chandelier',
                  'antique-chandelier',
                  'antic-chandelier',
                  'classic-chandelier',
                  'italian-chandelier',
                  'crystal-chandelier',
                  'ceiling-chandelier',
                ]
              }
            }
          ]
        });
      } else if (targetSub === 'glass-chandelier' || targetSub === 'glass chandelier') {
        subConditions.push({ subcategory: /glass-chandelier/i });
        subConditions.push({ subcategoryName: /glass/i });
        subConditions.push({ name: /glass/i });
        subConditions.push({ sku: /glass/i });
        const glassCats = await Category.find({ slug: 'glass-chandelier' }).select('_id');
        glassCats.forEach(gc => subConditions.push({ category: gc._id }));
      } else if (targetSub === 'classic-chandelier' || targetSub === 'classic chandelier') {
        subConditions.push({ subcategory: /classic-chandelier/i });
        subConditions.push({ subcategoryName: /classic/i });
        const classicCats = await Category.find({ slug: 'classic-chandelier' }).select('_id');
        classicCats.forEach(cc => subConditions.push({ category: cc._id }));
      } else if (targetSub === 'fan-chandelier' || targetSub === 'fan chandelier') {
        subConditions.push({ subcategory: /fan-chandelier/i });
        subConditions.push({ subcategoryName: /fan/i });
        subConditions.push({ name: /fan/i });
        subConditions.push({ sku: /fan/i });
        const fanCats = await Category.find({ slug: 'fan-chandelier' }).select('_id');
        fanCats.forEach(fc => subConditions.push({ category: fc._id }));
      } else if (targetSub === 'profile-chandelier' || targetSub === 'profile chandelier') {
        subConditions.push({ subcategory: /profile-chandelier/i });
        subConditions.push({ subcategoryName: /profile/i });
        subConditions.push({ name: /profile/i });
        const profileCats = await Category.find({ slug: 'profile-chandelier' }).select('_id');
        profileCats.forEach(pc => subConditions.push({ category: pc._id }));
      } else if (targetSub === 'modern-chandelier' || targetSub === 'modern chandelier') {
        subConditions.push({ subcategory: /modern-chandelier/i });
        subConditions.push({ subcategoryName: /modern/i });
        subConditions.push({ name: /modern/i });
        const modernCats = await Category.find({ slug: 'modern-chandelier' }).select('_id');
        modernCats.forEach(mc => subConditions.push({ category: mc._id }));
      } else if (targetSub === 'e14-chandelier' || targetSub === 'e14 chandelier') {
        subConditions.push({ subcategory: /e14-chandelier/i });
        subConditions.push({ subcategoryName: /e14/i });
        subConditions.push({ name: /e14/i });
        subConditions.push({ sku: /e14/i });
        const e14Cats = await Category.find({ slug: 'e14-chandelier' }).select('_id');
        e14Cats.forEach(ec => subConditions.push({ category: ec._id }));
      } else if (targetSub === 'italian-chandelier' || targetSub === 'italian chandelier') {
        subConditions.push({ subcategory: /italian-chandelier/i });
        subConditions.push({ subcategoryName: /italian/i });
        subConditions.push({ name: /italian/i });
        subConditions.push({ sku: /italian/i });
        const italianCats = await Category.find({ slug: 'italian-chandelier' }).select('_id');
        italianCats.forEach(ic => subConditions.push({ category: ic._id }));
      } else if (targetSub === 'crystal-chandelier' || targetSub === 'crystal chandelier') {
        subConditions.push({ subcategory: /crystal-chandelier/i });
        subConditions.push({ subcategoryName: /crystal/i });
        subConditions.push({ name: /crystal/i });
        const crystalCats = await Category.find({ slug: 'crystal-chandelier' }).select('_id');
        crystalCats.forEach(cc => subConditions.push({ category: cc._id }));
      }
      query.$or = query.$or ? [...query.$or, ...subConditions] : subConditions;
    }

    // Filter by category (can be slug or category ID)
    if (effectiveCategory && effectiveCategory !== 'all') {
      if (effectiveCategory.match(/^[0-9a-fA-F]{24}$/)) {
        if (query.$or) {
          query.$and = [{ category: effectiveCategory }, { $or: query.$or }];
          delete query.$or;
        } else {
          query.category = effectiveCategory;
        }
      } else {
        const familySlugs = CATEGORY_FAMILY_MAP[effectiveCategory] || [effectiveCategory];
        const baseSlug = effectiveCategory.replace(/-lamp$/, '').replace(/-light$/, '');
        const matchingCategories = await Category.find({
          $or: [
            { slug: { $in: familySlugs } },
            { slug: effectiveCategory },
            { slug: new RegExp(effectiveCategory, 'i') },
            { slug: new RegExp(baseSlug, 'i') },
            { name: new RegExp(baseSlug, 'i') },
          ],
        });

        if (matchingCategories.length > 0) {
          const catIds = matchingCategories.map((c) => c._id);
          if (query.$or) {
            query.$and = [{ category: { $in: catIds } }, { $or: query.$or }];
            delete query.$or;
          } else {
            query.category = { $in: catIds };
          }
        } else {
          return res.status(200).json({
            success: true,
            products: [],
            total: 0,
            page: Number(page),
            totalPages: 0,
          });
        }
      }
    }

    // Specification Filters
    if (finish && finish.trim() !== '') {
      query['specifications.finish'] = new RegExp(finish.trim(), 'i');
    }
    if (material && material.trim() !== '') {
      query['specifications.material'] = new RegExp(material.trim(), 'i');
    }
    const targetCCT = (cct || colorTemperature || '').trim();
    if (targetCCT) {
      query['specifications.colorTemperature'] = new RegExp(targetCCT, 'i');
    }
    if (ipRating && ipRating.trim() !== '') {
      query['specifications.ipRating'] = new RegExp(ipRating.trim(), 'i');
    }
    if (installationType && installationType.trim() !== '') {
      query['specifications.installationType'] = new RegExp(installationType.trim(), 'i');
    }

    // Price Range Filter
    if (minPrice !== undefined && minPrice !== '' || maxPrice !== undefined && maxPrice !== '') {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Search query: search by name, SKU, shortDescription, or material
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { shortDescription: searchRegex },
        { 'specifications.material': searchRegex },
        { 'specifications.finish': searchRegex },
      ];
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'price_asc':
        sortOption = { price: 1, createdAt: -1 };
        break;
      case 'price_desc':
        sortOption = { price: -1, createdAt: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'sku_asc':
        sortOption = { sku: 1 };
        break;
      case 'sortOrder':
      default:
        sortOption = { sortOrder: 1, createdAt: -1 };
        break;
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const isAdmin = admin === 'true';

    let productQuery = Product.find(query)
      .allowDiskUse(true)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean();

    if (!isAdmin) {
      // Exclude base64 image data from MongoDB WAN transfer for instant response
      productQuery = productQuery.select({ 'images.url': 0 });
    }

    const [total, rawProducts] = await Promise.all([
      Product.countDocuments(query),
      productQuery,
    ]);

    const products = isAdmin
      ? rawProducts
      : rawProducts.map((p) => {
          const coverUrl = `/api/products/${p._id}/image/cover`;
          const hasSecondary = Array.isArray(p.images) && p.images.length > 1;
          const hoverUrl = hasSecondary ? `/api/products/${p._id}/image/1` : coverUrl;

          return {
            ...p,
            images: [
              { url: coverUrl, isCover: true, alt: p.name },
              ...(hasSecondary ? [{ url: hoverUrl, isCover: false, alt: `${p.name} Alternate` }] : [])
            ],
            primaryImage: coverUrl,
            secondaryImage: hoverUrl,
          };
        });

    const payload = {
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      products,
    };

    if (cacheKey) {
      setCachedQueryResult(cacheKey, payload);
      res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    }

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with slug '${req.params.slug}' not found.`,
      });
    }

    // Find related products in the same category (safely guarded)
    const categoryId = product.category?._id || product.category;
    let relatedProducts = [];
    if (categoryId) {
      const rawRelated = await Product.find({
        category: categoryId,
        _id: { $ne: product._id },
        isPublished: true,
      })
        .select({ 'images.url': 0 })
        .populate('category', 'name slug')
        .limit(12)
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();

      relatedProducts = rawRelated.map((p) => {
        const coverUrl = `/api/products/${p._id}/image/cover`;
        const hasSecondary = Array.isArray(p.images) && p.images.length > 1;
        const hoverUrl = hasSecondary ? `/api/products/${p._id}/image/1` : coverUrl;

        return {
          ...p,
          images: [
            { url: coverUrl, isCover: true, alt: p.name },
            ...(hasSecondary ? [{ url: hoverUrl, isCover: false, alt: `${p.name} Alternate` }] : [])
          ],
          primaryImage: coverUrl,
          secondaryImage: hoverUrl,
        };
      });
    }

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stream product image binary with permanent CDN caching
// @route   GET /api/products/:id/image/:imageIndex?
// @access  Public
export const getProductImage = async (req, res, next) => {
  try {
    const { id, imageIndex } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const product = await Product.findOne(
      isObjectId ? { _id: id } : { slug: id }
    )
      .select('images mainImage category')
      .populate('category', 'image');

    let imgUrl = null;
    if (product) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        let img;
        if (imageIndex === 'cover' || imageIndex === undefined) {
          img = product.images.find((i) => i.isCover) || product.images[0];
        } else {
          const idx = parseInt(imageIndex, 10) || 0;
          img = product.images[idx] || product.images[0];
        }
        imgUrl = img?.url;
      }
      if (!imgUrl && product.mainImage) {
        imgUrl = product.mainImage;
      }
      if (!imgUrl && product.category?.image) {
        imgUrl = product.category.image;
      }
    }

    if (!imgUrl) {
      return res.redirect('/showroom-hero-hd.jpg');
    }

    // If it's already an external or static file path (e.g. /products/...)
    if (!imgUrl.startsWith('data:image')) {
      res.set('Cache-Control', 'public, max-age=86400');
      return res.redirect(imgUrl);
    }

    // Base64 data URL
    const matches = imgUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches) {
      return res.redirect('/showroom-hero-hd.jpg');
    }

    const contentType = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(imageBuffer);
  } catch (err) {
    res.redirect('/showroom-hero-hd.jpg');
  }
};

// @desc    Get single product by ID (Admin)
// @route   GET /api/products/id/:id
// @access  Private (Admin)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to normalize product images into valid schema objects with deduplication
export const normalizeProductImages = (images = [], mainImage = '', defaultAlt = '') => {
  const cleanUrl = (u) => (typeof u === 'string' ? u.trim() : '');

  const isPlaceholder = (u = '') => {
    const s = String(u || '').toLowerCase().trim();
    if (!s) return true;
    if (s.startsWith('data:image/') || s.includes('res.cloudinary.com')) return false;
    return (
      s.includes('/categories/') ||
      s.includes('chandelier') ||
      s.includes('placeholder') ||
      s.includes('hero-chandelier') ||
      s.includes('philosophy-grand-chandelier') ||
      s.includes('craft-main') ||
      s.includes('showroom-hero') ||
      s.includes('double-height.jpg')
    );
  };

  // Normalized key for deduplication
  const getCanonicalKey = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) {
      return url.slice(0, 100);
    }
    try {
      const parsed = new URL(url, 'http://localhost');
      return (parsed.pathname + parsed.search).replace(/\/+/g, '/').toLowerCase();
    } catch {
      return url.trim().replace(/\/+/g, '/').toLowerCase();
    }
  };

  // Determine cover URL:
  // Priority 1: explicitly marked cover in images array
  // Priority 2: mainImage passed
  // Priority 3: first valid image URL
  let targetCoverUrl = '';
  if (Array.isArray(images)) {
    const explicitCover = images.find(
      (img) => img && typeof img === 'object' && img.isCover && cleanUrl(img.url)
    );
    if (explicitCover) {
      targetCoverUrl = cleanUrl(explicitCover.url);
    }
  }

  if (!targetCoverUrl && cleanUrl(mainImage)) {
    targetCoverUrl = cleanUrl(mainImage);
  }

  const targetCoverKey = getCanonicalKey(targetCoverUrl);
  const seenKeys = new Set();
  let candidates = [];

  // If primary image provided, ensure it is added first
  if (targetCoverUrl) {
    candidates.push({
      url: targetCoverUrl,
      alt: defaultAlt || 'Primary Luminaire',
      isCover: true,
      publicId: '',
    });
    seenKeys.add(targetCoverKey);
  }

  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (!img) return;
      let url = '';
      let alt = defaultAlt;
      let isCover = false;
      let publicId = '';

      if (typeof img === 'string') {
        url = cleanUrl(img);
      } else if (typeof img === 'object') {
        url = cleanUrl(img.url);
        alt = img.alt || defaultAlt;
        isCover = Boolean(img.isCover);
        publicId = img.publicId || '';
      }

      if (!url) return;
      const key = getCanonicalKey(url);

      // Skip duplicate URLs
      if (seenKeys.has(key)) return;
      seenKeys.add(key);

      candidates.push({
        url,
        alt,
        isCover: targetCoverKey ? key === targetCoverKey : candidates.length === 0,
        publicId,
      });
    });
  }

  // If real user image(s) exist, purge any obsolete chandelier / placeholder images
  if (candidates.some((c) => !isPlaceholder(c.url))) {
    candidates = candidates.filter((c) => !isPlaceholder(c.url));
  }

  // Ensure EXACTLY one image has isCover: true
  let coverFound = false;
  candidates.forEach((img) => {
    if (img.isCover && !coverFound) {
      coverFound = true;
    } else {
      img.isCover = false;
    }
  });

  if (!coverFound && candidates.length > 0) {
    candidates[0].isCover = true;
  }

  // Put cover photo at index 0 so virtual mainImage and images[0] are 100% in sync
  const coverItem = candidates.find((img) => img.isCover);
  const otherItems = candidates.filter((img) => !img.isCover);
  return coverItem ? [coverItem, ...otherItems] : candidates;
};

// Helper to normalize specifications
const normalizeProductSpecs = (specs = {}) => {
  return {
    dimensions: specs.dimensions || specs.size || '',
    material: specs.material || '',
    finish: specs.finish || '',
    wattage: specs.wattage || '',
    voltage: specs.voltage || '',
    colorTemperature: specs.colorTemperature || '',
    ipRating: specs.ipRating || '',
    installationType: specs.installationType || '',
    beamAngle: specs.beamAngle || '',
    cri: specs.cri || '',
    luminousFlux: specs.luminousFlux || specs.lumens || '',
  };
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      title,
      slug,
      sku,
      category,
      subcategory,
      subcategoryName,
      sub,
      shortDescription,
      description,
      price,
      images,
      mainImage,
      specifications,
      pdfUrl,
      tags,
      isFeatured,
      isNewArrival,
      isPublished,
      sortOrder,
      seoTitle,
      seoDescription,
    } = req.body;

    const productName = (name || title || '').trim() || 'New Luminaire';
    let productSku = (sku || '').trim().toUpperCase();

    let targetCategory = category || null;
    let categoryExists = null;

    if (targetCategory) {
      if (typeof targetCategory === 'string' && targetCategory.match(/^[0-9a-fA-F]{24}$/)) {
        categoryExists = await Category.findById(targetCategory);
      }
      if (!categoryExists) {
        categoryExists = await Category.findOne({
          $or: [
            { slug: targetCategory },
            { name: new RegExp(`^${targetCategory}$`, 'i') },
          ],
        });
      }
      if (categoryExists) {
        if (STANDALONE_SUBCAT_MAP[categoryExists.slug]) {
          const mapping = STANDALONE_SUBCAT_MAP[categoryExists.slug];
          const parentCat = await Category.findOne({ slug: mapping.parentSlug });
          if (parentCat) {
            categoryExists = parentCat;
            if (!subcategory && !sub) {
              finalSubcategory = mapping.subcategory;
              finalSubcategoryName = mapping.subcategoryName;
            }
          }
        }
        targetCategory = categoryExists._id;
      } else {
        targetCategory = null;
      }
    }

    // Resolve subcategory and display name
    let finalSubcategory = (subcategory || sub || '').trim().toLowerCase();
    let finalSubcategoryName = (subcategoryName || '').trim();

    if (finalSubcategory && categoryExists?.subcategories?.length > 0) {
      const matchedSub = categoryExists.subcategories.find(
        (s) => s.slug === finalSubcategory || s.name.toLowerCase() === finalSubcategory
      );
      if (matchedSub) {
        finalSubcategory = matchedSub.slug;
        if (!finalSubcategoryName) {
          finalSubcategoryName = matchedSub.name;
        }
      }
    }

    if (!finalSubcategoryName && finalSubcategory) {
      finalSubcategoryName = finalSubcategory
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    if (finalSubcategory && (finalSubcategory.includes('antic') || finalSubcategory.includes('antique'))) {
      finalSubcategory = 'antique-chandelier';
      finalSubcategoryName = 'Antique Chandelier';
    } else if (finalSubcategory === 'led-chandelier' || finalSubcategory === 'led chandelier') {
      finalSubcategory = 'led-chandelier';
      finalSubcategoryName = 'LED Chandelier';
    } else if (finalSubcategory === 'classic-chandelier' || finalSubcategory === 'classic chandelier') {
      finalSubcategory = 'classic-chandelier';
      finalSubcategoryName = 'Classic Chandelier';
    }

    // Check SKU uniqueness only if SKU is provided
    let finalSku = productSku;
    if (finalSku) {
      let skuCounter = 1;
      while (await Product.findOne({ sku: finalSku })) {
        finalSku = `${productSku}-${skuCounter}`;
        skuCounter++;
      }
    }
    productSku = finalSku;

    // Generate unique slug
    let baseSlug = slug ? slugify(slug) : slugify(productName);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const formattedImages = normalizeProductImages(images, mainImage, productName);
    const formattedSpecs = normalizeProductSpecs(specifications);

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const product = await Product.create({
      name: productName,
      slug: finalSlug,
      sku: productSku,
      category: targetCategory,
      subcategory: finalSubcategory,
      subcategoryName: finalSubcategoryName,
      shortDescription: shortDescription || '',
      description: description || '',
      price: Math.max(0, Number(price) || 0),
      images: formattedImages,
      specifications: formattedSpecs,
      pdfUrl: pdfUrl || '',
      tags: parsedTags,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      sortOrder: Number(sortOrder) || 0,
      seoTitle: seoTitle || productName,
      seoDescription: seoDescription || shortDescription || '',
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    clearCatalogCache();

    res.status(201).json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      title,
      slug,
      sku,
      category,
      subcategory,
      subcategoryName,
      sub,
      shortDescription,
      description,
      price,
      images,
      mainImage,
      specifications,
      pdfUrl,
      tags,
      isFeatured,
      isNewArrival,
      isPublished,
      sortOrder,
      seoTitle,
      seoDescription,
    } = req.body;

    const productName = name || title;
    if (productName && productName.trim()) {
      product.name = productName.trim();
    }

    if (sku) {
      const normalizedSku = sku.trim().toUpperCase();
      if (normalizedSku !== product.sku) {
        const skuExists = await Product.findOne({ sku: normalizedSku, _id: { $ne: product._id } });
        if (skuExists) {
          return res.status(400).json({
            success: false,
            message: `SKU '${normalizedSku}' is already assigned to another product.`,
          });
        }
        product.sku = normalizedSku;
      }
    }

    if (slug) {
      const newSlug = slugify(slug);
      if (newSlug !== product.slug) {
        const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: `Slug '${newSlug}' is already assigned to another product.`,
          });
        }
        product.slug = newSlug;
      }
    }

    if (category) {
      let categoryExists = null;
      if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryExists = await Category.findById(category);
      }
      if (!categoryExists) {
        categoryExists = await Category.findOne({
          $or: [
            { slug: category },
            { name: new RegExp(`^${category}$`, 'i') },
          ],
        });
      }
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.',
        });
      }
      if (categoryExists && STANDALONE_SUBCAT_MAP[categoryExists.slug]) {
        const mapping = STANDALONE_SUBCAT_MAP[categoryExists.slug];
        const parentCat = await Category.findOne({ slug: mapping.parentSlug });
        if (parentCat) {
          categoryExists = parentCat;
          if (!subcategory && !sub) {
            product.subcategory = mapping.subcategory;
            product.subcategoryName = mapping.subcategoryName;
          }
        }
      }
      product.category = categoryExists._id;
    }

    if (subcategory !== undefined || sub !== undefined) {
      let updatedSub = (subcategory !== undefined ? subcategory : sub || '').trim().toLowerCase();
      let updatedSubName = (subcategoryName !== undefined ? subcategoryName : '').trim();

      const currentCat = await Category.findById(product.category);
      if (updatedSub && currentCat?.subcategories?.length > 0) {
        const matchedSub = currentCat.subcategories.find(
          (s) => s.slug === updatedSub || s.name.toLowerCase() === updatedSub
        );
        if (matchedSub) {
          updatedSub = matchedSub.slug;
          if (!updatedSubName) {
            updatedSubName = matchedSub.name;
          }
        }
      }

      if (!updatedSubName && updatedSub) {
        updatedSubName = updatedSub
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      if (updatedSub && (updatedSub.includes('antic') || updatedSub.includes('antique'))) {
        updatedSub = 'antique-chandelier';
        updatedSubName = 'Antique Chandelier';
      } else if (updatedSub === 'led-chandelier' || updatedSub === 'led chandelier') {
        updatedSub = 'led-chandelier';
        updatedSubName = 'LED Chandelier';
      } else if (updatedSub === 'classic-chandelier' || updatedSub === 'classic chandelier') {
        updatedSub = 'classic-chandelier';
        updatedSubName = 'Classic Chandelier';
      }

      product.subcategory = updatedSub;
      product.subcategoryName = updatedSubName;
    }

    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Math.max(0, Number(price) || 0);
    if (sku !== undefined) product.sku = (sku || '').trim().toUpperCase();

    if (images !== undefined || mainImage !== undefined) {
      product.images = normalizeProductImages(
        images !== undefined ? images : product.images,
        mainImage,
        product.name
      );
    }

    if (specifications !== undefined) {
      const currentSpecs = product.specifications ? product.specifications.toObject() : {};
      product.specifications = normalizeProductSpecs({ ...currentSpecs, ...specifications });
    }

    if (pdfUrl !== undefined) product.pdfUrl = pdfUrl;
    if (tags !== undefined) {
      product.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : product.tags;
    }
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
    if (isPublished !== undefined) product.isPublished = Boolean(isPublished);
    if (sortOrder !== undefined) product.sortOrder = Number(sortOrder);
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;

    await product.save();

    clearCatalogCache();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await product.deleteOne();

    clearCatalogCache();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate product
// @route   POST /api/products/:id/duplicate
// @access  Private (Admin)
export const duplicateProduct = async (req, res, next) => {
  try {
    const original = await Product.findById(req.params.id);

    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Original product not found.',
      });
    }

    // Generate clean unique SKU and slug
    const baseSku = original.sku ? original.sku.replace(/-COPY-\d+$/i, '') : 'SKU';
    const timestampSuffix = Date.now().toString().slice(-4);
    const newSku = `${baseSku}-COPY-${timestampSuffix}`;
    const newName = `${original.name} (Copy)`;
    const baseSlug = original.slug ? original.slug.replace(/-copy-\d+$/i, '') : 'product';
    const newSlug = slugify(`${baseSlug}-copy-${timestampSuffix}`);

    const clonedProduct = await Product.create({
      name: newName,
      slug: newSlug,
      sku: newSku,
      category: original.category,
      shortDescription: original.shortDescription,
      description: original.description,
      images: original.images,
      specifications: original.specifications,
      pdfUrl: original.pdfUrl,
      price: original.price || 0,
      tags: original.tags || [],
      isFeatured: false,
      isNewArrival: Boolean(original.isNewArrival),
      isPublished: false, // Start as draft/unpublished
      sortOrder: (original.sortOrder || 0) + 1,
      seoTitle: newName,
      seoDescription: original.seoDescription,
    });

    const populated = await Product.findById(clonedProduct._id).populate('category', 'name slug');

    clearCatalogCache();

    res.status(201).json({
      success: true,
      message: 'Product duplicated successfully as draft.',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle published status
// @route   PATCH /api/products/:id/toggle-publish
// @access  Private (Admin)
export const togglePublish = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: `Product ${product.isPublished ? 'published' : 'unpublished'}.`,
      isPublished: product.isPublished,
      product: populatedProduct || product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================================================
 * 🎯 CONTROLLER: getProductFormOptions
 * ============================================================================
 * @desc    Get all available category & subcategory dropdown options for product creation/editing
 * @route   GET /api/products/form-options
 * @access  Public / Private
 */
export const getProductFormOptions = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('name slug icon tag subcategories')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const options = categories.map((cat) => ({
      id: cat._id.toString(),
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '💡',
      tag: cat.tag || '',
      subcategories: (cat.subcategories || [])
        .filter((s) => s.isActive !== false)
        .map((s) => ({
          id: s._id ? s._id.toString() : s.slug,
          _id: s._id ? s._id.toString() : s.slug,
          name: s.name,
          slug: s.slug,
          desc: s.desc || '',
          image: s.image || '',
        })),
    }));

    res.status(200).json({
      success: true,
      count: options.length,
      categories: options,
    });
  } catch (error) {
    next(error);
  }
};
