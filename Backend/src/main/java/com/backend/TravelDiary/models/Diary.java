package com.backend.TravelDiary.models;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

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
  private long id;

  @ManyToOne()
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  private String name;
  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp createAt;
  @UpdateTimestamp
  private Timestamp updateAt;

}
