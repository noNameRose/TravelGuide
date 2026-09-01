package com.backend.TravelDiary.services;


import com.backend.TravelDiary.dto.CreatePlaceRequest;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;

public interface PlaceService {
  public Place createPlace(CreatePlaceRequest request, Diary diary);
}
