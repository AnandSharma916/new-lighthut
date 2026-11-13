import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';

const CATEGORY_FAMILY_MAP = {
  'pendant-lamp': ['pendant-lamp', 'led-hanging-lamp', 'classic-hanging-lamp', 'pendant'],
  'wall-lamp': ['wall-lamp', 'led-wall-lamp', 'classic-wall-lamp', 'wall'],
  'chandelier': [
    'chandelier',
    'led-chandelier',
    'e14-chandelier',
    'profile-chandelier',
    'glass-chandelier',
    'italian-chandelier',
    'modern-chandelier',
    'antique-chandelier',
    'fan-chandelier',
    'ceiling-chandelier',
  ],
  'double-height': ['double-height', 'crystal-chandelier', 'modern-double-height-chandelier'],
  'outdoor-light': ['outdoor-light', 'gate-lamp', 'outdoor-wall-lamp', 'outdoor'],
  'spare-part': ['spare-part', 'hanging-base', 'spare-driver', 'spares'],
  'dining-table-lamp': ['dining-table-lamp', 'dining'],
  'table-lamp': ['table-lamp', 'table'],
  'floor-lamp': ['floor-lamp', 'floor'],
  'led-filament-bulb': ['led-filament-bulb', 'filament'],
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

    // Filter by subcategory (if provided directly)
    const targetSub = (subcategory || sub || '').trim().toLowerCase();
    if (targetSub && targetSub !== 'all') {
      query.subcategory = targetSub;
    }

    // Filter by category (can be slug or category ID)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const familySlugs = CATEGORY_FAMILY_MAP[category] || [category];
        const baseSlug = category.replace(/-lamp$/, '').replace(/-light$/, '');
        const matchingCategories = await Category.find({
          $or: [
            { slug: { $in: familySlugs } },
            { slug: category },
            { slug: new RegExp(category, 'i') },
            { slug: new RegExp(baseSlug, 'i') },
            { name: new RegExp(baseSlug, 'i') },
          ],
        });

        if (matchingCategories.length > 0) {
          query.category = { $in: matchingCategories.map((c) => c._id) };
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

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      products,
    });
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
    const relatedProducts = categoryId
      ? await Product.find({
          category: categoryId,
          _id: { $ne: product._id },
          isPublished: true,
        })
          .populate('category', 'name slug')
          .limit(12)
          .sort({ sortOrder: 1, createdAt: -1 })
      : [];

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
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

  // Normalized key for deduplication (matches relative vs absolute paths)
  const getCanonicalKey = (url) => {
    if (!url) return '';
    try {
      const parsed = new URL(url, 'http://localhost');
      return parsed.pathname.replace(/\/+/g, '/').toLowerCase();
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
  const candidates = [];

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

    const productName = (name || title || '').trim();
    let productSku = (sku || '').trim().toUpperCase();

    // Auto-generate SKU if omitted so normal users don't have to enter technical codes
    if (!productSku) {
      productSku = `LH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let targetCategory = category;
    if (!targetCategory) {
      // Pick first existing category as default if omitted
      const firstCat = await Category.findOne();
      if (firstCat) {
        targetCategory = firstCat._id;
      }
    }

    if (!productName || !targetCategory) {
      return res.status(400).json({
        success: false,
        message: 'Product Heading/Name is required.',
      });
    }

    // Verify category exists or fallback to first available (accepts ObjectId, slug, or name)
    let categoryExists = null;
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
      targetCategory = categoryExists._id;
    } else {
      const fallbackCat = await Category.findOne();
      if (fallbackCat) {
        targetCategory = fallbackCat._id;
        categoryExists = fallbackCat;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No category found in database.',
        });
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

    // Check SKU uniqueness; if exists, append random suffix
    let finalSku = productSku;
    let skuCounter = 1;
    while (await Product.findOne({ sku: finalSku })) {
      finalSku = `${productSku}-${skuCounter}`;
      skuCounter++;
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

      product.subcategory = updatedSub;
      product.subcategoryName = updatedSubName;
    }

    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Math.max(0, Number(price) || 0);

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
