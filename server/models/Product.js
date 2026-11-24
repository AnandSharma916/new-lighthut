import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  isCover: {
    type: Boolean,
    default: false,
  },
  publicId: {
    type: String,
    default: '',
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'New Luminaire',
      trim: true,
      maxlength: [180, 'Product name cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
      index: true,
    },
    subcategory: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
      index: true,
    },
    subcategoryName: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    specifications: {
      dimensions: { type: String, default: '' },
      material: { type: String, default: '' },
      finish: { type: String, default: '' },
      wattage: { type: String, default: '' },
      voltage: { type: String, default: '' },
      colorTemperature: { type: String, default: '' },
      ipRating: { type: String, default: '' },
      installationType: { type: String, default: '' },
      beamAngle: { type: String, default: '' },
      cri: { type: String, default: '' },
      luminousFlux: { type: String, default: '' },
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for primary/cover image URL
productSchema.virtual('mainImage').get(function () {
  if (this.images && this.images.length > 0) {
    const cover = this.images.find((img) => img.isCover);
    return cover ? cover.url : this.images[0].url;
  }
  return '';
});

// High-performance compound indexes for instant zero-memory catalog sorting
productSchema.index({ isPublished: 1, subcategory: 1, isFeatured: -1, sortOrder: 1, createdAt: -1 });
productSchema.index({ isPublished: 1, createdAt: -1 });
productSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
productSchema.index({ category: 1, isPublished: 1 });

// Full-text search index for fast searching across name, SKU, and descriptions
productSchema.index({
  name: 'text',
  sku: 'text',
  shortDescription: 'text',
  description: 'text',
  'specifications.material': 'text',
  'specifications.finish': 'text',
});

const Product = mongoose.model('Product', productSchema);
export default Product;
