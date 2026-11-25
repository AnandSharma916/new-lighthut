import React from 'react';
import { Layers, Package } from 'lucide-react';
import { STANDALONE_PARENT_MAP, MASTER_CATEGORY_SLUGS } from '../../utils/categoryMapping';

export const CategorySelectorWithOptions = ({
  categories = [],
  selectedCategoryId = '',
  onSelectCategory,
  selectedSubcategory = '',
  onSelectSubcategory,
  onCategoriesChanged,
  disabled = false,
}) => {
  // 1. Locate selected category object directly
  let effectiveCategoryObj = categories.find((c) => String(c._id) === String(selectedCategoryId)) || null;
  let effectiveSubSlug = selectedSubcategory || '';

  // 2. If it is a standalone subcategory category, map to its parent category
  if (effectiveCategoryObj && STANDALONE_PARENT_MAP[effectiveCategoryObj.slug]) {
    const mapping = STANDALONE_PARENT_MAP[effectiveCategoryObj.slug];
    const parentObj = categories.find((c) => c.slug === mapping.parentSlug);
    if (parentObj) {
      effectiveCategoryObj = parentObj;
      if (!effectiveSubSlug) {
        effectiveSubSlug = mapping.subcategory;
      }
    }
  }

  // 3. Normalize subcategory slug if it contains 'antic'
  if (effectiveSubSlug.includes('antic') || effectiveSubSlug.includes('antique')) {
    effectiveSubSlug = 'antique-chandelier';
  } else if (effectiveSubSlug === 'led-chandelier' || effectiveSubSlug === 'led chandelier') {
    effectiveSubSlug = 'led-chandelier';
  } else if (effectiveSubSlug === 'classic-chandelier' || effectiveSubSlug === 'classic chandelier') {
    effectiveSubSlug = 'classic-chandelier';
  }

  // 4. Available subcategories for the resolved category
  const availableSubcategories =
    effectiveCategoryObj?.subcategories?.filter((s) => s.isActive !== false) || [];

  // Sort categories: Master categories first, then any other categories
  const masterSlugsSet = new Set(MASTER_CATEGORY_SLUGS);
  const sortedCategories = [
    ...categories.filter((c) => masterSlugsSet.has(c.slug)),
    ...categories.filter((c) => !masterSlugsSet.has(c.slug)),
  ];

  // Handle category change cleanly
  const handleCategoryChange = (newCatId) => {
    if (!newCatId) {
      if (onSelectCategory) onSelectCategory('');
      if (onSelectSubcategory) onSelectSubcategory('', '');
      return;
    }

    const chosenCat = categories.find((c) => String(c._id) === String(newCatId));
    if (!chosenCat) {
      if (onSelectCategory) onSelectCategory(newCatId);
      return;
    }

    // Check if user selected a standalone category (e.g. LED Chandelier or Antique Chandelier)
    if (STANDALONE_PARENT_MAP[chosenCat.slug]) {
      const mapping = STANDALONE_PARENT_MAP[chosenCat.slug];
      const parentObj = categories.find((c) => c.slug === mapping.parentSlug);
      const targetCatId = parentObj ? parentObj._id : newCatId;
      if (onSelectCategory) onSelectCategory(targetCatId);
      if (onSelectSubcategory) onSelectSubcategory(mapping.subcategory, mapping.subcategoryName);
      return;
    }

    // Normal parent category selected
    if (onSelectCategory) onSelectCategory(chosenCat._id);

    // If current subcategory belongs to chosen category, keep it! Otherwise reset
    const validSubs = chosenCat.subcategories?.filter((s) => s.isActive !== false) || [];
    const currentSubMatch = validSubs.find(
      (s) => s.slug === selectedSubcategory || s.slug === effectiveSubSlug
    );

    if (currentSubMatch) {
      if (onSelectSubcategory) onSelectSubcategory(currentSubMatch.slug, currentSubMatch.name);
    } else {
      if (onSelectSubcategory) onSelectSubcategory('', '');
    }
  };

  // Handle subcategory change cleanly
  const handleSubcategoryChange = (subSlug) => {
    if (!subSlug) {
      if (onSelectSubcategory) onSelectSubcategory('', '');
      return;
    }
    const matched = availableSubcategories.find((s) => s.slug === subSlug);
    const subName = matched ? matched.name : subSlug.replace(/-/g, ' ').toUpperCase();
    if (onSelectSubcategory) onSelectSubcategory(subSlug, subName);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* ── CATEGORY SELECTION ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Product Category</span>
          <span className="text-[11px] text-neutral-500 font-normal lowercase">(optional)</span>
        </label>

        <select
          value={effectiveCategoryObj?._id || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium cursor-pointer"
        >
          <option value="" className="bg-[#14171d] text-neutral-400">
            -- Choose a category (Optional) --
          </option>
          {sortedCategories.map((cat) => (
            <option key={cat._id} value={cat._id} className="bg-[#14171d] text-white">
              {cat.icon || '💡'} {cat.name}
            </option>
          ))}
        </select>

        {effectiveCategoryObj && (
          <p className="text-[11px] text-neutral-400">
            Selected: <strong className="text-white">{effectiveCategoryObj.name}</strong>
          </p>
        )}
      </div>

      {/* ── SUBCATEGORY SELECTION ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Subcategory / Type Option</span>
          <span className="text-[11px] text-neutral-500 font-normal lowercase">(optional)</span>
        </label>

        <select
          value={effectiveSubSlug}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          disabled={disabled || !effectiveCategoryObj}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium cursor-pointer"
        >
          <option value="" className="bg-[#14171d] text-neutral-400">
            {effectiveCategoryObj
              ? `-- Direct in ${effectiveCategoryObj.name} (General / No Subcategory) --`
              : '-- Select a Category First --'}
          </option>
          {availableSubcategories.map((sub) => (
            <option key={sub.slug} value={sub.slug} className="bg-[#14171d] text-white">
              {sub.name}
            </option>
          ))}
        </select>

        {effectiveCategoryObj && (
          <p className="text-[11px] text-neutral-400">
            {availableSubcategories.length > 0
              ? `${availableSubcategories.length} sub-item${availableSubcategories.length > 1 ? 's' : ''} available in ${effectiveCategoryObj.name}.`
              : 'No subcategories assigned to this category.'}
          </p>
        )}
      </div>
    </div>
  );
};
