package com.backend.TravelDiary.controllers;


import com.backend.TravelDiary.dto.CreatePlaceRequest;
import com.backend.TravelDiary.dto.PlaceResponse;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;
import com.backend.TravelDiary.services.DiaryService;
import com.backend.TravelDiary.services.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PlaceController {

  private final PlaceService placeService;
  private final DiaryService diaryService;

  @PostMapping("/place/{diaryId}")
  public ResponseEntity<Long> addPlace(
      @RequestBody CreatePlaceRequest request,
      @PathVariable String diaryId) {
    Diary diary = this.diaryService.findByDiaryId(diaryId);
    Place newPlace = this.placeService.createPlace(request, diary);
    return ResponseEntity.status(HttpStatus.CREATED).body(newPlace.getId());
  }

  @GetMapping("/place/{diaryId}")
  public ResponseEntity<List<PlaceResponse>> getPlaces(@PathVariable String diaryId) {
    List<PlaceResponse> places = this.placeService.getPlaceResponse(diaryId);
    return ResponseEntity.ok().body(places);
  }
}
