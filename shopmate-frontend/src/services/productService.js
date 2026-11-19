import { apiClient } from './api';

export const productService = {
  /**
   * Fetch all products from Spring Boot database with optional filters
   * GET /api/products
   * @param {Object} params - Query parameters (category, search, minPrice, maxPrice, sortBy, hasDedicatedGpu)
   */
  async getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },

  /**
   * Fetch a single product by ID from database
   * GET /api/products/{id}
   * @param {string} id - Product ID
   */
  async getProductById(id) {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Search products by keyword
   * GET /api/products/search?q={query}
   * @param {string} query
   */
  async searchProducts(query) {
    return apiClient.get('/products/search', { params: { q: query } });
  },

  /**
   * Get available product categories
   * GET /api/products/categories
   */
  async getCategories() {
    return apiClient.get('/products/categories');
  },
};

export default productService;
