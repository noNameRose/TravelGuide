package com.backend.TravelDiary.exceptions;

public class DiaryNotFoundException extends RuntimeException {
  public DiaryNotFoundException(String message) {
    super(message);
  }
}
