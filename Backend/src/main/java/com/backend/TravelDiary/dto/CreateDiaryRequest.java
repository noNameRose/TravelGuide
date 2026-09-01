package com.backend.TravelDiary.dto;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryRequest {
  private String diaryName;
}
