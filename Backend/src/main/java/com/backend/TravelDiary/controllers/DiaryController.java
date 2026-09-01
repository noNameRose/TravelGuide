package com.backend.TravelDiary.controllers;


import com.backend.TravelDiary.dto.CreateDiaryRequest;
import com.backend.TravelDiary.dto.DiariesResponse;
import com.backend.TravelDiary.dto.DiaryResponse;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.services.DiaryService;
import com.backend.TravelDiary.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryController {

  private final DiaryService diaryService;
  private final UserService userService;


  @PostMapping("/diary")
  public ResponseEntity<Diary> createDiary(@RequestBody CreateDiaryRequest request,
                                           @CurrentSecurityContext(expression = "authentication?.name") String email
                                          ) {
    User user = (User) this.userService.loadUserByUsername(email);
    Diary newDiary = this.diaryService.createDiary(request.getDiaryName(), user);
    return ResponseEntity.status(HttpStatus.CREATED).body(newDiary);
  }

  @GetMapping("/diary")
  public ResponseEntity<List<DiaryResponse>> getDiaries(@CurrentSecurityContext(expression = "authentication?.name") String email) {
    User user = (User) this.userService.loadUserByUsername(email);
    List<Diary> diaries = this.diaryService.findDiariesByUser(user);
    List<DiaryResponse> diaryList = this.diaryService.convertToDiaryResponse(diaries);
    return ResponseEntity.ok(diaryList);
  }
}
