/**
 * LightHut Image Compressor & Luxury Fallback Engine
 * Ensures 0ms instant photo previews, client-side downscaling (100% immune to 404s),
 * and prevents placeholder chandelier images from appearing repeatedly.
 */

export const NEUTRAL_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='%23111318'/><circle cx='300' cy='270' r='90' stroke='%232e3542' stroke-width='4' fill='%23171a22'/><path d='M300 180v180M210 270h180' stroke='%23475266' stroke-width='4' stroke-linecap='round'/><text x='300' y='425' fill='%239ca3af' font-family='system-ui, -apple-system, sans-serif' font-size='18' font-weight='700' text-anchor='middle' letter-spacing='3'>LIGHTHUT</text><text x='300' y='455' fill='%236b7280' font-family='system-ui, -apple-system, sans-serif' font-size='12' font-weight='500' text-anchor='middle' letter-spacing='2'>LUXURY LUMINAIRE</text></svg>";

/**
 * Intelligently derives a clean, human-readable model SKU from a product name.
 * e.g. "LH-920GL Gate Lamp" -> "LH-920GL"
 * e.g. "LH-812/1L LED HANGING LAMP" -> "LH-812/1L"
 * e.g. "Royal Chandelier 501" -> "LH-ROYAL-501"
 */
export const extractModelSku = (name = '') => {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  // Match standard LightHut prefix like LH-920GL, LH-812/1L-3L, LH-CH101, LH-172W, LH-SP101
  const lhMatch = trimmed.match(/\b(LH-[A-Za-z0-9\/-]+)/i);
  if (lhMatch) return lhMatch[1].toUpperCase();

  // Match model codes like 920GL, CH101, 812/1L
  const codeMatch = trimmed.match(/^([A-Za-z0-9]+-[A-Za-z0-9\/-]+)/);
  if (codeMatch) return `LH-${codeMatch[1].toUpperCase()}`;

  // Take first 1-2 words cleaned
  const cleanWords = trimmed
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join('-')
    .toUpperCase();

  return cleanWords ? (cleanWords.startsWith('LH-') ? cleanWords : `LH-${cleanWords}`) : 'LH-LUMINAIRE';
};

/**
 * Checks if a given image URL is an old stock placeholder or chandelier default.
 * Returns true if it is a placeholder that should be replaced when a user uploads real photos.
 */
export const isPlaceholderPhoto = (url = '') => {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim();
  if (!clean) return true;

  // Never treat user Base64 data URLs as placeholders
  if (clean.startsWith('data:image/')) return false;

  // Never treat user external/Cloudinary URLs as placeholders
  if (
    clean.includes('res.cloudinary.com') ||
    clean.includes('postimg.cc') ||
    clean.includes('imgur.com') ||
    clean.includes('unsplash.com') ||
    clean.includes('images.pexels.com')
  ) {
    return false;
  }

  const lower = clean.toLowerCase();
  return (
    lower.includes('/categories/') ||
    lower.includes('chandelier') ||
    lower.includes('placeholder') ||
    lower.includes('hero-chandelier') ||
    lower.includes('philosophy-grand-chandelier') ||
    lower.includes('craft-main.jpg') ||
    lower.includes('showroom-hero') ||
    lower.includes('double-height.jpg') ||
    lower.includes('default-') ||
    lower === '/categories/chandelier.jpg' ||
    lower === '/hero-chandelier.jpg'
  );
};

/**
 * Returns an appropriate fallback image. Never defaults to chandelier unless
 * the category explicitly matches chandeliers.
 */
export const getFallbackForCategory = (cat = '') => {
  const c = String(cat || '').toLowerCase();
  if (c.includes('wall')) return '/categories/wall-lamp.jpg';
  if (c.includes('pendant') || c.includes('hanging')) return '/categories/pendant-lamp.jpg';
  if (c.includes('table')) return '/categories/table-lamp.jpg';
  if (c.includes('floor')) return '/categories/floor-lamp.jpg';
  if (c.includes('outdoor') || c.includes('gate')) return '/categories/outdoor-light.jpg';
  if (c.includes('dining')) return '/categories/dining-table-lamp.jpg';
  if (c.includes('bulb') || c.includes('filament')) return '/categories/led-filament-bulb.jpg';
  if (c.includes('driver')) return '/categories/spare-driver.jpg';
  if (c.includes('base') || c.includes('spare')) return '/categories/hanging-base.jpg';
  if (c.includes('chandelier')) return '/categories/chandelier.jpg';
  return NEUTRAL_FALLBACK_IMAGE;
};

/**
 * Compress an image file using browser HTML5 Canvas.
 * Produces a crisp, lightweight Base64 Data URL (typically 60-150 KB)
 * and an uploadable compressed File/Blob.
 */
export const compressImageFile = (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    outputType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      return reject(new Error('Invalid image file provided.'));
    }

    // Direct data URL for SVG vectors
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result, file, size: file.size });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const rawDataUrl = event.target.result;
      const img = new Image();

      img.onerror = () => {
        // Fallback to raw data URL if canvas cannot decode
        resolve({ dataUrl: rawDataUrl, file, size: file.size });
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Proportional downscale
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ dataUrl: rawDataUrl, file, size: file.size });
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const mime = file.type === 'image/png' && file.size < 400 * 1024 ? 'image/png' : outputType;
          const dataUrl = canvas.toDataURL(mime, quality);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve({ dataUrl, file, size: file.size });
              }
              const cleanBase = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'product-photo';
              const ext = mime === 'image/png' ? '.png' : '.jpg';
              const compressedFile = new File([blob], `${cleanBase}${ext}`, {
                type: mime,
                lastModified: Date.now(),
              });

              resolve({
                dataUrl,
                file: compressedFile,
                width,
                height,
                size: compressedFile.size,
              });
            },
            mime,
            quality
          );
        } catch (err) {
          console.warn('[ImageCompressor] Canvas failed, fallback to raw data URL:', err);
          resolve({ dataUrl: rawDataUrl, file, size: file.size });
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
};
