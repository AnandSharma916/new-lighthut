import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
import { productService } from '../../services/api';
import { NEUTRAL_FALLBACK_IMAGE } from '../../utils/imageCompressor';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ search: searchTerm, limit: 6 });
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-6 py-4 border-b border-neutral-200 bg-[#f8fafc]">
              <Search className="w-5 h-5 text-[#DC2626] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search luminaires by name, SKU (e.g. LH-6031W), material..."
                className="w-full bg-transparent text-neutral-900 placeholder-neutral-400 focus:outline-none text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    handleViewAll();
                  } else if (e.key === 'Escape') {
                    onClose();
                  }
                }}
              />
              {loading && <Loader2 className="w-5 h-5 text-[#DC2626] animate-spin mr-3 shrink-0" />}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 modal-scrollbar">
              {results.length > 0 ? (
                <div>
                  <div className="text-xs uppercase tracking-luxury text-[#DC2626] px-3 py-2 font-bold">
                    Matching Luminaires ({results.length})
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img
                            src={product.images?.[0]?.url || NEUTRAL_FALLBACK_IMAGE}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = NEUTRAL_FALLBACK_IMAGE;
                            }}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded">
                              {product.sku}
                            </span>
                            {product.category?.name && (
                              <span className="text-xs text-neutral-500 truncate">
                                {product.category.name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-neutral-900 truncate mt-1 group-hover:text-[#DC2626] transition-colors">
                            {product.name}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-2 border-t border-neutral-100 px-2">
                    <button
                      onClick={handleViewAll}
                      className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-luxury text-[#DC2626] hover:text-neutral-900 transition-colors flex items-center justify-center gap-2"
                    >
                      View all results in catalog <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : searchTerm.trim() ? (
                <div className="py-12 text-center text-neutral-500">
                  <Lightbulb className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm font-medium">No luminaires found matching "{searchTerm}"</p>
                  <p className="text-xs text-neutral-400 mt-1">Try searching by category, finish, or model code</p>
                </div>
              ) : (
                <div className="py-8 px-4 text-center">
                  <p className="text-xs uppercase tracking-luxury text-neutral-500 font-semibold mb-3">Popular Searches</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Wall Lamp', 'LED Chandelier', 'Pendant Lamp', 'Double Height', 'Outdoor Light', 'Dining Table Lamp', 'Table Lamp', 'Floor Lamp', 'Filament Bulb', 'Spare Driver'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1.5 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border border-neutral-200 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
