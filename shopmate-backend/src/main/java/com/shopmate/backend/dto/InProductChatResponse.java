package com.shopmate.backend.dto;

import com.shopmate.backend.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InProductChatResponse {

    private String conversationId;

    private String message;

    private String actionExecuted;

    @Builder.Default
    private List<Product> suggestedProducts = new ArrayList<>();
}
