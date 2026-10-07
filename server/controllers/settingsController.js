import SiteSettings from '../models/SiteSettings.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    // Auto-create default settings document if none exists yet
    if (!settings) {
      settings = await SiteSettings.create({
        companyName: 'M/S LIGHT-HUT DECORATIVE SOLUTIONS',
        email: 'lighthutdecorativedlh@gmail.com',
        address: '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018',
        showroomAddress: '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018',
        worksAddress: 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)',
        mapUrl: 'https://www.google.com/maps/place//@28.6394399,77.0974272,17.01z/data=!4m6!1m5!3m4!2zMjjCsDM4JzIyLjAiTiA3N8KwMDYnMDAuMCJF!8m2!3d28.6394482!4d77.1000061?hl=en',
        mapEmbedUrl: 'https://maps.google.com/maps?q=28.6394482,77.1000061&hl=en&z=17&output=embed',
        worksMapUrl: 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en',
        phone: '',
        whatsapp: '',
        socialLinks: {
          instagram: 'https://www.instagram.com/lighthutdecorativesolutions/',
          facebook: 'https://www.facebook.com/profile.php?id=61584975975926',
          pinterest: 'https://pinterest.com',
          youtube: 'https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C',
        },
      });
    } else {
      let needsSave = false;
      if (!settings.companyName || settings.companyName !== 'M/S LIGHT-HUT DECORATIVE SOLUTIONS') {
        settings.companyName = 'M/S LIGHT-HUT DECORATIVE SOLUTIONS';
        needsSave = true;
      }
      if (!settings.email || settings.email !== 'lighthutdecorativedlh@gmail.com') {
        settings.email = 'lighthutdecorativedlh@gmail.com';
        needsSave = true;
      }
      if (!settings.address || settings.address.includes('Sadar Bazaar') || settings.address.includes('LAWRENCE ROAD') || settings.address.includes('Lawrence Road') || !settings.mapUrl.includes('28.6394482')) {
        settings.address = '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018';
        settings.showroomAddress = '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018';
        settings.worksAddress = 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)';
        settings.mapUrl = 'https://www.google.com/maps/place//@28.6394399,77.0974272,17.01z/data=!4m6!1m5!3m4!2zMjjCsDM4JzIyLjAiTiA3N8KwMDYnMDAuMCJF!8m2!3d28.6394482!4d77.1000061?hl=en';
        settings.mapEmbedUrl = 'https://maps.google.com/maps?q=28.6394482,77.1000061&hl=en&z=17&output=embed';
        settings.worksMapUrl = 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en';
        needsSave = true;
      }
      if (settings.phone) {
        settings.phone = '';
        needsSave = true;
      }
      if (settings.whatsapp) {
        settings.whatsapp = '';
        needsSave = true;
      }
      if (!settings.mapUrl) {
        settings.mapUrl = 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en';
        needsSave = true;
      }
      if (!settings.socialLinks) {
        settings.socialLinks = {};
      }
      if (!settings.socialLinks.facebook || settings.socialLinks.facebook === 'https://facebook.com' || settings.socialLinks.facebook === 'https://facebook.com/lighthut') {
        settings.socialLinks.facebook = 'https://www.facebook.com/profile.php?id=61584975975926';
        needsSave = true;
      }
      if (!settings.socialLinks.youtube || settings.socialLinks.youtube === 'https://www.youtube.com' || settings.socialLinks.youtube === 'https://youtube.com') {
        settings.socialLinks.youtube = 'https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C';
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
      }
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    settings.phone = '';
    settings.whatsapp = '';

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully.',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
