package com.backend.TravelDiary.controllers;

import com.backend.TravelDiary.dto.AccessTokenResponse;
import com.backend.TravelDiary.models.RefreshToken;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.repos.RefreshTokenRepo;
import com.backend.TravelDiary.services.RefreshTokenService;
import com.backend.TravelDiary.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenController {

  @Autowired
  private final RefreshTokenService refreshTokenService;
  @Autowired
  private final JwtUtil jwtUtil;

  public TokenController(RefreshTokenService refreshTokenService, JwtUtil jwtUtil) {
    this.refreshTokenService = refreshTokenService;
    this.jwtUtil = jwtUtil;
  }

  @GetMapping("/auth/access_token")
  public ResponseEntity<AccessTokenResponse> getAccessToken(@CookieValue("refreshToken") String token) {
    RefreshToken refreshToken = this.refreshTokenService.findToken(token);
    User user = refreshToken.getUser();
    String jwtToken = this.jwtUtil.generateToken(user);
    AccessTokenResponse response = AccessTokenResponse
        .builder()
        .accessToken(jwtToken)
        .build();
    System.out.println(response);
    return ResponseEntity.ok(
        AccessTokenResponse
            .builder()
            .accessToken(jwtToken)
            .build()
    );
  }
}
