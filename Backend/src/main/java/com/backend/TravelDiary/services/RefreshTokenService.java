package com.backend.TravelDiary.services;

import com.backend.TravelDiary.models.User;

public interface RefreshTokenService {
  public String hashToken(String token);
  public String generateToken();
  public String validateToken(String token);
  public void saveToken(String token, User user);
}
