const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // In Next.js client/SSR, avoid stale cache where appropriate
      cache: options.cache || 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    // If response is an array, attach .data alias so callers expecting array or res.data both succeed
    if (Array.isArray(data)) {
      data.data = data;
    }
    return data;
  } catch (err) {
    console.error(`Frontend API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message || err);
    throw err;
  }
}

export const api = {
  // Products Master Catalog
  products: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams();
      if (params.category && params.category !== 'all') q.append('category', params.category);
      if (params.brandId && params.brandId !== 'all') q.append('brandId', params.brandId);
      if (params.categoryId && params.categoryId !== 'all') q.append('categoryId', params.categoryId);
      if (params.brandRefId && params.brandRefId !== 'all') q.append('brandRefId', params.brandRefId);
      if (params.search) q.append('search', params.search);
      if (params.stockStatus) q.append('stockStatus', params.stockStatus);
      if (params.minPrice) q.append('minPrice', params.minPrice);
      if (params.maxPrice) q.append('maxPrice', params.maxPrice);
      if (params.page) q.append('page', params.page);
      if (params.limit) q.append('limit', params.limit);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return fetchJson(`/products${queryStr}`);
    },
    getOne: async (idOrSlug) => {
      const res = await fetchJson(`/products/${idOrSlug}`);
      return res?.data || res;
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      return fetchJson('/categories');
    },
    getOne: async (id) => {
      return fetchJson(`/categories/${id}`);
    },
  },

  // Textile Brands
  brands: {
    getAll: async () => {
      return fetchJson('/brands');
    },
    getOne: async (id) => {
      return fetchJson(`/brands/${id}`);
    },
  },

  // Storefront CMS
  cms: {
    getBanners: async () => {
      return fetchJson('/cms/banners');
    },
    getAnnouncement: async () => {
      return fetchJson('/cms/announcement');
    },
    getPages: async () => {
      return fetchJson('/cms/pages');
    },
    getPage: async (slug) => {
      return fetchJson(`/cms/pages/${slug}`);
    },
  },

  // Promotional Offers & Discounts
  offers: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams();
      if (params.isActive !== undefined) q.append('isActive', params.isActive);
      if (params.targetType) q.append('targetType', params.targetType);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return fetchJson(`/offers${queryStr}`);
    },
  },

  // Coupons
  coupons: {
    validate: async (code, cartTotal) => {
      return fetchJson('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, cartTotal }),
      });
    },
  },
};
