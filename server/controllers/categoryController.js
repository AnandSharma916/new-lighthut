import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify } from '../utils/slugify.js';
import { clearCatalogCache } from '../utils/catalogCache.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const filter = isAdmin ? {} : { isActive: true };

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
      .populate('productsCount');

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('productsCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with slug '${req.params.slug}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    let { name, slug, icon, tag, description, image, subcategories, sortOrder, isActive, seoTitle, seoDescription } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existingCategory = await Category.findOne({ slug: generatedSlug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category slug '${generatedSlug}' already exists. Please choose a unique name or slug.`,
      });
    }

    // Determine default sortOrder if not provided
    if (sortOrder === undefined || sortOrder === null) {
      const highestOrder = await Category.findOne().sort({ sortOrder: -1 }).select('sortOrder');
      sortOrder = highestOrder ? highestOrder.sortOrder + 1 : 0;
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      icon: icon || '💡',
      tag: tag || '',
      description: description || '',
      image: image || '',
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      sortOrder: Number(sortOrder),
      isActive: isActive !== undefined ? isActive : true,
      seoTitle: seoTitle || name.trim(),
      seoDescription: seoDescription || description || '',
    });

    clearCatalogCache();

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Including Subcategories list)
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const {
      name,
      slug,
      icon,
      tag,
      description,
      image,
      subcategories,
      sortOrder,
      isActive,
      seoTitle,
      seoDescription,
    } = req.body;

    if (name) category.name = name.trim();
    if (icon !== undefined) category.icon = icon;
    if (tag !== undefined) category.tag = tag;

    if (slug) {
      const newSlug = slugify(slug);
      if (newSlug !== category.slug) {
        const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: `Slug '${newSlug}' is already in use by another category.`,
          });
        }
        category.slug = newSlug;
      }
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;

    // Subcategories update support
    if (Array.isArray(subcategories)) {
      category.subcategories = subcategories.map((sub, idx) => ({
        _id: sub._id,
        name: sub.name?.trim() || 'Untitled Subcategory',
        slug: sub.slug ? slugify(sub.slug) : slugify(sub.name || 'sub'),
        image: sub.image || '',
        desc: sub.desc || '',
        sortOrder: sub.sortOrder !== undefined ? Number(sub.sortOrder) : idx,
        isActive: sub.isActive !== undefined ? Boolean(sub.isActive) : true,
      }));
    }

    await category.save();

    clearCatalogCache();

    res.status(200).json({
      success: true,
      message: 'Category and subcategories updated successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick Rename Category Name
// @route   PATCH /api/categories/:id/rename
// @access  Private (Admin)
export const renameCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const { name, updateSlug = true } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name cannot be empty.',
      });
    }

    const oldName = category.name;
    category.name = name.trim();

    if (updateSlug) {
      const newSlug = slugify(name.trim());
      if (newSlug !== category.slug) {
        const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
        if (!slugExists) {
          category.slug = newSlug;
        }
      }
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: `Category renamed from "${oldName}" to "${category.name}".`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a single subcategory to a category
// @route   POST /api/categories/:id/subcategories
// @access  Private (Admin)
export const addSubcategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const { name, slug, image, desc, sortOrder, isActive } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required.',
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check duplicate slug in same category
    const slugExists = category.subcategories.some((s) => s.slug === generatedSlug);
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: `Subcategory slug '${generatedSlug}' already exists in this category.`,
      });
    }

    const newSubcategory = {
      name: name.trim(),
      slug: generatedSlug,
      image: image || '',
      desc: desc || '',
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : category.subcategories.length,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    category.subcategories.push(newSubcategory);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory added successfully.',
      subcategory: category.subcategories[category.subcategories.length - 1],
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific subcategory
// @route   PUT /api/categories/:id/subcategories/:subId
// @access  Private (Admin)
export const updateSubcategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const subcategory = category.subcategories.id(req.params.subId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found.',
      });
    }

    const { name, slug, image, desc, sortOrder, isActive } = req.body;

    if (name) subcategory.name = name.trim();
    if (slug) {
      const newSlug = slugify(slug);
      // Check if new slug conflicts with another subcategory in the same category
      const conflict = category.subcategories.some(
        (s) => s.slug === newSlug && s._id.toString() !== req.params.subId
      );
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Slug '${newSlug}' is already used by another subcategory.`,
        });
      }
      subcategory.slug = newSlug;
    }
    if (image !== undefined) subcategory.image = image;
    if (desc !== undefined) subcategory.desc = desc;
    if (sortOrder !== undefined) subcategory.sortOrder = Number(sortOrder);
    if (isActive !== undefined) subcategory.isActive = Boolean(isActive);

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully.',
      subcategory,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific subcategory
// @route   DELETE /api/categories/:id/subcategories/:subId
// @access  Private (Admin)
export const deleteSubcategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const subcategory = category.subcategories.id(req.params.subId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found.',
      });
    }

    category.subcategories.pull(req.params.subId);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Check if products belong to this category
    const productsUsingCategory = await Product.countDocuments({ category: category._id });
    if (productsUsingCategory > 0) {
      const isForce = req.query.force === 'true' || req.body?.force === true;
      if (isForce) {
        // Reassign products to a fallback category or clear category
        const fallbackCategory = await Category.findOne({ _id: { $ne: category._id } });
        if (fallbackCategory) {
          await Product.updateMany({ category: category._id }, { category: fallbackCategory._id });
        }
      } else {
        return res.status(400).json({
          success: false,
          hasProducts: true,
          productsCount: productsUsingCategory,
          message: `Cannot delete category: ${productsUsingCategory} product(s) are currently associated with it. Please reassign them or confirm force delete.`,
        });
      }
    }

    await category.deleteOne();

    clearCatalogCache();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder categories in batch
// @route   PUT /api/categories/reorder
// @access  Private (Admin)
export const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of items with id and sortOrder.',
      });
    }

    const updates = items.map((item) =>
      Category.findByIdAndUpdate(item.id, { sortOrder: item.sortOrder })
    );

    await Promise.all(updates);

    const updatedCategories = await Category.find().sort({ sortOrder: 1 });

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully.',
      categories: updatedCategories,
    });
  } catch (error) {
    next(error);
  }
};
