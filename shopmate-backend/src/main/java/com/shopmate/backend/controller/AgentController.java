package com.shopmate.backend.controller;

import com.shopmate.backend.dto.AiChatRequest;
import com.shopmate.backend.dto.AiChatResponse;
import com.shopmate.backend.dto.InProductChatRequest;
import com.shopmate.backend.dto.InProductChatResponse;
import com.shopmate.backend.service.AgentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RequiredArgsConstructor
@Slf4j
public class AgentController {

    private final AgentService agentService;

    /**
     * POST /api/ai/chat, POST /api/agent/chat
     * Global AI Shopping Assistant Chat endpoint with tool-calling and recommendations.
     */
    @PostMapping({"/api/ai/chat", "/api/agent/chat"})
    public ResponseEntity<AiChatResponse> handleGlobalChat(
            @Valid @RequestBody AiChatRequest request,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        log.info("AgentController: Global AI Chat request for conversationId='{}'", request.getConversationId());

        if (request.getCustomerId() == null || request.getCustomerId().isBlank()) {
            request.setCustomerId(headerCustomerId);
        }

        AiChatResponse response = agentService.processGlobalChat(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/ai/product-chat, POST /api/agent/product-chat
     * Context-aware In-Product AI Chat endpoint for active product inspection.
     */
    @PostMapping({"/api/ai/product-chat", "/api/agent/product-chat"})
    public ResponseEntity<InProductChatResponse> handleProductChat(
            @Valid @RequestBody InProductChatRequest request,
            @RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String headerCustomerId) {

        log.info("AgentController: In-Product AI Chat for productId='{}', conversationId='{}'",
                request.getProductId(), request.getConversationId());

        if (request.getCustomerId() == null || request.getCustomerId().isBlank()) {
            request.setCustomerId(headerCustomerId);
        }

        InProductChatResponse response = agentService.processProductChat(request);
        return ResponseEntity.ok(response);
    }
}
