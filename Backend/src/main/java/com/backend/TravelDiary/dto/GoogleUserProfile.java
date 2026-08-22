package com.backend.TravelDiary.dto;


import lombok.*;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@ToString
@Getter
@Setter
public class GoogleUserProfile {
  private String sub;
  private String name;
  private String given_name;
  private String family_name;
  private String picture;
  private String email;
  private Boolean email_verified;
}
