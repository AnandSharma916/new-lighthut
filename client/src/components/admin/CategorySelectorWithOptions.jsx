import React from 'react';
import { Layers, Package } from 'lucide-react';

export const CategorySelectorWithOptions = ({
  categories = [],
  selectedCategoryId = '',
  onSelectCategory,
  selectedSubcategory = '',
  onSelectSubcategory,
  onCategoriesChanged,
  disabled = false,
}) => {
  const selectedCategoryObj = categories.find((c) => c._id === selectedCategoryId) || null;
  const availableSubcategories =
    selectedCategoryObj?.subcategories?.filter((s) => s.isActive !== false) || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* ── STEP 1: CATEGORY SELECTION ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Product Category</span>
            <span className="text-[#DC2626]">*</span>
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">Step 1</span>
        </div>

        {/* The Native Styled Category Dropdown */}
        <select
          value={selectedCategoryId}
          onChange={(e) => onSelectCategory(e.target.value)}
          disabled={disabled}
          required
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium cursor-pointer"
        >
          <option value="" disabled className="bg-[#14171d] text-neutral-500">
            Select a category...
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id} className="bg-[#14171d] text-white">
              {cat.icon || '💡'} {cat.name}
            </option>
          ))}
        </select>

        {selectedCategoryObj && (
          <p className="text-[11px] text-neutral-400">
            Selected: <strong className="text-white">{selectedCategoryObj.name}</strong> (slug: /{selectedCategoryObj.slug || '-'})
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
          value={selectedSubcategory}
          onChange={(e) => {
            const subSlug = e.target.value;
            const matched = availableSubcategories.find((s) => s.slug === subSlug);
            onSelectSubcategory(subSlug, matched ? matched.name : (subSlug ? subSlug.replace(/-/g, ' ').toUpperCase() : ''));
          }}
          disabled={disabled || !selectedCategoryObj}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#DC2626] focus:outline-none transition-all text-sm font-medium cursor-pointer"
        >
          <option value="" className="bg-[#14171d] text-neutral-400">
            {selectedCategoryObj
              ? `-- Direct in ${selectedCategoryObj.name} (General / No Subcategory) --`
              : '-- Select a Category First --'}
          </option>
          {availableSubcategories.map((sub) => (
            <option key={sub.slug} value={sub.slug} className="bg-[#14171d] text-white">
              {sub.name}
            </option>
          ))}
        </select>

        {selectedCategoryObj && (
          <p className="text-[11px] text-neutral-400">
            {availableSubcategories.length > 0
              ? `${availableSubcategories.length} sub-item${availableSubcategories.length > 1 ? 's' : ''} available in ${selectedCategoryObj.name}.`
              : 'No subcategories assigned to this category.'}
          </p>
        )}
      </div>
    </div>
  );
};
