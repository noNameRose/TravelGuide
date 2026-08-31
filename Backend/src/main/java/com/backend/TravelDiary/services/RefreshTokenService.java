package com.backend.TravelDiary.services;

public interface RefreshTokenService {
  public String hashToken(String token);
  public String generateToken();
  public String validateToken(String token);
}
