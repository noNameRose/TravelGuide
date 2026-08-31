package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.repos.UserRepo;
import com.backend.TravelDiary.services.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepo userRepo;

  public UserServiceImpl(UserRepo userRepo) {
    this.userRepo = userRepo;
  }

  @Override
  public User createUser(String email, String name, boolean isAccountVerified) {
    if (this.userRepo.existsByEmail(email)) {
      return this.loadUserByUsername(email);
    }
    User newUser = User.builder()
        .email(email)
        .name(name)
        .userId(UUID.randomUUID().toString())
        .isAccountVerified(isAccountVerified)
        .build();
    this.userRepo.save(newUser);
    return newUser;
  }

  @Override
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    return this.userRepo
            .findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Account does not exist"));
  }
}
