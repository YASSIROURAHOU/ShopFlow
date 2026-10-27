package com.shopflow.api.services;

import com.shopflow.api.dto.OrderCreateRequestDTO;
import com.shopflow.api.dto.OrderItemRequestDTO;
import com.shopflow.api.dto.OrderResponseDTO;
import com.shopflow.api.entities.Order;
import com.shopflow.api.entities.OrderItem;
import com.shopflow.api.entities.Product;
import com.shopflow.api.entities.User;
import com.shopflow.api.enums.OrderStatus;
import com.shopflow.api.repositories.OrderRepository;
import com.shopflow.api.repositories.ProductRepository;
import com.shopflow.api.repositories.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Transactional
    public OrderResponseDTO createOrder(String userEmail, OrderCreateRequestDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .items(new ArrayList<>())
                .build();

        for (OrderItemRequestDTO itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable id: " + itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour: " + product.getTitle());
            }

            // Déduction de stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.getItems().addAll(orderItems);

        // Intention de paiement Stripe (avec gestion d'erreur dev)
        String clientSecret = null;
        try {
            long amountInCents = totalAmount.multiply(new BigDecimal(100)).longValue();
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("eur")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            order.setStripePaymentIntentId(paymentIntent.getId());
            clientSecret = paymentIntent.getClientSecret();
        } catch (Exception e) {
            order.setStripePaymentIntentId("pi_mock_" + System.currentTimeMillis());
            clientSecret = "mock_secret_" + System.currentTimeMillis();
        }

        Order savedOrder = orderRepository.save(order);

        return mapToDTO(savedOrder, clientSecret);
    }

    public List<OrderResponseDTO> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(order -> mapToDTO(order, null))
                .toList();
    }

    private OrderResponseDTO mapToDTO(Order order, String clientSecret) {
        List<OrderResponseDTO.OrderItemDTO> items = order.getItems().stream()
                .map(item -> OrderResponseDTO.OrderItemDTO.builder()
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProduct().getTitle())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .toList();

        return OrderResponseDTO.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .stripeClientSecret(clientSecret)
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}