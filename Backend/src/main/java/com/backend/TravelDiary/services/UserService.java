package com.backend.TravelDiary.services;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
  public void createUser(String email, String name, boolean isAccountVerified);
}
