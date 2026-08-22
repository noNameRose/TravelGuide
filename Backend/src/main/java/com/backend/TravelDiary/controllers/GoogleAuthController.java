package com.backend.TravelDiary.controllers;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.rmi.server.UID;
import java.time.Duration;
import java.util.UUID;

@RestController
public class GoogleAuthController {

  @Value("${google.client-id}")
  private String clientId;
  @Value("${google.client-secret}")
  private String clientSecret;
  @Value("${google.redirect-url}")
  private String redirectUri;

  @GetMapping("/")
  public String test() {
    return "Hello";
  }

  @GetMapping("/auth/google/login")
  public ResponseEntity<Void> login() {
    String state = UUID.randomUUID().toString();

    ResponseCookie cookie = ResponseCookie
        .from("state", state)
        .httpOnly(true)
        .secure(false)
        .sameSite("Lax")
        .path("/auth/google")
        .maxAge(Duration.ofMinutes(5))
        .build();

    String url = UriComponentsBuilder
        .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
        .queryParam("client_id", clientId)
        .queryParam("redirect_uri", redirectUri)
        .queryParam("response_type", "code")
        .queryParam("scope", "openid email profile")
        .queryParam("state", state)
        .build()
        .toUriString();

    return ResponseEntity
        .status(HttpStatus.FOUND)
        .location(URI.create(url))
        .build();
  }
}
