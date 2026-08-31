package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.models.RefreshToken;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.repos.RefreshTokenRepo;
import com.backend.TravelDiary.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

  @Value(value = "${jwt.time.expires}")
  private Long REFRESH_TOKEN_EXPIRES_IN;

  @Autowired
  private final RefreshTokenRepo refreshTokenRepo;

  public RefreshTokenServiceImpl(RefreshTokenRepo refreshTokenRepo) {
    this.refreshTokenRepo = refreshTokenRepo;
  }

  @Override
  public String hashToken(String token) {
    byte[] randomBytes = new byte[64];
    new SecureRandom().nextBytes(randomBytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
  }

  @Override
  public String generateToken() {
    return UUID.randomUUID().toString();
  }



  @Override
  public String validateToken(String token) {

    return "";
  }

  @Override
  public void saveToken(String token, User user) {
    RefreshToken newToken = RefreshToken
        .builder()
        .hashedToken(this.hashToken(token))
        .user(user)
        .expiresAt(System.currentTimeMillis() + this.REFRESH_TOKEN_EXPIRES_IN)
        .build();
    this.refreshTokenRepo.save(newToken);
  }
}
