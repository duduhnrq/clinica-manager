package br.com.clinica.config; // Ajuste o pacote

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") 
                    .allowedOrigins(
                        "http://localhost:4200",
                        "https://clinica-frontend-919f.onrender.com" 
                    ) 
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); 
            }
        };
    }
}