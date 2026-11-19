package com.shopmate.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopmate.backend.dto.SaveProductRequest;
import com.shopmate.backend.entity.Customer;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.entity.SavedProduct;
import com.shopmate.backend.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("GET /api/products should return list of products as JSON")
    public void shouldReturnAllProducts() throws Exception {
        Product product = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .originalPrice(new BigDecimal("94990.00"))
                .discountPercent(19)
                .rating(4.6)
                .reviewCount(1240)
                .hasDedicatedGpu(true)
                .gpuModel("NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)")
                .advantages(List.of("Dedicated NVIDIA RTX 4050 GPU"))
                .disadvantages(List.of("Modest 60Wh battery"))
                .specs(Map.of("processor", "AMD Ryzen 7 7435HS", "ram", "16GB DDR5"))
                .build();

        when(productService.getProducts(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(product));

        mockMvc.perform(get("/api/products")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("prod-loq-15"))
                .andExpect(jsonPath("$[0].name").value("Lenovo LOQ 15 (2024)"))
                .andExpect(jsonPath("$[0].price").value(76990.00))
                .andExpect(jsonPath("$[0].hasDedicatedGpu").value(true))
                .andExpect(jsonPath("$[0].specs.processor").value("AMD Ryzen 7 7435HS"))
                .andExpect(jsonPath("$[0].advantages[0]").value("Dedicated NVIDIA RTX 4050 GPU"));
    }

    @Test
    @DisplayName("GET /api/products/categories should return distinct categories")
    public void shouldReturnDistinctCategories() throws Exception {
        when(productService.getAllCategories()).thenReturn(List.of("home-appliances", "laptops", "smartphones"));

        mockMvc.perform(get("/api/products/categories")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0]").value("home-appliances"))
                .andExpect(jsonPath("$[1]").value("laptops"))
                .andExpect(jsonPath("$[2]").value("smartphones"));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 200 OK when product exists")
    public void shouldReturnProductWhenFound() throws Exception {
        Product product = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .hasDedicatedGpu(true)
                .build();

        when(productService.getProductById("prod-loq-15")).thenReturn(Optional.of(product));

        mockMvc.perform(get("/api/products/prod-loq-15")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("prod-loq-15"))
                .andExpect(jsonPath("$.name").value("Lenovo LOQ 15 (2024)"))
                .andExpect(jsonPath("$.brand").value("Lenovo"));
    }

    @Test
    @DisplayName("GET /api/products/search should return matching products")
    public void shouldSearchProducts() throws Exception {
        Product product = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .build();

        when(productService.getProducts(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(product));

        mockMvc.perform(get("/api/products/search")
                        .param("q", "Lenovo")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Lenovo LOQ 15 (2024)"));
    }

    @Test
    @DisplayName("GET /api/saved-products should return saved products")
    public void shouldReturnSavedProducts() throws Exception {
        Product product = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .build();

        SavedProduct savedProduct = SavedProduct.builder()
                .id(1L)
                .customer(Customer.builder().id("cust_101").name("Varun").build())
                .product(product)
                .build();

        when(productService.getSavedProductsByCustomerId("cust_101")).thenReturn(List.of(savedProduct));

        mockMvc.perform(get("/api/saved-products")
                        .param("customerId", "cust_101")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("prod-loq-15"))
                .andExpect(jsonPath("$[0].name").value("Lenovo LOQ 15 (2024)"));
    }

    @Test
    @DisplayName("POST /api/saved-products should save product")
    public void shouldSaveProduct() throws Exception {
        Product product = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .build();

        SavedProduct savedProduct = SavedProduct.builder()
                .id(1L)
                .customer(Customer.builder().id("cust_101").name("Varun").build())
                .product(product)
                .build();

        when(productService.saveProductForCustomer(eq("cust_101"), eq("prod-loq-15"))).thenReturn(savedProduct);

        SaveProductRequest request = SaveProductRequest.builder()
                .customerId("cust_101")
                .productId("prod-loq-15")
                .build();

        mockMvc.perform(post("/api/saved-products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.product.id").value("prod-loq-15"));
    }

    @Test
    @DisplayName("DELETE /api/saved-products/{id} should remove saved product")
    public void shouldRemoveSavedProduct() throws Exception {
        doNothing().when(productService).removeSavedProduct("cust_101", "prod-loq-15");

        mockMvc.perform(delete("/api/saved-products/prod-loq-15")
                        .param("customerId", "cust_101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
