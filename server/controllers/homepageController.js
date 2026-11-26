import HomepageSection from '../models/HomepageSection.js';

// @desc    Get enabled homepage sections
// @route   GET /api/homepage
// @access  Public
export const getHomepage = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find({ isEnabled: true }).sort({ order: 1 });
    res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    res.status(200).json({
      success: true,
      count: sections.length,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all homepage sections (including disabled)
// @route   GET /api/homepage/sections
// @access  Private (Admin)
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: sections.length,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a homepage section
// @route   PUT /api/homepage/sections/:id
// @access  Private (Admin)
export const updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    let section = await HomepageSection.findById(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Homepage section not found',
      });
    }

    Object.assign(section, req.body);
    await section.save();

    res.status(200).json({
      success: true,
      message: 'Homepage section updated successfully',
      section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder homepage sections
// @route   PUT /api/homepage/sections/reorder
// @access  Private (Admin)
export const reorderSections = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds must be an array of section IDs',
      });
    }

    const updateOps = orderedIds.map((id, index) =>
      HomepageSection.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updateOps);

    res.status(200).json({
      success: true,
      message: 'Homepage sections reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
