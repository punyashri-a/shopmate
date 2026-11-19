package com.shopmate.backend.tool;

import com.shopmate.backend.dto.ToolCallDto;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CatalogSearchTool {

    private final ProductRepository productRepository;

    public record SearchResult(List<Product> products, ToolCallDto toolCall) {}

    public SearchResult executeSearch(
            String category,
            Boolean requiresDedicatedGpu,
            BigDecimal minBudget,
            BigDecimal maxBudget,
            String keyword,
            Integer limit) {

        log.info("CatalogSearchTool executing search: category={}, gpu={}, min={}, max={}, keyword={}",
                category, requiresDedicatedGpu, minBudget, maxBudget, keyword);

        Specification<Product> spec = Specification.where(null);

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
        }

        if (requiresDedicatedGpu != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("hasDedicatedGpu"), requiresDedicatedGpu));
        }

        if (minBudget != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), minBudget));
        }

        if (maxBudget != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), maxBudget));
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("brand")), pattern),
                    cb.like(cb.lower(root.get("gpuModel")), pattern),
                    cb.like(cb.lower(root.get("aiReasoning")), pattern)
            ));
        }

        List<Product> found = productRepository.findAll(spec);

        // Sort by matchScore descending or price
        List<Product> sorted = found.stream()
                .sorted((p1, p2) -> {
                    int score1 = p1.getMatchScore() != null ? p1.getMatchScore() : 0;
                    int score2 = p2.getMatchScore() != null ? p2.getMatchScore() : 0;
                    return Integer.compare(score2, score1);
                })
                .limit(limit != null && limit > 0 ? limit : 10)
                .toList();

        Map<String, Object> arguments = new LinkedHashMap<>();
        if (category != null) arguments.put("category", category);
        if (requiresDedicatedGpu != null) arguments.put("requiresDedicatedGpu", requiresDedicatedGpu);
        if (minBudget != null) arguments.put("minBudget", minBudget);
        if (maxBudget != null) arguments.put("maxBudget", maxBudget);
        if (keyword != null) arguments.put("keyword", keyword);

        ToolCallDto toolCall = ToolCallDto.builder()
                .tool("catalog_search_and_filter")
                .arguments(arguments)
                .build();

        return new SearchResult(sorted, toolCall);
    }
}
