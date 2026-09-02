package com.backend.TravelDiary.controllers;


import com.backend.TravelDiary.dto.GoogleAccessTokenRequest;
import com.backend.TravelDiary.dto.GoogleAccessTokenResponse;
import com.backend.TravelDiary.dto.GoogleUserProfile;
import com.backend.TravelDiary.models.RefreshToken;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.services.RefreshTokenService;
import com.backend.TravelDiary.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Controller
public class GoogleAuthController {

  @Value("${google.client-id}")
  private String clientId;
  @Value("${google.client-secret}")
  private String clientSecret;
  @Value("${google.redirect-url}")
  private String redirectUri;
  @Value("${google.user-info-url}")
  private String userInfoUrl;
  @Value("${google.access-token-url}")
  private String accessTokenUrl;
  @Value("${google.auth-server-url}")
  private String googleAuthServerUrl;

  @Autowired
  private final RestTemplate rest;
  @Autowired
  private final UserService userService;
  @Autowired
  private final RefreshTokenService refreshTokenService;

  public GoogleAuthController(RestTemplate rest, UserService userService, RefreshTokenService refreshTokenService) {
    this.rest = rest;
    this.userService = userService;
    this.refreshTokenService = refreshTokenService;
  }


  @GetMapping("/auth/google/login")
  @ResponseBody
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
        .fromUriString(this.googleAuthServerUrl)
        .queryParam("client_id", clientId)
        .queryParam("redirect_uri", redirectUri)
        .queryParam("response_type", "code")
        .queryParam("scope", "openid email profile")
        .queryParam("state", state)
        .encode()
        .build()
        .toUriString();

    return ResponseEntity
        .status(HttpStatus.FOUND)
        .location(URI.create(url))
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .build();
  }

  @GetMapping("/auth/google/callback")
  public String callback(
      @RequestParam String code,
      @RequestParam String state,
      @CookieValue("state") String expectedState,
      HttpServletResponse res
  ) {
    if (!state.equals(expectedState)) {
      return null;
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<String> httpEntity = new HttpEntity<>(
        GoogleAccessTokenRequest.builder()
            .code(code)
            .client_id(this.clientId)
            .client_secret(this.clientSecret)
            .redirect_url(this.redirectUri)
            .grant_type("authorization_code")
            .build()
            .toString()
    , headers);

    ResponseEntity<GoogleAccessTokenResponse> response =
        rest.exchange(
            this.accessTokenUrl,
            HttpMethod.POST,
            httpEntity,
            GoogleAccessTokenResponse.class
        );

    String accessToken = response.getBody().getAccess_token();

    HttpHeaders getHeader = new HttpHeaders();
    getHeader.add("Authorization", "Bearer " + accessToken);

    HttpEntity entity = new HttpEntity(null, getHeader);

    ResponseEntity<GoogleUserProfile> profileResponse =
        rest.exchange(
            this.userInfoUrl,
            HttpMethod.GET,
            entity,
            GoogleUserProfile.class
        );
    GoogleUserProfile profile = profileResponse.getBody();
    User user = userService.createUser(profile.getEmail(), profile.getName(), profile.getEmail_verified());
    String refreshToken = this.refreshTokenService.generateToken();
    this.refreshTokenService.saveToken(refreshToken, user);

    ResponseCookie cookie = ResponseCookie
        .from("refreshToken", refreshToken)
        .httpOnly(true)
        .secure(true)
        .sameSite("Lax")
        .maxAge(Duration.ofDays(7))
        .path("/")
        .build();

    res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    return "index.html";
  }
}
