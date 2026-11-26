let cache = {
  categoriesMetadata: null, // { structuredCategories, allPublishedTotal }
  lastUpdated: 0,
};

const TTL_MS = 60 * 1000; // 60 seconds

export const getCachedCategoriesMetadata = () => {
  if (cache.categoriesMetadata && Date.now() - cache.lastUpdated < TTL_MS) {
    return cache.categoriesMetadata;
  }
  return null;
};

export const setCachedCategoriesMetadata = (data) => {
  cache.categoriesMetadata = data;
  cache.lastUpdated = Date.now();
};

export const clearCatalogCache = () => {
  cache.categoriesMetadata = null;
  cache.lastUpdated = 0;
};
