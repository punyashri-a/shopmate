import { apiClient, DEFAULT_CUSTOMER_ID } from './api';

export const savedProductService = {
  /**
   * GET /api/saved-products?customerId={customerId}
   * @param {string} [customerId]
   */
  async getSavedProducts(customerId = DEFAULT_CUSTOMER_ID) {
    return apiClient.get('/saved-products', {
      params: { customerId },
    });
  },

  /**
   * POST /api/saved-products
   * @param {Object} product - Full product or product ID
   * @param {string} [customerId]
   */
  async saveProduct(product, customerId = DEFAULT_CUSTOMER_ID) {
    const payload = {
      customerId,
      productId: typeof product === 'string' ? product : product.id,
      product: typeof product === 'object' ? product : undefined,
    };
    return apiClient.post('/saved-products', payload);
  },

  /**
   * DELETE /api/saved-products/{productId}?customerId={customerId}
   * @param {string} productId
   * @param {string} [customerId]
   */
  async removeSavedProduct(productId, customerId = DEFAULT_CUSTOMER_ID) {
    return apiClient.delete(`/saved-products/${productId}`, {
      params: { customerId },
    });
  },
};

export default savedProductService;
