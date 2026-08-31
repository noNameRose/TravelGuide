package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.repos.RefreshTokenRepo;
import com.backend.TravelDiary.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

  private final RefreshTokenRepo refreshTokenRepo;

  @Autowired
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
}
