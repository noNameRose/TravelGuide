package com.backend.TravelDiary.models;


import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Place {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String googlePlaceId;
  private Double lng;
  private Double lat;
  @Column(nullable = true)
  private String getHereBy;

  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp createAt;
}
