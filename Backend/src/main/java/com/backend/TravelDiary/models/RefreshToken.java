package com.backend.TravelDiary.models;


import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "refresh_token")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne()
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  private String hashedToken;
  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp issuedAt;
  private Long expiresAt;
}
