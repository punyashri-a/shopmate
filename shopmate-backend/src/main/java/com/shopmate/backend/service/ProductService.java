package com.shopmate.backend.service;

import com.shopmate.backend.entity.Customer;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.entity.SavedProduct;
import com.shopmate.backend.repository.CustomerRepository;
import com.shopmate.backend.repository.ProductRepository;
import com.shopmate.backend.repository.SavedProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final SavedProductRepository savedProductRepository;
    private final CustomerRepository customerRepository;

    // --- Product Catalog Operations ---

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProducts(
            String category,
            String search,
            String priceFilter,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            Boolean hasDedicatedGpu) {

        Specification<Product> spec = Specification.where(null);

        if (category != null && !category.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
        }

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("brand")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            ));
        }

        if (hasDedicatedGpu != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("hasDedicatedGpu"), hasDedicatedGpu));
        }

        if (priceFilter != null && !priceFilter.isBlank()) {
            switch (priceFilter.trim().toLowerCase()) {
                case "under-30k" -> spec = spec.and((root, query, cb) ->
                        cb.lessThanOrEqualTo(root.get("price"), new BigDecimal("30000")));
                case "30k-70k" -> spec = spec.and((root, query, cb) ->
                        cb.between(root.get("price"), new BigDecimal("30000"), new BigDecimal("70000")));
                case "above-70k" -> spec = spec.and((root, query, cb) ->
                        cb.greaterThanOrEqualTo(root.get("price"), new BigDecimal("70000")));
                default -> {}
            }
        } else {
            if (minPrice != null) {
                spec = spec.and((root, query, cb) ->
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                spec = spec.and((root, query, cb) ->
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "matchScore");
        if (sortBy != null && !sortBy.isBlank()) {
            switch (sortBy.trim().toLowerCase()) {
                case "price-low" -> sort = Sort.by(Sort.Direction.ASC, "price");
                case "price-high" -> sort = Sort.by(Sort.Direction.DESC, "price");
                case "rating" -> sort = Sort.by(Sort.Direction.DESC, "rating");
                case "featured" -> sort = Sort.by(Sort.Direction.DESC, "matchScore");
                default -> {}
            }
        }

        return productRepository.findAll(spec, sort);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandIgnoreCase(brand);
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // --- Saved Product / Bookmark Operations ---

    public List<SavedProduct> getSavedProductsByCustomerId(String customerId) {
        return savedProductRepository.findByCustomerIdOrderBySavedAtDesc(customerId);
    }

    @Transactional
    public SavedProduct saveProductForCustomer(String customerId, String productId) {
        return savedProductRepository.findByCustomerIdAndProductId(customerId, productId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseGet(() -> customerRepository.save(
                                    Customer.builder()
                                            .id(customerId)
                                            .name("Customer " + customerId)
                                            .build()
                                    ));

                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

                    return savedProductRepository.save(
                            SavedProduct.builder()
                                    .customer(customer)
                                    .product(product)
                                    .build()
                    );
                });
    }

    @Transactional
    public void removeSavedProduct(String customerId, String productId) {
        savedProductRepository.deleteByCustomerIdAndProductId(customerId, productId);
    }

    public boolean isProductSaved(String customerId, String productId) {
        return savedProductRepository.existsByCustomerIdAndProductId(customerId, productId);
    }
}
