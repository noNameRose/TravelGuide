package com.backend.TravelDiary.controllers;

import com.backend.TravelDiary.dto.UserResponse;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/")
  public String testEndPoint() {
      return "Hello from srping boot";
  }


  @GetMapping("/user")
  public ResponseEntity<UserResponse> getUserProfile(
      @CurrentSecurityContext(expression = "authentication?.name") String email
  ) {
    User user = (User) this.userService.loadUserByUsername(email);
    return ResponseEntity.ok(
        UserResponse
            .builder()
            .name(user.getName())
            .email(user.getEmail())
            .build()
    );
  }

}
