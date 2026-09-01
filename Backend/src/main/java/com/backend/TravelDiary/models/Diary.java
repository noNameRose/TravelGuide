package com.backend.TravelDiary.models;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "diary")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Diary {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String diaryId;

  @ManyToOne()
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  @OneToMany(mappedBy = "diary")
  private List<Place> places = new ArrayList<>();

  private String name;
  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp createAt;
  @UpdateTimestamp
  private Timestamp updateAt;

}
