let cache = {
  categoriesMetadata: null, // { structuredCategories, allPublishedTotal }
  lastUpdated: 0,
};

const TTL_MS = 60 * 1000; // 60 seconds
const queryCache = new Map();
const QUERY_CACHE_TTL = 60 * 1000; // 60 seconds

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

export const getCachedQueryResult = (key) => {
  const item = queryCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > QUERY_CACHE_TTL) {
    queryCache.delete(key);
    return null;
  }
  return item.data;
};

export const setCachedQueryResult = (key, data) => {
  if (queryCache.size > 100) {
    const oldestKey = queryCache.keys().next().value;
    queryCache.delete(oldestKey);
  }
  queryCache.set(key, { data, timestamp: Date.now() });
};

export const clearCatalogCache = () => {
  cache.categoriesMetadata = null;
  cache.lastUpdated = 0;
  queryCache.clear();
};
