package com.backend.TravelDiary.models;


import jakarta.persistence.*;
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
  private Integer index;
  private Double lng;
  private Double lat;
  @Column(nullable = true)
  private String getHereBy;

  @ManyToOne()
  @JoinColumn(nullable = false, name = "diaryId")
  private Diary diary;

  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp createAt;
}
