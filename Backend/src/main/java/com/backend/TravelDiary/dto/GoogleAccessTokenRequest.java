package com.backend.TravelDiary.dto;


import lombok.*;

@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GoogleAccessTokenRequest {
  private String code;
  private String client_id;
  private String client_secret;
  private String redirect_url;
  private String grant_type;

  public String toString() {
    return "code=" + code + "&" +
            "client_id=" + client_id + "&" +
            "client_secret=" + client_secret + "&" +
            "redirect_uri=" + redirect_url + "&" +
            "grant_type=" + this.grant_type;
  }
}
