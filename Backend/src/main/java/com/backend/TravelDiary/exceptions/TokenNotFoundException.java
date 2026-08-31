package com.backend.TravelDiary.exceptions;

public class TokenNotFoundException extends RuntimeException {
  public TokenNotFoundException(String message) {
    super(message);
  }
}
