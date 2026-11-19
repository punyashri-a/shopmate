package com.shopmate.backend.repository;

import com.shopmate.backend.entity.SavedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedProductRepository extends JpaRepository<SavedProduct, Long> {

    List<SavedProduct> findByCustomerId(String customerId);

    List<SavedProduct> findByCustomerIdOrderBySavedAtDesc(String customerId);

    Optional<SavedProduct> findByCustomerIdAndProductId(String customerId, String productId);

    boolean existsByCustomerIdAndProductId(String customerId, String productId);

    void deleteByCustomerIdAndProductId(String customerId, String productId);
}
