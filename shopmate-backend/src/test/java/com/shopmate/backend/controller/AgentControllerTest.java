package com.shopmate.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopmate.backend.dto.AiChatRequest;
import com.shopmate.backend.dto.AiChatResponse;
import com.shopmate.backend.dto.InProductChatRequest;
import com.shopmate.backend.dto.InProductChatResponse;
import com.shopmate.backend.dto.ToolCallDto;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.service.AgentService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AgentController.class)
public class AgentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AgentService agentService;

    @Test
    @DisplayName("POST /api/ai/chat should return AI agent response with tool calls and recommendations")
    public void shouldReturnGlobalAiResponse() throws Exception {
        Product recommended = Product.builder()
                .id("prod-loq-15")
                .name("Lenovo LOQ 15 (2024)")
                .brand("Lenovo")
                .category("laptops")
                .price(new BigDecimal("76990.00"))
                .hasDedicatedGpu(true)
                .build();

        AiChatResponse response = AiChatResponse.builder()
                .conversationId("conv_123")
                .message("Found top AI GPU laptops under ₹80,000")
                .toolCalls(List.of(
                        ToolCallDto.builder()
                                .tool("catalog_search_and_filter")
                                .arguments(Map.of("category", "laptops", "requiresDedicatedGpu", true))
                                .build()
                ))
                .recommendedProducts(List.of(recommended))
                .build();

        when(agentService.processGlobalChat(any())).thenReturn(response);

        AiChatRequest request = AiChatRequest.builder()
                .message("Give me one laptop which has GPU, but price should be less than 80,000")
                .conversationId("conv_123")
                .customerId("cust_101")
                .build();

        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversationId").value("conv_123"))
                .andExpect(jsonPath("$.toolCalls[0].tool").value("catalog_search_and_filter"))
                .andExpect(jsonPath("$.recommendedProducts[0].id").value("prod-loq-15"))
                .andExpect(jsonPath("$.recommendedProducts[0].name").value("Lenovo LOQ 15 (2024)"));
    }

    @Test
    @DisplayName("POST /api/ai/product-chat should return in-product contextual response")
    public void shouldReturnInProductChatResponse() throws Exception {
        InProductChatResponse response = InProductChatResponse.builder()
                .conversationId("pconv_123")
                .message("✅ I have saved the Lenovo LOQ 15 (2024) to your collection!")
                .actionExecuted("save_product")
                .suggestedProducts(List.of())
                .build();

        when(agentService.processProductChat(any())).thenReturn(response);

        InProductChatRequest request = InProductChatRequest.builder()
                .productId("prod-loq-15")
                .message("Save this product")
                .conversationId("pconv_123")
                .customerId("cust_101")
                .build();

        mockMvc.perform(post("/api/ai/product-chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversationId").value("pconv_123"))
                .andExpect(jsonPath("$.actionExecuted").value("save_product"))
                .andExpect(jsonPath("$.message").value("✅ I have saved the Lenovo LOQ 15 (2024) to your collection!"));
    }
}
