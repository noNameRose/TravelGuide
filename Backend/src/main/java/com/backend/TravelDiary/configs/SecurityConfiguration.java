package com.backend.TravelDiary.configs;

import com.backend.TravelDiary.filters.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final JwtFilter jwtFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http.csrf(c -> c.disable())
        .authorizeHttpRequests(
            c -> c
                .requestMatchers("/*", "/auth/google/login", "/auth/google/callback", "/auth/access_token", "/", "/actuator/health")
                .permitAll()
                .anyRequest()
                .authenticated()
        ).addFilterBefore(this.jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .logout(c -> c.disable());

    return http.build();
  }

  @Bean
  public CorsFilter corsFilter() {
    return new CorsFilter(corsConfigurationSource());
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(List.of(

        "http://localhost:5173/"
    ));
    corsConfiguration.setAllowedMethods(List.of("GET", "PUT",  "POST", "DELETE", "PATCH", "OPTIONS"));
    corsConfiguration.setAllowedHeaders(List.of("Content-Type", "Authorization"));
    corsConfiguration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);
    return source;
  }

}
