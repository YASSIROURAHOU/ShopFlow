package com.shopflow.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderCreateRequestDTO {
    @NotEmpty(message = "La commande doit comporter au moins un article")
    @Valid
    private List<OrderItemRequestDTO> items;
}