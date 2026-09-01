package com.backend.TravelDiary.dto;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AccessTokenResponse {
  private String accessToken;
}
