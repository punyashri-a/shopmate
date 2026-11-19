package com.shopmate.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 64)
    private String id; // e.g. "prod-loq-15"

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(nullable = false, length = 64)
    private String category; // e.g. "laptops", "smartphones", "home-appliances", "accessories", "other-electronics"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discount_percent")
    @Builder.Default
    private Integer discountPercent = 0;

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 4.5;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(length = 128)
    private String availability;

    @Column(name = "external_url", length = 512)
    private String externalUrl;

    @Column(length = 128)
    private String retailer;

    @Column(nullable = false, length = 512)
    private String image;

    @Column(length = 128)
    private String badge;

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "has_dedicated_gpu")
    @Builder.Default
    private Boolean hasDedicatedGpu = false;

    @Column(name = "gpu_model")
    private String gpuModel;

    @Column(name = "ai_reasoning", columnDefinition = "TEXT")
    private String aiReasoning;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> advantages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> disadvantages;

    /**
     * Flexible specifications map supporting category-specific hardware & appliance attributes:
     * - Laptop: processor, ram, storage, gpu, display, battery
     * - Smartphone: processor, ram, storage, camera, battery, display
     * - Home Appliance: capacity, energyRating, compressor, cooling, dimensions
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> specs;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
