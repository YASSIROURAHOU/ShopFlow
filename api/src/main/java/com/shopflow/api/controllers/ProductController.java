package com.shopflow.api.controllers;

import com.shopflow.api.dto.ProductRequestDTO;
import com.shopflow.api.dto.ProductResponseDTO;
import com.shopflow.api.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permet les tests frontend facilement
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getActiveProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO dto) {
        ProductResponseDTO created = productService.createProduct(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}