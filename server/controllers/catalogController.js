import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * ============================================================================
 * 🌟 10 MASTER LIGHTING CATEGORIES DEFINITION (Parent-Child Hierarchy)
 * ============================================================================
 * Ye static master list hai jo LightHut ke 10 primary categories aur unke
 * subcategories, icons, tags, HD images aur descriptions ko define karti hai.
 * Database me products inhi categories/subcategories ke slug se link hote hain.
 */
export const CATALOG_CATEGORY_GROUPS = [
  // 1) WALL LAMP
  {
    name: 'Wall Lamp',
    slug: 'wall-lamp',
    icon: '💡',
    tag: 'Bi-Directional Sconces & Facade Grazers',
    description: 'Architectural wall sconces delivering soft ambient halos, bedside task beams, and corridor vertical washes.',
    image: '/categories/wall-lamp.jpg',
    subcategories: [
      {
        name: 'Led Wall Lamp',
        slug: 'led-wall-lamp',
        image: '/categories/led-wall-lamp.jpg',
        desc: 'Linear & Halo Minimalist Sconces',
      },
      {
        name: 'Wall Lamp',
        slug: 'classic-wall-lamp',
        image: '/categories/classic-wall-lamp.jpg',
        desc: 'Fluted Glass & Vintage Sconces',
      },
    ],
    previewGallery: [
      { url: '/categories/led-wall-lamp.jpg', title: 'LH-WL101 Slim Linear LED', link: '/catalog?category=wall-lamp' },
      { url: '/categories/wall-lamp.jpg', title: 'LH-WL102 Round Halo Light', link: '/catalog?category=wall-lamp' },
      { url: '/categories/classic-wall-lamp.jpg', title: 'LH-WL201 Brass Swing-Arm Sconce', link: '/catalog?category=wall-lamp' },
      { url: '/categories/wall-lamp.jpg', title: 'Bi-Directional Sconce', link: '/catalog?category=wall-lamp' },
    ],
  },

  // 2) PENDANT LAMP
  {
    name: 'Pendant Lamp',
    slug: 'pendant-lamp',
    icon: '🔆',
    tag: 'Suspended Linear & Cluster Pendants',
    description: 'Precision downward illumination and sculptural glass drops for dining pavilions, kitchen islands, and bars.',
    image: '/categories/pendant-lamp.jpg',
    subcategories: [
      {
        name: 'Led Hanging Lamp',
        slug: 'led-hanging-lamp',
        image: '/categories/led-hanging-lamp.jpg',
        desc: 'Integrated Architectural Suspensions',
      },
      {
        name: 'Hanging Lamp',
        slug: 'classic-hanging-lamp',
        image: '/categories/classic-hanging-lamp.jpg',
        desc: 'Mouth-Blown Fluted Glass Drops',
      },
    ],
    previewGallery: [
      { url: '/categories/led-hanging-lamp.jpg', title: 'LH-PL101 Cone Pendant', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/classic-hanging-lamp.jpg', title: 'LH-PL201 Fluted Amber Glass', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/pendant-lamp.jpg', title: 'Sculptural Suspended Luminaire', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/led-hanging-lamp.jpg', title: 'Architectural Hanging Cone', link: '/catalog?category=pendant-lamp' },
    ],
  },

  // 3) CHANDELIER
  {
    name: 'Chandelier',
    slug: 'chandelier',
    icon: '✨',
    tag: 'Grand Architectural Centerpieces',
    description: 'Bespoke statement chandeliers handcrafted with optical K9 crystals, blown art glass, and architectural brass.',
    image: '/categories/chandelier.jpg',
    subcategories: [
      {
        name: 'Led Chandelier',
        slug: 'led-chandelier',
        image: '/categories/chandelier.jpg',
        desc: 'Architectural Geometric Rings',
      },
      {
        name: 'E14 Chandelier',
        slug: 'e14-chandelier',
        image: '/categories/e14-chandelier.jpg',
        desc: 'Multi-Arm European Candelabras',
      },
      {
        name: 'Profile Chandelier',
        slug: 'profile-chandelier',
        image: '/categories/profile-chandelier.jpg',
        desc: 'Linear Profile Suspensions',
      },
      {
        name: 'Glass Chandelier',
        slug: 'glass-chandelier',
        image: '/categories/glass-chandelier.jpg',
        desc: 'Handcrafted Optical Glass Elements',
      },
      {
        name: 'Italian Chandelier',
        slug: 'italian-chandelier',
        image: '/categories/italian-chandelier.jpg',
        desc: 'Venetian & Artisan European Glass',
      },
      {
        name: 'Modern chandelier',
        slug: 'modern-chandelier',
        image: '/categories/modern-chandelier.jpg',
        desc: 'Contemporary Sculptural Centerpieces',
      },
      {
        name: 'Antic Chandelier',
        slug: 'antic-chandelier',
        image: '/categories/antic-chandelier.jpg',
        desc: 'Heritage Gilded & Classic Ironwork',
      },
      {
        name: 'Fan chandelier',
        slug: 'fan-chandelier',
        image: '/categories/fan-chandelier.jpg',
        desc: 'Integrated Ceiling Fan & Lighting',
      },
      {
        name: 'Celling chandelier',
        slug: 'ceiling-chandelier',
        image: '/categories/ceiling-chandelier.jpg',
        desc: 'Semi-Flush Mount Centerpieces',
      },
    ],
    previewGallery: [
      { url: '/categories/chandelier.jpg', title: 'LH-CH101 Multi-Tier Ring Chandelier', link: '/catalog?category=chandelier' },
      { url: '/categories/e14-chandelier.jpg', title: 'LH-CH201 E14 French Candelabra', link: '/catalog?category=chandelier' },
      { url: '/categories/italian-chandelier.jpg', title: 'LH-CH501 Venetian Italian Chandelier', link: '/catalog?category=chandelier' },
      { url: '/categories/fan-chandelier.jpg', title: 'LH-CH801 Retractable Fan Chandelier', link: '/catalog?category=chandelier' },
    ],
  },

  // 4) DOUBLE HEIGHT
  {
    name: 'Double Height',
    slug: 'double-height',
    icon: '🏛️',
    tag: 'Multi-Tier Grand Void Installations',
    description: 'Monumental chandeliers with suspension drops up to 10 meters, engineered for duplex villas and hotel atriums.',
    image: '/categories/double-height.jpg',
    subcategories: [
      {
        name: 'Crystal Chandelier',
        slug: 'crystal-chandelier',
        image: '/categories/double-height.jpg',
        desc: '18ft+ Monumental Staircase Drops',
      },
      {
        name: 'Modern Chandelier',
        slug: 'modern-chandelier-dh',
        image: '/categories/modern-chandelier-dh.jpg',
        desc: 'Spiral Duplex Void Rings',
      },
    ],
    previewGallery: [
      { url: '/categories/double-height.jpg', title: 'LH-DH101 Grand Crystal Cascade', link: '/catalog?category=double-height' },
      { url: '/categories/modern-chandelier-dh.jpg', title: 'LH-DH201 Modern Staggered Rings', link: '/catalog?category=double-height' },
      { url: '/categories/double-height.jpg', title: 'Atrium Void Suspension', link: '/catalog?category=double-height' },
      { url: '/categories/modern-chandelier-dh.jpg', title: '18ft Architectural Suspension', link: '/catalog?category=double-height' },
    ],
  },

  // 5) DINING TABLE LAMP
  {
    name: 'Dining Table Lamp',
    slug: 'dining-table-lamp',
    icon: '🍽️',
    tag: 'Curated Banquet Illumination',
    description: 'Low-glare fixtures tailored for banquet tables, combining warm 2700K ambient glow with pristine table surface coverage.',
    image: '/categories/dining-table-lamp.jpg',
    subcategories: [],
    previewGallery: [
      { url: '/categories/dining-table-lamp.jpg', title: 'Cordless Touch Banquet Lamp', link: '/catalog?category=dining-table-lamp' },
      { url: '/hero-pendant.jpg', title: 'Champagne Fluted Drops', link: '/catalog?category=dining-table-lamp' },
      { url: '/banner-amalfi.jpg', title: 'Brushed Gold Dining Accent', link: '/catalog?category=dining-table-lamp' },
      { url: '/showroom-hero-hd.jpg', title: 'Executive Dining Centerpiece', link: '/catalog?category=dining-table-lamp' },
    ],
  },

  // 6) OUTDOOR LIGHT
  {
    name: 'Outdoor Light',
    slug: 'outdoor-light',
    icon: '🌿',
    tag: 'IP65 Weatherproof Luminaires',
    description: 'Corrosion-resistant exterior lighting engineered for residential entrance gates, garden perimeters, and building facades.',
    image: '/categories/outdoor-light.jpg',
    subcategories: [
      {
        name: 'Gate Lamp',
        slug: 'gate-lamp',
        image: '/categories/outdoor-light.jpg',
        desc: 'Heritage Weatherproof Lanterns',
      },
      {
        name: 'Wall Lamp',
        slug: 'outdoor-wall-lamp',
        image: '/hero-outdoor.jpg',
        desc: 'IP65 Die-Cast Exterior Sconces',
      },
    ],
    previewGallery: [
      { url: '/categories/outdoor-light.jpg', title: 'Heritage Gate Pillar Lantern', link: '/catalog?category=outdoor-light' },
      { url: '/hero-outdoor.jpg', title: 'IP65 Architectural Sconce', link: '/catalog?category=outdoor-light' },
      { url: '/hero-outdoor.jpg', title: 'Villa Pathway Bollard', link: '/catalog?category=outdoor-light' },
      { url: '/categories/outdoor-light.jpg', title: 'Exterior Facade Grazer', link: '/catalog?category=outdoor-light' },
    ],
  },

  // 7) TABLE LAMP
  {
    name: 'Table Lamp',
    slug: 'table-lamp',
    icon: '🪔',
    tag: 'Sculptural Marble & Metal Accents',
    description: 'Artisanal tabletop luminaires crafted with weighted Spanish marble bases, frosted glass diffusers, and tactile switches.',
    image: '/categories/table-lamp.jpg',
    subcategories: [],
    previewGallery: [
      { url: '/categories/table-lamp.jpg', title: 'Marble Base Mushroom Lamp', link: '/catalog?category=table-lamp' },
      { url: '/banner-study.jpg', title: 'Architectural Brass Task Lamp', link: '/catalog?category=table-lamp' },
      { url: '/banner-bed.jpg', title: 'Ceramic Bedside Ambient Light', link: '/catalog?category=table-lamp' },
      { url: '/banner-study-hover.jpg', title: 'Articulated Reading Desk Light', link: '/catalog?category=table-lamp' },
    ],
  },

  // 8) FLOOR LAMP
  {
    name: 'Floor Lamp',
    slug: 'floor-lamp',
    icon: '🕯️',
    tag: 'Freestanding Arcs & Lounge Columns',
    description: 'Statement floor lamps designed for reading lounges, executive suites, and architectural living pavilion corners.',
    image: '/categories/floor-lamp.jpg',
    subcategories: [],
    previewGallery: [
      { url: '/categories/floor-lamp.jpg', title: 'Arched Brass Living Room Arc', link: '/catalog?category=floor-lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Heavy Marble Plinth Luminaire', link: '/catalog?category=floor-lamp' },
      { url: '/hero-wall-lamp.jpg', title: 'Vertical Corner Ambient Bar', link: '/catalog?category=floor-lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Mid-Century Brass Floor Lamp', link: '/catalog?category=floor-lamp' },
    ],
  },

  // 9) LED FILAMENT BULB
  {
    name: 'LED Filament Bulb',
    slug: 'led-filament-bulb',
    icon: '💫',
    tag: 'Warm Vintage Edison Filament',
    description: 'High-efficiency retro Edison bulbs (2200K–2700K) with golden amber tints and spiral filament cores.',
    image: '/categories/led-filament-bulb.jpg',
    subcategories: [],
    previewGallery: [
      { url: '/categories/led-filament-bulb.jpg', title: 'Amber ST64 Spiral Bulb', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: '2200K Edison Warm Glow', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'G125 Giant Globe Bulb', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'Vintage Spiral Filament', link: '/catalog?category=led-filament-bulb' },
    ],
  },

  // 10) SPARE PART & DRIVERS
  {
    name: 'Spare Part',
    slug: 'spare-part',
    icon: '🔧',
    tag: 'Architectural Components & Power Supplies',
    description: 'Universal multi-port ceiling canopies, flicker-free dimmable constant voltage drivers, and suspension hardware.',
    image: '/categories/spare-part.jpg',
    subcategories: [
      {
        name: 'Hanging Base',
        slug: 'hanging-base',
        image: '/categories/hanging-base.jpg',
        desc: 'Mounting Plates & Rigging Hardware',
      },
      {
        name: 'Spare Driver',
        slug: 'spare-driver',
        image: '/categories/spare-driver.jpg',
        desc: 'Constant Current LED Drivers',
      },
    ],
    previewGallery: [
      { url: '/categories/hanging-base.jpg', title: 'Brass Canopy & Rigging Base', link: '/catalog?category=spare-part' },
      { url: '/categories/spare-driver.jpg', title: 'Constant Current LED Driver', link: '/catalog?category=spare-part' },
      { url: '/categories/hanging-base.jpg', title: 'Telescopic Mounting Canopy', link: '/catalog?category=spare-part' },
      { url: '/categories/spare-driver.jpg', title: 'Electronic Power Supply Unit', link: '/catalog?category=spare-part' },
    ],
  },
];

/**
 * Helper function: Resolves all matching category and subcategory slugs
 * for a given category query string.
 */
function resolveCategorySlugs(categoryQuery) {
  if (!categoryQuery || categoryQuery === 'all') return null;

  // Check if query matches any parent group
  const parentGroup = CATALOG_CATEGORY_GROUPS.find((g) => g.slug === categoryQuery);
  if (parentGroup) {
    const slugs = [parentGroup.slug];
    if (parentGroup.subcategories) {
      parentGroup.subcategories.forEach((sub) => slugs.push(sub.slug));
    }
    return slugs;
  }

  // It's a specific subcategory or single slug
  return [categoryQuery];
}

/**
 * ============================================================================
 * 🎯 CONTROLLER 1: getCatalogDropdown
 * ============================================================================
 * @desc    Navbar aur Filters ke Catalog Dropdown ke liye dynamic tree data
 * @route   GET /api/catalog/dropdown
 * @access  Public (Anyone can view)
 * 
 * 📝 KYA KARTA HAI YE FUNCTION:
 * 1. MongoDB se saari active categories fetch karta hai.
 * 2. Product collection se real-time me har category ke published products count karta hai.
 * 3. 10 Master Categories + Subcategories ka clean tree banata hai (with Icons, Live Counts, Images).
 * 4. Neat, clean aur professional JSON response bhejta hai jo frontend direct use kar sakta hai.
 */
export const getCatalogDropdown = async (req, res, next) => {
  try {
    // -------------------------------------------------------------
    // STEP 1: Database se Active Categories aur Live Product Counts nikalna
    // -------------------------------------------------------------
    const [dbCategories, productCountAggregate, subcategoryCountAggregate] = await Promise.all([
      // MongoDB se active categories fetch karo (with their subcategories, icon, tag)
      Category.find({ isActive: true })
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean(),

      // MongoDB Aggregation: Har Category ID ke hisaab se published products ka total count
      Product.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),

      // MongoDB Aggregation: Har Subcategory slug ke hisaab se published products ka total count
      Product.aggregate([
        { $match: { isPublished: true, subcategory: { $exists: true, $ne: '' } } },
        { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      ]),
    ]);

    // -------------------------------------------------------------
    // STEP 2: Quick Lookup Maps banana (Fast calculation ke liye)
    // -------------------------------------------------------------
    // Category ID -> Product Count Map
    const countMapById = {};
    productCountAggregate.forEach((item) => {
      if (item._id) {
        countMapById[item._id.toString()] = item.count;
      }
    });

    // Subcategory Slug -> Product Count Map
    const subcategoryCountMap = {};
    subcategoryCountAggregate.forEach((item) => {
      if (item._id) {
        subcategoryCountMap[item._id.toString().toLowerCase()] = item.count;
      }
    });

    // Category Slug -> Info Map (ID, Name, Count)
    const categorySlugMap = {};
    dbCategories.forEach((cat) => {
      const idStr = cat._id.toString();
      const count = countMapById[idStr] || 0;
      categorySlugMap[cat.slug] = {
        id: idStr,
        name: cat.name,
        slug: cat.slug,
        count: count,
      };
    });

    // -------------------------------------------------------------
    // STEP 3: Categories & Subcategories Tree build karna (Direct from MongoDB)
    // -------------------------------------------------------------
    let grandTotalProducts = 0;

    // Source categories: MongoDB priority, fallback to CATALOG_CATEGORY_GROUPS if DB is empty
    const sourceCategories = dbCategories.length > 0 ? dbCategories : CATALOG_CATEGORY_GROUPS;

    const dropdownCategories = sourceCategories.map((cat) => {
      // Find matching static definition for default fallbacks
      const staticDef = CATALOG_CATEGORY_GROUPS.find((g) => g.slug === cat.slug);

      // Subcategories: MongoDB array priority, fallback to staticDef
      let rawSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0
        ? cat.subcategories
        : (staticDef?.subcategories || []);

      // Filter only active subcategories
      rawSubs = rawSubs.filter((s) => s.isActive !== false);

      // Parent category ka direct count
      const directParentMatch = categorySlugMap[cat.slug];
      let parentTotalCount = directParentMatch ? directParentMatch.count : 0;

      // Subcategories ke counts calculate karna
      const subcategoriesWithCounts = rawSubs.map((sub, idx) => {
        const subSlug = (sub.slug || '').toLowerCase();
        const subMatch = categorySlugMap[subSlug];
        // Count from subcategory field on Product, or from direct category slug match
        const subCount = (subcategoryCountMap[subSlug] || 0) + (subMatch ? subMatch.count : 0);

        // If parent category doesn't have direct products, sum up subcategory products
        if (!directParentMatch || directParentMatch.count === 0) {
          parentTotalCount += subCount;
        }

        return {
          id: sub._id ? sub._id.toString() : (subMatch ? subMatch.id : null),
          _id: sub._id ? sub._id.toString() : (subMatch ? subMatch.id : null),
          name: sub.name,
          slug: sub.slug,
          image: sub.image || cat.image || staticDef?.image || '/categories/wall-lamp.jpg',
          desc: sub.desc || 'Architectural Typology',
          productCount: subCount,
          count: subCount, // Alias
          sortOrder: sub.sortOrder !== undefined ? sub.sortOrder : idx,
          isActive: sub.isActive !== undefined ? sub.isActive : true,
          link: `/catalog?category=${cat.slug}&sub=${sub.slug}`,
        };
      });

      grandTotalProducts += parentTotalCount;

      // Clean Parent Category Object
      return {
        id: cat._id ? cat._id.toString() : null,
        _id: cat._id ? cat._id.toString() : null,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon || staticDef?.icon || '💡',
        tag: cat.tag || staticDef?.tag || '',
        description: cat.description || staticDef?.description || '',
        image: cat.image || staticDef?.image || '/categories/wall-lamp.jpg',
        productCount: parentTotalCount,
        count: parentTotalCount, // Alias
        link: `/category/${cat.slug}`,
        sub: subcategoriesWithCounts,
        subcategories: subcategoriesWithCounts, // Alias
        previewGallery: staticDef?.previewGallery || [],
      };
    });

    // -------------------------------------------------------------
    // STEP 4: Clean, Professional Response bhejna
    // -------------------------------------------------------------
    return res.status(200).json({
      success: true,
      message: 'Catalog dropdown hierarchy fetched successfully',
      totalCategories: dropdownCategories.length,
      totalProducts: grandTotalProducts,
      categories: dropdownCategories,
      data: {
        totalCategories: dropdownCategories.length,
        totalProducts: grandTotalProducts,
        categories: dropdownCategories,
      },
    });
  } catch (error) {
    console.error('[Catalog Dropdown Controller Error]:', error);
    return next(error);
  }
};

/**
 * ============================================================================
 * 🎯 CONTROLLER 2: getCatalog
 * ============================================================================
 * @desc    Catalog page ke products, filters, dynamic metadata aur pagination
 * @route   GET /api/catalog
 * @access  Public
 */
export const getCatalog = async (req, res, next) => {
  try {
    const {
      category = 'all',
      sub = '',
      subcategory = '',
      search = '',
      featured = '',
      finish = '',
      material = '',
      cct = '',
      colorTemperature = '',
      ipRating = '',
      installationType = '',
      minPrice = '',
      maxPrice = '',
      sort = 'sortOrder',
      page = 1,
      limit = 24,
    } = req.query;

    const query = { isPublished: true };

    // 1. Featured Filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // 2. Subcategory Filter
    const targetSub = (sub || subcategory || '').trim().toLowerCase();
    if (targetSub && targetSub !== 'all') {
      const matchingSubCat = await Category.findOne({ slug: targetSub }).select('_id');
      if (matchingSubCat) {
        query.$or = [
          { subcategory: targetSub },
          { category: matchingSubCat._id },
        ];
      } else {
        query.subcategory = targetSub;
      }
    }

    // 3. Category Filter
    if (category && category !== 'all') {
      const allowedSlugs = resolveCategorySlugs(category);
      if (allowedSlugs && allowedSlugs.length > 0) {
        const matchingCategories = await Category.find({
          slug: { $in: allowedSlugs },
        }).select('_id');

        if (matchingCategories.length > 0) {
          const catIds = matchingCategories.map((c) => c._id);
          if (query.$or) {
            query.$and = [{ category: { $in: catIds } }, { $or: query.$or }];
            delete query.$or;
          } else {
            query.category = { $in: catIds };
          }
        } else {
          query.category = null;
        }
      }
    }

    // 4. Specification Filters
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

    // 5. Price Range Filter
    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 6. Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchClauses = [
        { name: searchRegex },
        { sku: searchRegex },
        { shortDescription: searchRegex },
        { subcategoryName: searchRegex },
        { 'specifications.material': searchRegex },
        { 'specifications.finish': searchRegex },
      ];
      if (query.$and) {
        query.$and.push({ $or: searchClauses });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchClauses }];
        delete query.$or;
      } else {
        query.$or = searchClauses;
      }
    }

    // 7. Sorting
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
        sortOption = { isFeatured: -1, sortOrder: 1, createdAt: -1 };
        break;
    }

    // 8. Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    // 9. Execute Product Query & Categories Count
    const [totalMatching, rawProducts, allCategoriesInDb, productCountAggregate, subcategoryCountAggregate] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug description image')
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Category.find({ isActive: true }).select('name slug image subcategories icon tag description').lean(),
      Product.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, subcategory: { $exists: true, $ne: '' } } },
        { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      ]),
    ]);

    // 10. Calculate Real-Time Product Counts Per Category & Subcategory
    const countMap = {};
    productCountAggregate.forEach((item) => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    const subcategoryCountMap = {};
    subcategoryCountAggregate.forEach((item) => {
      if (item._id) {
        subcategoryCountMap[item._id.toString().toLowerCase()] = item.count;
      }
    });

    const categoryIdToSlugMap = {};
    const categorySlugToCountMap = {};
    allCategoriesInDb.forEach((cat) => {
      const idStr = cat._id.toString();
      categoryIdToSlugMap[idStr] = cat.slug;
      const count = countMap[idStr] || 0;
      categorySlugToCountMap[cat.slug] = count;
    });

    // Compute parent family totals strictly for the 10 master architectural categories
    const structuredCategories = CATALOG_CATEGORY_GROUPS.map((group) => {
      const dbMatch = allCategoriesInDb.find((c) => c.slug === group.slug);
      const directTotal = categorySlugToCountMap[group.slug] || 0;
      let groupTotal = directTotal;

      const rawSubs = Array.isArray(dbMatch?.subcategories) && dbMatch.subcategories.length > 0
        ? dbMatch.subcategories
        : (group.subcategories || []);

      const subcategoriesWithCount = rawSubs
        .filter((s) => s.isActive !== false)
        .map((sub) => {
          const subSlug = (sub.slug || '').toLowerCase();
          const subMatch = categorySlugToCountMap[subSlug] || 0;
          const subDirectCount = subcategoryCountMap[subSlug] || 0;
          const subCount = subDirectCount + subMatch;
          
          groupTotal += subCount;

          return {
            name: sub.name,
            slug: sub.slug,
            image: sub.image || group.image || '/categories/wall-lamp.jpg',
            desc: sub.desc || 'Architectural Typology',
            count: subCount,
            productCount: subCount,
            link: `/catalog?category=${group.slug}&sub=${sub.slug}`,
          };
        });

      return {
        id: dbMatch?._id ? dbMatch._id.toString() : group.slug,
        _id: dbMatch?._id ? dbMatch._id.toString() : group.slug,
        name: group.name,
        slug: group.slug,
        icon: group.icon || '💡',
        tag: group.tag || '',
        description: group.description || dbMatch?.description || '',
        image: group.image || dbMatch?.image || '/categories/wall-lamp.jpg',
        total: groupTotal,
        productCount: groupTotal,
        count: groupTotal,
        subcategories: subcategoriesWithCount,
        sub: subcategoriesWithCount,
      };
    });

    // Total published products across all categories
    const allPublishedTotal = await Product.countDocuments({ isPublished: true });

    // 11. Active Category Metadata (for dynamic hero banner)
    let activeCategory = {
      name: 'All Architectural Lighting',
      slug: 'all',
      tag: 'Complete Lighting Portfolio',
      description: 'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
      heroImage: '/showroom-hero-hd.jpg',
      total: allPublishedTotal,
    };

    if (category && category !== 'all') {
      const parentMatch = structuredCategories.find((g) => g.slug === category);
      if (parentMatch) {
        activeCategory = {
          name: parentMatch.name,
          slug: parentMatch.slug,
          tag: parentMatch.tag,
          description: parentMatch.description,
          heroImage: parentMatch.image,
          total: parentMatch.total,
        };
      } else {
        for (const parent of structuredCategories) {
          const subMatch = parent.subcategories.find((s) => s.slug === category);
          if (subMatch) {
            activeCategory = {
              name: subMatch.name,
              slug: subMatch.slug,
              tag: `${parent.name} • Curated Model`,
              description: `Precision-engineered ${subMatch.name.toLowerCase()} tailored for premier residential and commercial interiors.`,
              heroImage: parent.image,
              total: subMatch.count,
            };
            break;
          }
        }
      }
    }

    // 12. Format Products cleanly for client consumption
    const products = rawProducts.map((p) => {
      const coverImg =
        p.images?.find((img) => img.isCover)?.url ||
        p.images?.[0]?.url ||
        '/categories/chandelier.jpg';

      const hoverImg =
        p.images?.[1]?.url ||
        p.images?.[0]?.url ||
        '/categories/pendant-lamp.jpg';

      return {
        _id: p._id,
        id: p._id,
        name: p.name,
        slug: p.slug,
        sku: p.sku || 'LH-ARC',
        category: p.category || null,
        categoryName: p.category?.name || 'Architectural Luminaire',
        categorySlug: p.category?.slug || 'lighting',
        subcategory: p.subcategory || '',
        subcategoryName: p.subcategoryName || '',
        price: p.price ?? 0,
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        images: p.images || [],
        primaryImage: coverImg,
        secondaryImage: hoverImg,
        specifications: p.specifications || {},
        isFeatured: Boolean(p.isFeatured),
        isPublished: Boolean(p.isPublished),
        createdAt: p.createdAt,
      };
    });

    const totalPages = Math.ceil(totalMatching / pageSize) || 1;

    res.status(200).json({
      success: true,
      activeCategory,
      categories: structuredCategories,
      allTotal: allPublishedTotal,
      products,
      pagination: {
        total: totalMatching,
        page: pageNumber,
        limit: pageSize,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================================================
 * 🎯 CONTROLLER 3: getCatalogOptions
 * ============================================================================
 * @desc    Get all dropdown & filter options for catalog page in a single call:
 *          - Categories with live subcategories and product counts
 *          - Available Specifications (Finishes, Materials, CCT, IP, Wattage)
 *          - Price range (min, max)
 *          - Sort options
 * @route   GET /api/catalog/options
 * @access  Public
 */
export const getCatalogOptions = async (req, res, next) => {
  try {
    const [
      dbCategories,
      productCountAggregate,
      subcategoryCountAggregate,
      finishesAgg,
      materialsAgg,
      cctAgg,
      ipAgg,
      installationAgg,
      wattageAgg,
      priceAgg,
      totalPublished,
    ] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean(),
      Product.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, subcategory: { $exists: true, $ne: '' } } },
        { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.finish': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.finish', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.material': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.material', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.colorTemperature': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.colorTemperature', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.ipRating': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.ipRating', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.installationType': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.installationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, 'specifications.wattage': { $exists: true, $ne: '' } } },
        { $group: { _id: '$specifications.wattage', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isPublished: true, price: { $gt: 0 } } },
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
      ]),
      Product.countDocuments({ isPublished: true }),
    ]);

    // Build Category lookup
    const countMapById = {};
    productCountAggregate.forEach((item) => {
      if (item._id) countMapById[item._id.toString()] = item.count;
    });

    const subcategoryCountMap = {};
    subcategoryCountAggregate.forEach((item) => {
      if (item._id) subcategoryCountMap[item._id.toString().toLowerCase()] = item.count;
    });

    const categorySlugMap = {};
    dbCategories.forEach((cat) => {
      const idStr = cat._id.toString();
      categorySlugMap[cat.slug] = {
        id: idStr,
        name: cat.name,
        slug: cat.slug,
        count: countMapById[idStr] || 0,
      };
    });

    const sourceCategories = dbCategories.length > 0 ? dbCategories : CATALOG_CATEGORY_GROUPS;

    const categoriesTree = sourceCategories.map((cat) => {
      const staticDef = CATALOG_CATEGORY_GROUPS.find((g) => g.slug === cat.slug);
      let rawSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0
        ? cat.subcategories
        : (staticDef?.subcategories || []);

      rawSubs = rawSubs.filter((s) => s.isActive !== false);

      const directParentMatch = categorySlugMap[cat.slug];
      let parentTotalCount = directParentMatch ? directParentMatch.count : 0;

      const subcategories = rawSubs.map((sub, idx) => {
        const subSlug = (sub.slug || '').toLowerCase();
        const subMatch = categorySlugMap[subSlug];
        const subCount = (subcategoryCountMap[subSlug] || 0) + (subMatch ? subMatch.count : 0);

        if (!directParentMatch || directParentMatch.count === 0) {
          parentTotalCount += subCount;
        }

        return {
          id: sub._id ? sub._id.toString() : (subMatch ? subMatch.id : null),
          _id: sub._id ? sub._id.toString() : (subMatch ? subMatch.id : null),
          name: sub.name,
          slug: sub.slug,
          image: sub.image || cat.image || staticDef?.image || '/categories/wall-lamp.jpg',
          desc: sub.desc || 'Architectural Typology',
          count: subCount,
          productCount: subCount,
          sortOrder: sub.sortOrder !== undefined ? sub.sortOrder : idx,
          isActive: sub.isActive !== undefined ? sub.isActive : true,
          link: `/catalog?category=${cat.slug}&sub=${sub.slug}`,
        };
      });

      return {
        id: cat._id ? cat._id.toString() : null,
        _id: cat._id ? cat._id.toString() : null,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon || staticDef?.icon || '💡',
        tag: cat.tag || staticDef?.tag || '',
        description: cat.description || staticDef?.description || '',
        image: cat.image || staticDef?.image || '/categories/wall-lamp.jpg',
        count: parentTotalCount,
        productCount: parentTotalCount,
        link: `/catalog?category=${cat.slug}`,
        sub: subcategories,
        subcategories,
      };
    });

    // Helper to merge DB aggregations with curated standard lighting options
    const mergeOptions = (aggList, standardList) => {
      const set = new Set();
      const result = [];

      aggList.forEach((item) => {
        const val = String(item._id || '').trim();
        if (val && !set.has(val.toLowerCase())) {
          set.add(val.toLowerCase());
          result.push({ value: val, label: val, count: item.count });
        }
      });

      standardList.forEach((std) => {
        if (!set.has(std.toLowerCase())) {
          set.add(std.toLowerCase());
          result.push({ value: std, label: std, count: 0 });
        }
      });

      return result;
    };

    const curatedFinishes = [
      'Brushed Gold',
      'Matte Black',
      'Satin Brass',
      'Champagne Bronze',
      'Polished Chrome',
      'Matte White',
      'Antique Brass',
      'Rose Gold',
    ];

    const curatedMaterials = [
      'Die-Cast Aluminum',
      'K9 Optical Crystal',
      'Architectural Brass',
      'Mouth-Blown Fluted Glass',
      'Wrought Iron',
      'Optical Acrylic',
      'Natural Marble',
    ];

    const curatedCCTs = [
      '3000K Warm White',
      '4000K Natural White',
      '6000K Cool White',
      '3-in-1 Tunable CCT',
      '2200K Vintage Warm',
    ];

    const curatedIPs = [
      'IP20 (Indoor Standard)',
      'IP44 (Bathroom & Splash Proof)',
      'IP65 (Outdoor Waterproof)',
      'IP67 (Heavy Weather & Submersion)',
    ];

    const curatedInstallation = [
      'Surface Mounted',
      'Suspended / Pendant',
      'Recessed / Flush Mount',
      'Magnetic Track',
      'Wall Sconce Mount',
    ];

    const curatedWattages = [
      '5W - 10W',
      '12W - 18W',
      '20W - 35W',
      '36W - 60W',
      '60W+',
    ];

    res.status(200).json({
      success: true,
      message: 'Catalog dropdown & filter options fetched successfully',
      categories: categoriesTree,
      specifications: {
        finishes: mergeOptions(finishesAgg, curatedFinishes),
        materials: mergeOptions(materialsAgg, curatedMaterials),
        colorTemperatures: mergeOptions(cctAgg, curatedCCTs),
        ipRatings: mergeOptions(ipAgg, curatedIPs),
        installationTypes: mergeOptions(installationAgg, curatedInstallation),
        wattages: mergeOptions(wattageAgg, curatedWattages),
      },
      priceRange: {
        min: priceAgg[0]?.minPrice || 0,
        max: priceAgg[0]?.maxPrice || 150000,
      },
      sortOptions: [
        { value: 'sortOrder', label: 'Curated / Featured Order' },
        { value: 'newest', label: 'Newest Arrivals' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Product Name (A to Z)' },
        { value: 'name_desc', label: 'Product Name (Z to A)' },
        { value: 'sku_asc', label: 'SKU Code Order' },
      ],
      totalProducts: totalPublished,
    });
  } catch (error) {
    console.error('[Catalog Options Controller Error]:', error);
    next(error);
  }
};
