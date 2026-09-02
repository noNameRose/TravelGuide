package com.backend.TravelDiary.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceResponse {
  private String name;
  private String googlePlaceId;
  private String getHereBy;
  private int index;
  private double lat;
  private double lng;
}
