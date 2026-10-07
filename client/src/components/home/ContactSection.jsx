import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, MessageSquare, Send, Clock, Loader2, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { inquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ContactSection = ({ section }) => {
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const title = section?.title || 'Visit or Contact Us';
  const subtitle = section?.subtitle || 'WE ARE HERE TO HELP';
  const description =
    section?.description ||
    'Have questions about lamp specifications, custom sizes, or delivery? Our lighting team is happy to assist you.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please provide your name, email, and message.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await inquiryService.createInquiry(formData);
      addToast('Message sent successfully! Our team will contact you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      addToast('Failed to submit message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] uppercase tracking-wider text-[#DC2626] font-bold mb-3">
            <Sparkles className="w-3 h-3 text-[#DC2626]" />
            <span>{subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Details & Showroom */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#f8fafc] border border-neutral-200 space-y-5 shadow-sm">
              <h3 className="font-serif-luxury text-lg text-neutral-900 font-bold">
                Direct Contact
              </h3>

              {/* Showroom Address */}
              <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-900 font-semibold block mb-0.5 uppercase tracking-wide text-[11px]">Showroom Address</span>
                  <span>{settings.address || '4B/27, Upper floor, Opp Govt School Gate no-02, Devki Nandan road, Lighting market, Tilak Nagar, New Delhi - 110018'}</span>
                  <a
                    href={settings.mapUrl || 'https://www.google.com/maps/place//@28.6394399,77.0974272,17.01z/data=!4m6!1m5!3m4!2zMjjCsDM4JzIyLjAiTiA3N8KwMDYnMDAuMCJF!8m2!3d28.6394482!4d77.1000061?hl=en'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#DC2626] hover:text-[#B91C1C] font-semibold text-[11px] mt-1 transition-colors"
                  >
                    View Showroom on Google Maps ↗
                  </a>
                </div>
              </div>

              {/* Works Address */}
              <div className="flex items-start gap-3.5 text-xs text-neutral-600 pt-3 border-t border-neutral-200/60">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-900 font-semibold block mb-0.5 uppercase tracking-wide text-[11px]">Works Address</span>
                  <span className="block text-neutral-700">{settings?.worksAddress || 'C37/4, Lawrence Road, Industrial Area, New Delhi - 110035 (Near Metro Station Kanhaiya Nagar)'}</span>
                  <a
                    href={settings?.worksMapUrl || 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#DC2626] hover:text-[#B91C1C] font-semibold text-[11px] mt-1 transition-colors"
                  >
                    View Works on Google Maps ↗
                  </a>
                </div>
              </div>

              {settings.email && (
                <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                  <Mail className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-900 font-semibold block mb-0.5">Email</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-neutral-900 transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-900 font-semibold block mb-0.5">Opening Hours</span>
                  <span>Monday – Saturday: 10:00 AM – 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simple Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#f8fafc] border border-neutral-200 shadow-md">
              <h3 className="font-serif-luxury text-xl text-neutral-900 font-bold mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-neutral-600 mb-6">
                Fill in your details below and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Delhi, Mumbai, Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                    What lights are you looking for? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the room, preferred style (chandeliers, wall lights, pendants), or any specific models you liked..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
