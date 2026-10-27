package com.shopflow.api.controllers;

import com.shopflow.api.dto.OrderCreateRequestDTO;
import com.shopflow.api.dto.OrderResponseDTO;
import com.shopflow.api.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody OrderCreateRequestDTO request
    ) {
        OrderResponseDTO response = orderService.createOrder(userEmail, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(orderService.getUserOrders(userEmail));
    }
}