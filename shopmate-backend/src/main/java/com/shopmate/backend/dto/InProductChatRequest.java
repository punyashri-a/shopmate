package com.shopmate.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InProductChatRequest {

    @NotBlank(message = "Product ID must not be blank")
    private String productId;

    @NotBlank(message = "Message must not be blank")
    private String message;

    private String conversationId;

    private String customerId;
}
