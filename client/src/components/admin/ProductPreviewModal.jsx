import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Package,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEUTRAL_FALLBACK_IMAGE } from '../../utils/imageCompressor';

export const ProductPreviewModal = ({
  isOpen,
  onClose,
  product,
  categoryName = '',
  isJustUpdated = false,
  onBackToList,
}) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  if (!isOpen || !product) return null;

  const title = product.title || product.name || 'Untitled Luminaire';
  const slug = product.slug || '';
  const sku = product.sku && !/^LH-\d{6}-\d{3}$/i.test(product.sku) ? product.sku : '';
  const price = Number(product.price) || 0;
  const isPublished = Boolean(product.isPublished);

  // Extract images
  const images = [];
  if (product.mainImage) {
    images.push(product.mainImage);
  }
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      const url = typeof img === 'string' ? img : img.url;
      if (url && !images.includes(url)) {
        images.push(url);
      }
    });
  }

  const activeImage = images[selectedImgIdx] || images[0] || '';
  const specs = product.specifications || {};

  const specsList = [
    { label: 'Category', value: categoryName || product.category?.name || 'Architectural Lighting' },
    { label: 'Wattage', value: specs.wattage },
    { label: 'Voltage', value: specs.voltage },
    { label: 'Color Temperature (CCT)', value: specs.colorTemperature },
    { label: 'Beam Angle', value: specs.beamAngle },
    { label: 'Ingress Protection', value: specs.ipRating },
    { label: 'Material & Construction', value: specs.material },
    { label: 'Finish / Plating', value: specs.finish },
    { label: 'Color Rendering (CRI)', value: specs.cri },
    { label: 'Dimensions', value: specs.dimensions },
    { label: 'Installation', value: specs.installationType },
    { label: 'Luminous Flux', value: specs.luminousFlux || specs.lumens },
  ].filter((s) => s.value && String(s.value).trim() !== '');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#12151b] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Banner (if just updated) */}
          {isJustUpdated && (
            <div className="bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-transparent border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Update Successful! Your luminaire changes are saved and live in catalog.</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                SAVED
              </span>
            </div>
          )}

          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1014]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif-luxury font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Storefront Live Preview</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isPublished
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {isPublished ? 'Live on Storefront' : 'Saved as Draft'}
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  /product/{slug || sku.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {slug && (
                <a
                  href={`/product/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 hover:border-[#DC2626]/40 transition-all"
                  title="Open storefront page in new tab"
                >
                  <span>Open in Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DC2626]" />
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Preview Body */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 modal-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Gallery Preview */}
              <div className="space-y-3">
                <div className="w-full h-72 sm:h-80 rounded-2xl bg-[#090a0d] border border-white/10 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = NEUTRAL_FALLBACK_IMAGE;
                      }}
                      alt={title}
                      className="w-full h-full object-contain p-2 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-center text-neutral-600">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <span className="text-xs">No luminaire imagery uploaded</span>
                    </div>
                  )}

                  {/* Highlights Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.isFeatured && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#DC2626] text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-md">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImgIdx(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImgIdx === idx
                            ? 'border-[#DC2626] scale-105 shadow-md'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = NEUTRAL_FALLBACK_IMAGE;
                          }}
                          alt={`Thumb ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Luminaire Details Preview */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#DC2626] font-semibold block mb-1">
                    {categoryName || product.category?.name || 'Architectural Lighting'}{sku ? ` • SKU: ${sku}` : ''}
                  </span>
                  <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide leading-snug">
                    {title}
                  </h2>
                  <div className="mt-2 text-lg font-mono font-bold text-white flex items-baseline gap-2">
                    <span>{price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Custom Architectural Quote'}</span>
                    <span className="text-[10px] text-neutral-400 font-normal uppercase tracking-wider">
                      (Excl. Taxes)
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-xs text-neutral-300 leading-relaxed bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    {product.shortDescription}
                  </p>
                )}

                {/* Specifications Key Highlights */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-luxury text-neutral-400 font-bold block">
                    Key Architectural Specifications ({specsList.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {specsList.slice(0, 8).map((spec, i) => (
                      <div
                        key={i}
                        className="bg-[#090a0d] border border-white/5 rounded-lg p-2 flex flex-col"
                      >
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                          {spec.label}
                        </span>
                        <span className="text-white font-medium truncate mt-0.5" title={spec.value}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Sheet Link Preview */}
                {product.pdfUrl && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                    <FileText className="w-4 h-4 text-[#DC2626]" />
                    <span className="truncate flex-1 font-mono text-[11px]">{product.pdfUrl}</span>
                    <a
                      href={product.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DC2626] hover:underline text-[11px] font-semibold shrink-0"
                    >
                      View PDF ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Long Description (if present) */}
            {product.description && (
              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-luxury text-neutral-400 font-bold block mb-1.5">
                  Detailed Luminaire Architectural Narrative
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#0e1014] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onBackToList && (
                <button
                  type="button"
                  onClick={onBackToList}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-luxury transition-colors border border-white/10"
                >
                  ← Products Catalog
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-luxury transition-colors border border-white/10"
              >
                Continue Editing
              </button>
            </div>

            {slug && (
              <a
                href={`/product/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-gold px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open Storefront Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
