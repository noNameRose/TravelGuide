package com.backend.TravelDiary.dto;


import lombok.*;

@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse{
  private String email;
  private String name;
}
