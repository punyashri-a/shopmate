package com.shopmate.backend.service;

import com.shopmate.backend.dto.AiChatRequest;
import com.shopmate.backend.dto.AiChatResponse;
import com.shopmate.backend.dto.InProductChatRequest;
import com.shopmate.backend.dto.InProductChatResponse;
import com.shopmate.backend.dto.ToolCallDto;
import com.shopmate.backend.entity.Product;
import com.shopmate.backend.repository.ProductRepository;
import com.shopmate.backend.tool.CatalogSearchTool;
import com.shopmate.backend.tool.CustomerActionTool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgentService {

    private final ProductRepository productRepository;
    private final CatalogSearchTool catalogSearchTool;
    private final CustomerActionTool customerActionTool;
    private final ObjectProvider<OpenAiChatModel> chatModelProvider;

    private static final Pattern BUDGET_PATTERN = Pattern.compile(
            "(?:under|less than|below|budget of|within|upto|up to)\\s*(?:₹|rs\\.?|inr)?\\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)(?:k|\\s*thousand)?",
            Pattern.CASE_INSENSITIVE
    );

    private String callAiModel(String systemPrompt, String userMessage) {
        OpenAiChatModel chatModel = chatModelProvider.getIfAvailable();
        if (chatModel == null) {
            return "⚠️ **ShopMate AI Offline**\n\n"
                    + "The custom ShopMate AI engine is currently not initialized. Please ensure your configuration is active.";
        }

        try {
            ChatClient chatClient = ChatClient.create(chatModel);
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("ShopMate AI model invocation failed: {}", e.getMessage(), e);
            return "⚠️ **ShopMate AI Notice**: We experienced a brief delay connecting to our recommendation engine. Please try again in a moment.";
        }
    }

    public AiChatResponse processGlobalChat(AiChatRequest request) {
        String query = request.getMessage() != null ? request.getMessage().trim() : "";
        String convId = (request.getConversationId() != null && !request.getConversationId().isBlank())
                ? request.getConversationId()
                : "conv_" + System.currentTimeMillis();

        String lower = query.toLowerCase();

        // 1. Conversational, greeting, identity, or conceptual inquiries
        if (isConversationalOrConceptual(lower)) {
            String systemPrompt = """
                    You are ShopMate AI, a custom-built, proprietary shopping intelligence model and personal tech advisor developed specifically for the ShopMate store.

                    CRITICAL IDENTITY & BRANDING RULES:
                    - You are "ShopMate AI" (ShopMate's custom shopping assistant and recommendation engine).
                    - NEVER state, hint, or reveal that you are built or provided by NVIDIA, OpenAI, Meta, or any third party.
                    - NEVER mention model names like Nemotron, Llama, GPT, Claude, or foundational AI platforms.
                    - If the user asks "Who are you?", "What model are you?", or "Who created you?", proudly and naturally explain that you are ShopMate AI, a custom-trained shopping assistant designed to help shoppers discover the perfect tech gear, compare specifications, and find the best deals.

                    COMMUNICATION STYLE:
                    - Speak in a warm, natural, human-friendly, and engaging conversational tone—like an expert personal shopping friend who genuinely loves tech.
                    - Avoid stiff, robotic, or overly corporate phrasing. Use friendly greetings, casual transitions, and clear explanations.
                    - When introducing yourself or greeting the user, be welcoming and ask what kind of device, setup, or appliance they are looking for today.
                    - When explaining concepts (like GPUs, RAM, battery life, or displays), explain them clearly and intuitively without dense jargon dumps.
                    - Format your response with clean, readable Markdown (bullet points, bold text).
                    """;

            String responseMessage = callAiModel(systemPrompt, query);

            return AiChatResponse.builder()
                    .conversationId(convId)
                    .message(responseMessage)
                    .toolCalls(Collections.emptyList())
                    .recommendedProducts(Collections.emptyList())
                    .build();
        }

        // 2. Product recommendation / search intent
        BigDecimal maxBudget = extractBudget(query);
        boolean asksGpu = lower.contains("gpu") || lower.contains("ai model") || lower.contains("train")
                || lower.contains("tensor") || lower.contains("deep learning") || lower.contains("cuda");
        boolean asksLaptops = lower.contains("laptop") || lower.contains("notebook") || lower.contains("gaming laptop") || asksGpu;
        boolean asksAppliances = lower.contains("fridge") || lower.contains("refrigerator")
                || lower.contains("washer") || lower.contains("washing") || lower.contains("air fryer")
                || lower.contains("vacuum") || lower.contains("appliance");
        boolean asksPhones = lower.contains("smartphone") || lower.contains("phone") || lower.contains("mobile")
                || lower.contains("iphone") || lower.contains("galaxy") || lower.contains("oneplus")
                || lower.contains("camera");
        boolean asksAudio = lower.contains("audio") || lower.contains("headphone") || lower.contains("earphone")
                || lower.contains("earbuds") || lower.contains("airpods") || lower.contains("bose")
                || lower.contains("sony wh") || lower.contains("anc");
        boolean asksMonitors = lower.contains("monitor") || lower.contains("display") || lower.contains("screen")
                || lower.contains("ultragear") || lower.contains("ultrasharp") || lower.contains("curved");

        String category = null;
        Boolean requiresDedicatedGpu = null;

        if (asksLaptops) {
            category = "laptops";
            if (asksGpu) {
                requiresDedicatedGpu = true;
            }
        } else if (asksAppliances) {
            category = "home-appliances";
        } else if (asksPhones) {
            category = "smartphones";
        } else if (asksAudio) {
            category = "headphones";
        } else if (asksMonitors) {
            category = "monitors";
        }

        CatalogSearchTool.SearchResult searchResult = catalogSearchTool.executeSearch(
                category,
                requiresDedicatedGpu,
                null,
                maxBudget,
                extractKeyword(lower, category),
                5
        );

        List<Product> products = searchResult.products();
        List<ToolCallDto> toolCalls = List.of(searchResult.toolCall());

        String systemPrompt = String.format("""
                You are ShopMate AI, ShopMate's custom in-house shopping intelligence model and personal tech advisor.

                CRITICAL IDENTITY RULES:
                - Never mention third-party AI provider names or model names (such as NVIDIA, Nemotron, Llama, OpenAI, GPT).
                - Always present yourself as ShopMate's custom shopping model.

                The user is looking for: "%s"

                Here are the matching products from our verified store catalog:
                %s

                How to reply:
                - Talk like a knowledgeable, friendly tech advisor helping someone pick the best gear for their budget.
                - Highlight what actually matters to the user (e.g. real-world performance, value for money, battery life, display quality, day-to-day usability) instead of reciting raw spec sheets.
                - Give a clear, warm recommendation on which option(s) suit them best and why. Mention practical pros and trade-offs in plain, easy-to-understand language.
                - Keep the formatting clean and visually pleasant with Markdown (bullet points, bold highlights).
                - Ground your suggestions in the provided products. If no products closely match their criteria, warmly suggest adjusting the budget or exploring alternative categories.
                """,
                query,
                formatProductsForPrompt(products)
        );

        String responseMessage = callAiModel(systemPrompt, query);

        return AiChatResponse.builder()
                .conversationId(convId)
                .message(responseMessage)
                .toolCalls(toolCalls)
                .recommendedProducts(products)
                .build();
    }

    public InProductChatResponse processProductChat(InProductChatRequest request) {
        String convId = (request.getConversationId() != null && !request.getConversationId().isBlank())
                ? request.getConversationId()
                : "pconv_" + System.currentTimeMillis();
        String customerId = (request.getCustomerId() != null && !request.getCustomerId().isBlank())
                ? request.getCustomerId()
                : "cust_101";

        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty()) {
            return InProductChatResponse.builder()
                    .conversationId(convId)
                    .message("⚠️ I couldn't find that product in our catalog for ID: " + request.getProductId())
                    .suggestedProducts(Collections.emptyList())
                    .build();
        }

        Product product = productOpt.get();
        String query = request.getMessage() != null ? request.getMessage().trim() : "";
        String lower = query.toLowerCase();

        // 1. Action: Save / Bookmark product
        if (lower.contains("save") || lower.contains("bookmark") || lower.contains("favorite") || lower.contains("add to collection")) {
            CustomerActionTool.ActionResult action = customerActionTool.executeSaveProduct(customerId, product.getId(), product.getName());
            return InProductChatResponse.builder()
                    .conversationId(convId)
                    .message(action.confirmationMessage())
                    .actionExecuted(action.actionExecuted())
                    .suggestedProducts(Collections.emptyList())
                    .build();
        }

        // 2. Action: Show alternatives
        if (lower.contains("alternative") || lower.contains("other option") || lower.contains("competitor")
                || lower.contains("similar") || lower.contains("other than this")) {
            List<Product> alternatives = productRepository.findByCategoryIgnoreCaseAndIdNot(product.getCategory(), product.getId());

            String systemPrompt = String.format("""
                    You are ShopMate AI, ShopMate's custom in-house shopping model. Never mention third-party model or provider names.
                    The user is currently checking out: %s (%s, ₹%s)
                    Here are other alternative options in our store:
                    %s

                    Compare these options in a friendly, conversational way:
                    - Highlight who each product is best for and the practical trade-offs (e.g. "If you prioritize gaming vs battery life...").
                    - Help the user make a confident, well-informed choice without sounding like a robotic spec manual.
                    """,
                    product.getName(), product.getBrand(), product.getPrice(),
                    formatProductsForPrompt(alternatives)
            );

            String message = callAiModel(systemPrompt, query);

            return InProductChatResponse.builder()
                    .conversationId(convId)
                    .message(message)
                    .actionExecuted(null)
                    .suggestedProducts(alternatives)
                    .build();
        }

        // 3. In-depth Q&A on active product
        String systemPrompt = String.format("""
                You are ShopMate AI, a custom in-house shopping assistant and hardware specialist built for ShopMate. Never mention third-party model or AI provider names.
                The user is looking at:
                - Product: %s (%s, ₹%s, Category: %s)
                - Dedicated GPU: %s (%s)
                - Specifications: %s
                - Key Advantages: %s
                - Trade-offs / Things to know: %s
                - Product Insights: %s

                How to answer:
                - Answer the user's question in a warm, direct, and conversational human tone.
                - Give practical, real-world advice (e.g. how it will handle their daily tasks, games, battery life, or workflow).
                - Use clear, easy-to-read Markdown with friendly bullet points where helpful.
                """,
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getCategory(),
                product.getHasDedicatedGpu() != null && product.getHasDedicatedGpu() ? "Yes" : "No",
                product.getGpuModel() != null ? product.getGpuModel() : "Integrated",
                product.getSpecs() != null ? product.getSpecs().toString() : "{}",
                product.getAdvantages() != null ? product.getAdvantages().toString() : "[]",
                product.getDisadvantages() != null ? product.getDisadvantages().toString() : "[]",
                product.getAiReasoning() != null ? product.getAiReasoning() : ""
        );

        String message = callAiModel(systemPrompt, query);

        return InProductChatResponse.builder()
                .conversationId(convId)
                .message(message)
                .actionExecuted(null)
                .suggestedProducts(Collections.emptyList())
                .build();
    }

    private boolean isConversationalOrConceptual(String query) {
        String clean = query.replaceAll("[?!.,]", "").trim().toLowerCase();
        return clean.equals("hi") || clean.equals("hii") || clean.equals("hello") || clean.equals("hey")
                || clean.startsWith("who are you") || clean.startsWith("who r u") || clean.contains("who are you")
                || clean.startsWith("what are you") || clean.startsWith("what can you do")
                || clean.startsWith("tell me about yourself") || clean.startsWith("introduce yourself")
                || clean.startsWith("why is") || clean.startsWith("what is") || clean.startsWith("explain")
                || clean.startsWith("difference between") || clean.contains("instead of cpu")
                || clean.contains("why do we need") || clean.equals("help");
    }

    private String formatProductsForPrompt(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return "No matching products found in database.";
        }
        StringBuilder sb = new StringBuilder();
        for (Product p : products) {
            sb.append(String.format("- **%s** (%s, Price: ₹%s) | GPU: %s | Match: %d%%\n",
                    p.getName(), p.getBrand(), p.getPrice(),
                    p.getGpuModel() != null ? p.getGpuModel() : "Integrated",
                    p.getMatchScore() != null ? p.getMatchScore() : 95));
            if (p.getSpecs() != null) {
                sb.append(String.format("  *Specs*: %s\n", p.getSpecs()));
            }
            if (p.getAdvantages() != null) {
                sb.append(String.format("  *Advantages*: %s\n", p.getAdvantages()));
            }
        }
        return sb.toString();
    }

    private BigDecimal extractBudget(String text) {
        Matcher matcher = BUDGET_PATTERN.matcher(text);
        if (matcher.find()) {
            String rawNumber = matcher.group(1).replace(",", "");
            try {
                double val = Double.parseDouble(rawNumber);
                if (text.toLowerCase().contains("k") || text.toLowerCase().contains("thousand")) {
                    if (val < 1000) {
                        val *= 1000;
                    }
                }
                return BigDecimal.valueOf(val);
            } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String extractKeyword(String query, String resolvedCategory) {
        List<String> knownBrands = List.of(
                "lenovo", "asus", "acer", "hp", "lg", "samsung", "philips", "xiaomi",
                "apple", "oneplus", "sony", "bose", "dell"
        );
        for (String brand : knownBrands) {
            if (query.contains(brand)) {
                return brand;
            }
        }

        if (resolvedCategory != null) {
            return null;
        }

        String cleaned = query.replaceAll("(?i)\\b(give me|show me|find|best|laptops?|smartphones?|refrigerators?|fridges?|washing machines?|audio|monitors?|under|less than|below|budget of|price|with|can|train|ai|model|gpu|which|has|should|be|one|some|a|the|in|for)\\b", "")
                .replaceAll("[0-9,₹$]+", "")
                .trim();

        return cleaned.length() >= 3 ? cleaned : null;
    }
}
