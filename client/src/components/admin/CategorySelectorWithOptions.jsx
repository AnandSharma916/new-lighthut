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
  }

  // 4. Available subcategories for the resolved category
  const availableSubcategories =
    effectiveCategoryObj?.subcategories?.filter((s) => s.isActive !== false) || [];

  // 5. Separate master categories for clean display
  const masterSlugsSet = new Set(MASTER_CATEGORY_SLUGS);
  const masterCategories = categories.filter((c) => masterSlugsSet.has(c.slug));
  const otherCategories = categories.filter((c) => !masterSlugsSet.has(c.slug));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* ── STEP 1: CATEGORY SELECTION ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Product Category</span>
            <span className="text-[11px] text-neutral-500 font-normal lowercase">(optional)</span>
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">Step 1</span>
        </div>

        {/* The Native Styled Category Dropdown */}
        <select
          value={effectiveCategoryObj?._id || ''}
          onChange={(e) => {
            const newCatId = e.target.value;
            onSelectCategory(newCatId);
          }}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium cursor-pointer"
        >
          <option value="" className="bg-[#14171d] text-neutral-400">
            -- Choose a category (Optional) --
          </option>
          {masterCategories.length > 0 && (
            <optgroup label="Primary Architectural Categories" className="bg-[#14171d] text-neutral-300 font-semibold">
              {masterCategories.map((cat) => (
                <option key={cat._id} value={cat._id} className="bg-[#14171d] text-white">
                  {cat.icon || '💡'} {cat.name} ({cat.subcategories?.length || 0} sub-types)
                </option>
              ))}
            </optgroup>
          )}
          {otherCategories.length > 0 && (
            <optgroup label="Other / Standalone Categories" className="bg-[#14171d] text-neutral-400 font-normal">
              {otherCategories.map((cat) => (
                <option key={cat._id} value={cat._id} className="bg-[#14171d] text-neutral-300">
                  {cat.icon || '💡'} {cat.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        {effectiveCategoryObj && (
          <p className="text-[11px] text-neutral-400">
            Selected: <strong className="text-white">{effectiveCategoryObj.name}</strong> (slug: /{effectiveCategoryObj.slug || '-'})
          </p>
        )}
      </div>

      {/* ── STEP 2: SUBCATEGORY SELECTION ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Subcategory / Type Option</span>
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">Step 2</span>
        </div>

        {/* Subcategory Dropdown */}
        <select
          value={effectiveSubSlug}
          onChange={(e) => {
            const subSlug = e.target.value;
            const matched = availableSubcategories.find((s) => s.slug === subSlug);
            onSelectSubcategory(
              subSlug,
              matched ? matched.name : (subSlug ? subSlug.replace(/-/g, ' ').toUpperCase() : '')
            );
          }}
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
