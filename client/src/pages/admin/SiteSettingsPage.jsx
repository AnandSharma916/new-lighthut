import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Loader2,
  Building2,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { settingsService } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const SiteSettingsPage = () => {
  const { settings, refreshSettings } = useSettings();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    logo: '',
    favicon: '',
    email: '',
    phone: '',
    address: '',
    worksAddress: '',
    whatsapp: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      pinterest: '',
      youtube: '',
    },
    footerContent: {
      copyrightText: '',
      aboutText: '',
      gstNumber: '',
    },
    defaultSeoTitle: '',
    defaultSeoDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        tagline: settings.tagline || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        worksAddress: settings.worksAddress || '',
        whatsapp: settings.whatsapp || '',
        socialLinks: {
          instagram: settings.socialLinks?.instagram || '',
          facebook: settings.socialLinks?.facebook || '',
          pinterest: settings.socialLinks?.pinterest || '',
        },
        footerContent: {
          copyrightText: settings.footerContent?.copyrightText || '',
          aboutText: settings.footerContent?.aboutText || '',
          gstNumber: settings.footerContent?.gstNumber || '',
        },
        defaultSeoTitle: settings.defaultSeoTitle || '',
        defaultSeoDescription: settings.defaultSeoDescription || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await settingsService.updateSettings(formData);
      if (res.success) {
        addToast('Site settings updated across the application.', 'success');
        if (refreshSettings) refreshSettings();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Global Metadata & Branding
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Site Architecture Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure enterprise brand typography, contact channels, legal registration, and global SEO meta declarations.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-gold px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 self-start sm:self-auto shadow-xl disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Global Settings</span>
            </>
          )}
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Brand Identity */}
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h2 className="text-base font-serif-luxury font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#DC2626]" />
            <span>Brand Identity & Logo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Luxury Designer Lighting"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Official Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Architectural & Luxury Decorative Luminaires"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Storefront Header Brand Logo
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <ImageUploader
                  label="Upload Brand Logo Asset (PNG, SVG, WebP)"
                  onUploadSuccess={(url) => setFormData((p) => ({ ...p, logo: url }))}
                />
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="Or direct logo URL (/uploads, CDN, SVG)..."
                  className="w-full px-3 py-2 mt-2 rounded-xl bg-[#090a0d] border border-white/10 text-xs text-white placeholder-neutral-600 font-mono"
                />
              </div>

              <div className="h-28 rounded-xl bg-[#090a0d] border border-white/10 p-3 flex items-center justify-center">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="max-h-16 w-auto object-contain" />
                ) : (
                  <span className="text-xs text-neutral-600">Default SVG icon in use</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Browser Favicon Icon
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <ImageUploader
                  label="Upload Favicon Icon (PNG, SVG, ICO)"
                  onUploadSuccess={(url) => setFormData((p) => ({ ...p, favicon: url }))}
                />
                <input
                  type="text"
                  name="favicon"
                  value={formData.favicon}
                  onChange={handleChange}
                  placeholder="Or direct favicon URL (/uploads, ICO, PNG)..."
                  className="w-full px-3 py-2 mt-2 rounded-xl bg-[#090a0d] border border-white/10 text-xs text-white placeholder-neutral-600 font-mono"
                />
              </div>

              <div className="h-28 rounded-xl bg-[#090a0d] border border-white/10 p-3 flex items-center justify-center">
                {formData.favicon ? (
                  <img src={formData.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-xs text-neutral-600">Default favicon in use</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Direct Contact Details */}
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h2 className="text-base font-serif-luxury font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#DC2626]" />
            <span>Consultation & Contact Channels</span>
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Sales & Inquiries Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@lightingstudio.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Showroom Address
              </label>
              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Showroom Address..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Works Address (Factory / Manufacturing)
              </label>
              <textarea
                rows={3}
                name="worksAddress"
                value={formData.worksAddress}
                onChange={handleChange}
                placeholder="Leave blank or enter works address..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Legal & Social Links */}
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h2 className="text-base font-serif-luxury font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#DC2626]" />
            <span>Digital Footprint & Regulatory</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                GST Number
              </label>
              <input
                type="text"
                value={formData.footerContent.gstNumber}
                onChange={(e) => handleNestedChange('footerContent', 'gstNumber', e.target.value)}
                placeholder="07BSYPK8425N1ZP"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.facebook || ''}
                onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                placeholder="https://www.facebook.com/profile.php?id=61584975975926"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                placeholder="https://www.instagram.com/lighthutdecorativesolutions/"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube || ''}
                onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                placeholder="https://youtube.com/@light-hutdecorativesolutions?si=KKvN5-pzw1JikI-C"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Footer About Snippet
            </label>
            <textarea
              rows={3}
              value={formData.footerContent.aboutText}
              onChange={(e) => handleNestedChange('footerContent', 'aboutText', e.target.value)}
              placeholder="Pioneering contemporary architectural lighting solutions..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs"
            />
          </div>
        </div>

        {/* 4. Default Search Engine Optimization */}
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h2 className="text-base font-serif-luxury font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
            <span>Search Engine Optimization (SEO) Defaults</span>
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Default HTML Title Tag
            </label>
            <input
              type="text"
              name="defaultSeoTitle"
              value={formData.defaultSeoTitle}
              onChange={handleChange}
              placeholder="Luxury Designer Lamps & Home Lighting"
              className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Default Meta Description
            </label>
            <textarea
              rows={2}
              name="defaultSeoDescription"
              value={formData.defaultSeoDescription}
              onChange={handleChange}
              placeholder="Discover high-performance architectural wall lamps, pendant luminaires, and custom fixtures."
              className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 shadow-2xl disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
