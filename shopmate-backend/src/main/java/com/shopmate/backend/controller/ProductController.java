package com.shopmate.backend.controller;

import com.shopmate.backend.dto.SaveProductRequest;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.entity.SavedProduct;
import com.shopmate.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // =========================================================================
    // Product Catalog Endpoints
    // =========================================================================

    /**
     * GET /api/products
     * Fetch products from database with optional filters, search keyword, and sorting.
     */
    @GetMapping("/api/products")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String priceFilter,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Boolean hasDedicatedGpu) {

        List<Product> products = productService.getProducts(
                category, search, priceFilter, minPrice, maxPrice, sortBy, hasDedicatedGpu
        );
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/search?q={query}
     * Search products by keyword query.
     */
    @GetMapping("/api/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String query) {
        List<Product> products = productService.getProducts(
                null, query, null, null, null, null, null
        );
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/categories
     * Fetch all distinct product categories.
     */
    @GetMapping("/api/products/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * GET /api/products/{id}
     * Fetch a single product by its unique identifier.
     */
    @GetMapping("/api/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================================
    // Saved Products / Bookmark Endpoints
    // =========================================================================

    /**
     * GET /api/saved-products
     * Fetch all saved products for a customer.
     */
    @GetMapping("/api/saved-products")
    public ResponseEntity<List<Product>> getSavedProducts(
            @RequestParam(required = false) String customerId,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        String effectiveCustomerId = resolveCustomerId(customerId, headerCustomerId);
        List<SavedProduct> savedList = productService.getSavedProductsByCustomerId(effectiveCustomerId);
        List<Product> products = savedList.stream()
                .map(SavedProduct::getProduct)
                .toList();
        return ResponseEntity.ok(products);
    }

    /**
     * POST /api/saved-products
     * Bookmark / save a product for a customer.
     */
    @PostMapping("/api/saved-products")
    public ResponseEntity<SavedProduct> saveProduct(
            @RequestBody SaveProductRequest request,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        String effectiveCustomerId = resolveCustomerId(request.getCustomerId(), headerCustomerId);
        SavedProduct saved = productService.saveProductForCustomer(effectiveCustomerId, request.getProductId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * DELETE /api/saved-products/{productId}
     * Remove a product from the customer's saved items collection.
     */
    @DeleteMapping("/api/saved-products/{productId}")
    public ResponseEntity<Map<String, Object>> removeSavedProduct(
            @PathVariable String productId,
            @RequestParam(required = false) String customerId,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        String effectiveCustomerId = resolveCustomerId(customerId, headerCustomerId);
        productService.removeSavedProduct(effectiveCustomerId, productId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product removed from saved items",
                "productId", productId,
                "customerId", effectiveCustomerId
        ));
    }

    /**
     * GET /api/saved-products/{productId}/status
     * Check if a specific product is bookmarked by customer.
     */
    @GetMapping("/api/saved-products/{productId}/status")
    public ResponseEntity<Map<String, Object>> checkSavedStatus(
            @PathVariable String productId,
            @RequestParam(required = false) String customerId,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        String effectiveCustomerId = resolveCustomerId(customerId, headerCustomerId);
        boolean isSaved = productService.isProductSaved(effectiveCustomerId, productId);
        return ResponseEntity.ok(Map.of(
                "productId", productId,
                "customerId", effectiveCustomerId,
                "isSaved", isSaved
        ));
    }

    private String resolveCustomerId(String paramOrBodyId, String headerCustomerId) {
        if (paramOrBodyId != null && !paramOrBodyId.trim().isEmpty()) {
            return paramOrBodyId.trim();
        }
        return headerCustomerId != null ? headerCustomerId.trim() : "cust_101";
    }
}
