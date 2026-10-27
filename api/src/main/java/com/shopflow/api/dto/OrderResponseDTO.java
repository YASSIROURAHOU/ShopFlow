package com.shopflow.api.dto;

import com.shopflow.api.enums.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponseDTO {
    private Long id;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String stripeClientSecret;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemDTO {
        private Long productId;
        private String productTitle;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}