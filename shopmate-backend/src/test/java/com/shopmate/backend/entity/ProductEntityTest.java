package com.shopmate.backend.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class ProductEntityTest {

    @Test
    @DisplayName("Should create laptop product with category-specific specs (processor, ram, storage, gpu)")
    public void shouldCreateLaptopProductWithCategorySpecs() {
        Map<String, Object> laptopSpecs = Map.of(
                "processor", "AMD Ryzen 7 7435HS (8 Cores, up to 4.5 GHz)",
                "ram", "16GB DDR5 4800MHz",
                "storage", "512GB PCIe Gen4 NVMe SSD",
                "display", "15.6\" FHD 144Hz IPS",
                "battery", "60Wh",
                "graphics", "NVIDIA GeForce RTX 4050 6GB GDDR6"
        );

        Product laptop = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .originalPrice(new BigDecimal("94990.00"))
                .discountPercent(19)
                .rating(4.6)
                .reviewCount(1240)
                .availability("In Stock")
                .externalUrl("https://www.lenovo.com/in")
                .retailer("Lenovo Official")
                .image("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed")
                .badge("Top Pick for AI & GPU")
                .matchScore(98)
                .hasDedicatedGpu(true)
                .gpuModel("NVIDIA GeForce RTX 4050 6GB GDDR6")
                .aiReasoning("Equipped with dedicated RTX 4050 GPU for AI model training.")
                .advantages(List.of("Dedicated NVIDIA RTX 4050 GPU", "High 95W TGP"))
                .disadvantages(List.of("Modest 60Wh battery"))
                .specs(laptopSpecs)
                .build();

        assertThat(laptop.getId()).isEqualTo("prod-loq-15");
        assertThat(laptop.getBrand()).isEqualTo("Lenovo");
        assertThat(laptop.getCategory()).isEqualTo("laptops");
        assertThat(laptop.getHasDedicatedGpu()).isTrue();
        assertThat(laptop.getSpecs()).containsEntry("processor", "AMD Ryzen 7 7435HS (8 Cores, up to 4.5 GHz)");
        assertThat(laptop.getSpecs()).containsEntry("graphics", "NVIDIA GeForce RTX 4050 6GB GDDR6");
        assertThat(laptop.getAdvantages()).hasSize(2);
    }

    @Test
    @DisplayName("Should create smartphone product with category-specific specs (camera, battery, display)")
    public void shouldCreateSmartphoneProductWithCategorySpecs() {
        Map<String, Object> phoneSpecs = Map.of(
                "processor", "Snapdragon 8 Gen 3 (4nm)",
                "ram", "12GB LPDDR5X",
                "storage", "256GB UFS 4.0",
                "camera", "50MP Main (OIS) + 50MP Ultra-wide + 12MP Telephoto",
                "battery", "5000mAh with 100W SuperVOOC",
                "display", "6.78\" 1.5K LTPO AMOLED 120Hz"
        );

        Product phone = Product.builder()
                .id("prod-phone-01")
                .name("OnePlus 12")
                .brand("OnePlus")
                .category("smartphones")
                .price(new BigDecimal("64999.00"))
                .image("https://images.unsplash.com/photo-smartphone")
                .hasDedicatedGpu(false)
                .specs(phoneSpecs)
                .build();

        assertThat(phone.getCategory()).isEqualTo("smartphones");
        assertThat(phone.getHasDedicatedGpu()).isFalse();
        assertThat(phone.getSpecs()).containsEntry("camera", "50MP Main (OIS) + 50MP Ultra-wide + 12MP Telephoto");
        assertThat(phone.getSpecs()).containsEntry("battery", "5000mAh with 100W SuperVOOC");
    }

    @Test
    @DisplayName("Lifecycle callbacks should set createdAt and updatedAt on persist")
    public void shouldSetTimestampsOnLifecycle() {
        Product product = new Product();
        product.onCreate();

        assertThat(product.getCreatedAt()).isNotNull();
        assertThat(product.getUpdatedAt()).isNotNull();
    }
}
