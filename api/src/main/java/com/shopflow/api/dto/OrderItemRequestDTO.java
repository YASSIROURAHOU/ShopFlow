package com.shopflow.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemRequestDTO {
    @NotNull(message = "L'id du produit est requis")
    private Long productId;

    @NotNull(message = "La quantité est requise")
    @Min(value = 1, message = "La quantité minimale est 1")
    private Integer quantity;
}