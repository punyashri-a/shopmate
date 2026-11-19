package com.shopmate.backend.service;

import com.shopmate.backend.entity.Customer;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.entity.SavedProduct;
import com.shopmate.backend.repository.CustomerRepository;
import com.shopmate.backend.repository.ProductRepository;
import com.shopmate.backend.repository.SavedProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SavedProductRepository savedProductRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .image("https://images.unsplash.com/sample")
                .hasDedicatedGpu(true)
                .specs(Map.of("ram", "16GB", "storage", "512GB"))
                .build();
    }

    @Test
    @DisplayName("Should find product by ID")
    void shouldFindProductById() {
        when(productRepository.findById("prod-loq-15")).thenReturn(Optional.of(sampleProduct));

        Optional<Product> result = productService.getProductById("prod-loq-15");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Lenovo LOQ 15");
        verify(productRepository, times(1)).findById("prod-loq-15");
    }

    @Test
    @DisplayName("Should find all products")
    void shouldFindAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(sampleProduct));

        List<Product> products = productService.getAllProducts();

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getBrand()).isEqualTo("Lenovo");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should filter products with specifications")
    @SuppressWarnings("unchecked")
    void shouldFilterProductsWithSpecifications() {
        when(productRepository.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(List.of(sampleProduct));

        List<Product> products = productService.getProducts(
                "laptops", "lenovo", "above-70k", null, null, "price-low", true
        );

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getId()).isEqualTo("prod-loq-15");
        verify(productRepository, times(1)).findAll(any(Specification.class), any(Sort.class));
    }

    @Test
    @DisplayName("Should find products by category")
    void shouldFindProductsByCategory() {
        when(productRepository.findByCategoryIgnoreCase("laptops")).thenReturn(List.of(sampleProduct));

        List<Product> products = productService.getProductsByCategory("laptops");

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getCategory()).isEqualTo("laptops");
        verify(productRepository, times(1)).findByCategoryIgnoreCase("laptops");
    }

    @Test
    @DisplayName("Should find products by brand")
    void shouldFindProductsByBrand() {
        when(productRepository.findByBrandIgnoreCase("Lenovo")).thenReturn(List.of(sampleProduct));

        List<Product> products = productService.getProductsByBrand("Lenovo");

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getBrand()).isEqualTo("Lenovo");
        verify(productRepository, times(1)).findByBrandIgnoreCase("Lenovo");
    }

    @Test
    @DisplayName("Should return distinct categories")
    void shouldReturnDistinctCategories() {
        when(productRepository.findDistinctCategories()).thenReturn(List.of("home-appliances", "laptops"));

        List<String> categories = productService.getAllCategories();

        assertThat(categories).containsExactly("home-appliances", "laptops");
        verify(productRepository, times(1)).findDistinctCategories();
    }

    @Test
    @DisplayName("Should save and return product for customer")
    void shouldSaveProductForCustomer() {
        Customer customer = Customer.builder().id("cust_101").name("Varun").build();
        SavedProduct savedProduct = SavedProduct.builder()
                .id(1L)
                .customer(customer)
                .product(sampleProduct)
                .build();

        when(savedProductRepository.findByCustomerIdAndProductId("cust_101", "prod-loq-15"))
                .thenReturn(Optional.of(savedProduct));

        SavedProduct result = productService.saveProductForCustomer("cust_101", "prod-loq-15");

        assertThat(result).isNotNull();
        assertThat(result.getProduct().getId()).isEqualTo("prod-loq-15");
        verify(savedProductRepository, times(1)).findByCustomerIdAndProductId("cust_101", "prod-loq-15");
    }
}
