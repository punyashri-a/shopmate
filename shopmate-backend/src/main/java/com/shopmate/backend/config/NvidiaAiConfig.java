package com.shopmate.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class NvidiaAiConfig {

    @Value("${spring.ai.openai.base-url:${NVIDIA_BASE_URL:https://integrate.api.nvidia.com/v1}}")
    private String baseUrl;

    @Value("${spring.ai.openai.api-key:${NVIDIA_API_KEY:}}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model:${NVIDIA_MODEL:meta/llama-3.1-70b-instruct}}")
    private String model;

    @Bean
    public OpenAiApi openAiApi() {
        String effectiveKey = (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("your-key-here"))
                ? apiKey.trim()
                : System.getProperty("NVIDIA_API_KEY", System.getenv("NVIDIA_API_KEY"));
        String effectiveUrl = (baseUrl != null && !baseUrl.trim().isEmpty())
                ? baseUrl.trim()
                : System.getProperty("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com");

        if (effectiveKey == null || effectiveKey.trim().isEmpty() || effectiveKey.contains("your-key-here")) {
            log.info("NVIDIA NIM API key is not configured. Running in offline verified catalog mode.");
            return null;
        }

        if (effectiveUrl.endsWith("/v1")) {
            effectiveUrl = effectiveUrl.substring(0, effectiveUrl.length() - 3);
        } else if (effectiveUrl.endsWith("/v1/")) {
            effectiveUrl = effectiveUrl.substring(0, effectiveUrl.length() - 4);
        }
        while (effectiveUrl.endsWith("/")) {
            effectiveUrl = effectiveUrl.substring(0, effectiveUrl.length() - 1);
        }

        log.info("Configuring live NVIDIA NIM OpenAI-compatible API client pointing to: {}", effectiveUrl);
        return new OpenAiApi(effectiveUrl, effectiveKey.trim());
    }

    @Bean
    public OpenAiChatModel openAiChatModel(OpenAiApi openAiApi) {
        if (openAiApi == null) {
            return null;
        }
        String effectiveModel = (model != null && !model.trim().isEmpty())
                ? model.trim()
                : System.getProperty("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct");
        log.info("Configuring NVIDIA NIM ChatModel with model: {}", effectiveModel);
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withModel(effectiveModel)
                .withTemperature(0.7)
                .build();
        return new OpenAiChatModel(openAiApi, options);
    }
}
