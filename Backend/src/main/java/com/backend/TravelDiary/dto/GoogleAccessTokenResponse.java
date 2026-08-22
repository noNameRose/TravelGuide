package com.backend.TravelDiary.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
public class GoogleAccessTokenResponse {
  private String access_token;
}
