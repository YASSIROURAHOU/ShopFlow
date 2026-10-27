package com.shopflow.api.config;

import com.shopflow.api.entities.Product;
import com.shopflow.api.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            List<Product> demoProducts = List.of(
                Product.builder()
                    .title("Casque Sans Fil Audio Pro")
                    .description("Casque Bluetooth avec réduction active de bruit et autonomie 30h.")
                    .price(new BigDecimal("149.99"))
                    .stockQuantity(25)
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                    .active(true)
                    .build(),

                Product.builder()
                    .title("Clavier Mécanique TKL")
                    .description("Switches linéaires rouges, rétroéclairage RGB personnalisable.")
                    .price(new BigDecimal("89.90"))
                    .stockQuantity(12)
                    .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500")
                    .active(true)
                    .build(),

                Product.builder()
                    .title("Souris Ergonomique Sans Fil")
                    .description("Capteur optique haute précision 16000 DPI et prise en main ergonomique.")
                    .price(new BigDecimal("59.50"))
                    .stockQuantity(40)
                    .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500")
                    .active(true)
                    .build(),

                Product.builder()
                    .title("Écran 27\" UltraHD 4K")
                    .description("Dalle IPS 144Hz, HDR400, idéal pour le travail et le multimédia.")
                    .price(new BigDecimal("329.00"))
                    .stockQuantity(8)
                    .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500")
                    .active(true)
                    .build()
            );

            productRepository.saveAll(demoProducts);
            System.out.println(">>> 4 produits de test ont été insérés dans PostgreSQL !");
        }
    }
}