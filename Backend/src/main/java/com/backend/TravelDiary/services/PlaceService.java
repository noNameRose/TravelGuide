package com.backend.TravelDiary.services;


import com.backend.TravelDiary.dto.CreatePlaceRequest;
import com.backend.TravelDiary.dto.PlaceResponse;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;

import java.util.List;

public interface PlaceService {
  public Place createPlace(CreatePlaceRequest request, Diary diary);
  public List<Place> getPlacesInOrder(String diaryId);
  public List<PlaceResponse> getPlaceResponse(String diaryId);
}
