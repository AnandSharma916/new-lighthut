export const STANDALONE_PARENT_MAP = {
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
  'modern-chandelier-dh': { parentSlug: 'double-height', subcategory: 'modern-chandelier-dh', subcategoryName: 'Modern Chandelier' },
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

export const MASTER_CATEGORY_SLUGS = [
  'wall-lamp',
  'pendant-lamp',
  'chandelier',
  'double-height',
  'dining-table-lamp',
  'outdoor-light',
  'table-lamp',
  'floor-lamp',
  'led-filament-bulb',
  'spare-part',
];

export const resolveCanonicalCategoryAndSub = (categories, rawCategory, rawSubcategory, rawSubcategoryName, productName = '', productSku = '') => {
  if (!Array.isArray(categories)) {
    return {
      categoryId: typeof rawCategory === 'object' ? rawCategory?._id || '' : rawCategory || '',
      subcategory: rawSubcategory || '',
      subcategoryName: rawSubcategoryName || '',
    };
  }

  const catIdOrObj = rawCategory;
  const rawId = typeof catIdOrObj === 'object' && catIdOrObj?._id ? String(catIdOrObj._id) : String(catIdOrObj || '');
  const rawSlug = typeof catIdOrObj === 'object' && catIdOrObj?.slug ? String(catIdOrObj.slug) : '';

  const matchedCat = categories.find((c) => String(c._id) === rawId || (rawSlug && c.slug === rawSlug));
  let categoryId = matchedCat?._id || rawId;
  let subcategory = (rawSubcategory || '').trim().toLowerCase();
  let subcategoryName = (rawSubcategoryName || '').trim();

  // If matched category is a standalone subcategory item, resolve to parent!
  if (matchedCat && STANDALONE_PARENT_MAP[matchedCat.slug]) {
    const mapping = STANDALONE_PARENT_MAP[matchedCat.slug];
    const parent = categories.find((c) => c.slug === mapping.parentSlug);
    if (parent) {
      categoryId = parent._id;
      if (!subcategory) {
        subcategory = mapping.subcategory;
        subcategoryName = mapping.subcategoryName;
      }
    }
  }

  // Infer subcategory from product name/sku if subcategory is empty and category is Chandelier
  const parentCat = categories.find((c) => String(c._id) === String(categoryId));
  const isChandelier = parentCat?.slug === 'chandelier' || (!parentCat && rawSlug === 'chandelier');

  if (!subcategory && isChandelier) {
    const combined = `${productName} ${productSku}`.toLowerCase();
    if (combined.includes('fan')) {
      subcategory = 'fan-chandelier';
      subcategoryName = 'Fan Chandelier';
    } else if (combined.includes('profile')) {
      subcategory = 'profile-chandelier';
      subcategoryName = 'Profile Chandelier';
    } else if (combined.includes('modern')) {
      subcategory = 'modern-chandelier';
      subcategoryName = 'Modern Chandelier';
    } else if (combined.includes('e14')) {
      subcategory = 'e14-chandelier';
      subcategoryName = 'E14 Chandelier';
    } else if (combined.includes('glass')) {
      subcategory = 'glass-chandelier';
      subcategoryName = 'Glass Chandelier';
    } else if (combined.includes('antique') || combined.includes('antic') || combined.includes('4012')) {
      subcategory = 'antique-chandelier';
      subcategoryName = 'Antique Chandelier';
    } else if (combined.includes('italian')) {
      subcategory = 'italian-chandelier';
      subcategoryName = 'Italian Chandelier';
    } else if (combined.includes('crystal')) {
      subcategory = 'crystal-chandelier';
      subcategoryName = 'Crystal Chandelier';
    } else if (combined.includes('led')) {
      subcategory = 'led-chandelier';
      subcategoryName = 'LED Chandelier';
    }
  }

  // Normalize antique/antic
  if (subcategory.includes('antic') || subcategory.includes('antique')) {
    subcategory = 'antique-chandelier';
    subcategoryName = 'Antique Chandelier';
  } else if (subcategory === 'led-chandelier' || subcategory === 'led chandelier') {
    subcategory = 'led-chandelier';
    subcategoryName = 'LED Chandelier';
  } else if (subcategory === 'classic-chandelier' || subcategory === 'classic chandelier') {
    subcategory = 'classic-chandelier';
    subcategoryName = 'Classic Chandelier';
  } else if (subcategory === 'glass-chandelier') {
    subcategory = 'glass-chandelier';
    subcategoryName = 'Glass Chandelier';
  }

  return { categoryId, subcategory, subcategoryName };
};
