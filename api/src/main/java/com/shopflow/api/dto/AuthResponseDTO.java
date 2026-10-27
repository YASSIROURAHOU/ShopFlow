package com.shopflow.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponseDTO {
    private String token;
    private String email;
    private String role;
}