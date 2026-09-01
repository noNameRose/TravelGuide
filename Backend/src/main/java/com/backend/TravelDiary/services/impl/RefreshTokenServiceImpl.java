package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.exceptions.TokenNotFoundException;
import com.backend.TravelDiary.models.RefreshToken;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.repos.RefreshTokenRepo;
import com.backend.TravelDiary.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
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
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hashBytes);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
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

  @Override
  public RefreshToken findToken(String token) {
    String hashedToken = this.hashToken(token);
    return this.refreshTokenRepo.findByHashedToken(hashedToken).orElseThrow(() -> new TokenNotFoundException("Token does not exist"));
  }
}
