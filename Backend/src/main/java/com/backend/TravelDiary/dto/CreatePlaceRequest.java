package com.backend.TravelDiary.dto;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlaceRequest {
  private String name;
  private String googlePlaceId;
  private double lng;
  private double lat;
  private String getHereBy;
}
