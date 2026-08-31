package com.backend.TravelDiary.services;

import com.backend.TravelDiary.models.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
  public User createUser(String email, String name, boolean isAccountVerified);
}
