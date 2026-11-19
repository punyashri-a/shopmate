package com.shopmate.backend.tool;

import com.shopmate.backend.dto.ToolCallDto;
import com.shopmate.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomerActionTool {

    private final ProductService productService;

    public record ActionResult(String actionExecuted, ToolCallDto toolCall, String confirmationMessage) {}

    public ActionResult executeSaveProduct(String customerId, String productId, String productName) {
        log.info("CustomerActionTool saving product: customerId={}, productId={}", customerId, productId);
        productService.saveProductForCustomer(customerId, productId);

        String message = String.format("✅ I have saved the **%s** to your collection!",
                productName != null ? productName : productId);

        ToolCallDto toolCall = ToolCallDto.builder()
                .tool("save_product")
                .arguments(Map.of(
                        "customerId", customerId,
                        "productId", productId
                ))
                .build();

        return new ActionResult("save_product", toolCall, message);
    }
}
