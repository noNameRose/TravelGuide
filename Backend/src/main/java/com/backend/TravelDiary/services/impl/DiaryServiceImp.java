package com.backend.TravelDiary.services.impl;


import com.backend.TravelDiary.dto.DiaryResponse;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.repos.DiaryRepo;
import com.backend.TravelDiary.services.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiaryServiceImp implements DiaryService {

  private final DiaryRepo diaryRepo;

  @Override
  public List<Diary> findDiariesByUser(User user) {
    List<Diary> diaries = this.diaryRepo.findByUser(user).orElseThrow(() -> new RuntimeException());
    return diaries;
  }

  public Diary createDiary(String name, User user) {
    Diary newDiary = Diary
        .builder()
        .name(name)
        .diaryId(UUID.randomUUID().toString())
        .user(user)
        .build();
    this.diaryRepo.save(newDiary);
    return newDiary;
  }

  @Override
  public List<DiaryResponse> convertToDiaryResponse(List<Diary> diaries) {
    List<DiaryResponse> responses = new ArrayList<>();
    for (Diary diary: diaries) {
      responses.add(DiaryResponse
          .builder()
          .name(diary.getName())
          .diaryId(diary.getDiaryId())
          .build()
      );
    }
    return responses;
  }
}
