package com.backend.TravelDiary.controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GoogleAuthController {

  @GetMapping("/")
  public String test() {
    return "Hello";
  }
}
