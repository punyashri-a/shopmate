import { apiClient, DEFAULT_CUSTOMER_ID } from './api';

export const aiService = {
  /**
   * Global AI Mode Chat (Spring AI with Tool Calling & Catalog Recommendations)
   * POST /api/ai/chat
   * @param {Object} payload
   * @param {string} payload.message - User prompt / question
   * @param {string} [payload.conversationId] - Ongoing conversation session ID
   * @param {string} [payload.customerId] - Customer ID for personalization
   */
  async sendChatMessage({ message, conversationId, customerId = DEFAULT_CUSTOMER_ID }) {
    return apiClient.post('/ai/chat', {
      message,
      conversationId: conversationId || `conv_${Date.now()}`,
      customerId,
    });
  },

  /**
   * In-Product Contextual AI Chat (Spring AI contextualized to a single active product)
   * POST /api/ai/product-chat
   * @param {Object} payload
   * @param {string} payload.productId - ID of product currently being viewed
   * @param {string} payload.message - User question or command (e.g. "Why is this better?", "Save this", "Show alternatives")
   * @param {string} [payload.conversationId] - In-product drawer conversation ID
   * @param {string} [payload.customerId] - Customer ID
   */
  async sendProductChatMessage({ productId, message, conversationId, customerId = DEFAULT_CUSTOMER_ID }) {
    return apiClient.post('/ai/product-chat', {
      productId,
      message,
      conversationId: conversationId || `pconv_${Date.now()}`,
      customerId,
    });
  },
};

export default aiService;
