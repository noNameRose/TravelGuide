package com.backend.TravelDiary.services;

import com.backend.TravelDiary.dto.DiaryResponse;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.User;

import java.util.List;

public interface DiaryService {
  public List<Diary> findDiariesByUser(User user);
  public Diary findByDiaryId(String diaryId);
  public Diary createDiary(String name, User user);
  public List<DiaryResponse> convertToDiaryResponse(List<Diary> diaries);
}
