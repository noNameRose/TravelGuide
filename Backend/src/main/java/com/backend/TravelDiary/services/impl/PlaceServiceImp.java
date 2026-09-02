package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.dto.CreatePlaceRequest;
import com.backend.TravelDiary.dto.PlaceResponse;
import com.backend.TravelDiary.exceptions.DiaryNotFoundException;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;
import com.backend.TravelDiary.repos.PlaceRepo;
import com.backend.TravelDiary.services.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceServiceImp implements PlaceService {

  private final PlaceRepo placeRepo;

  @Override
  public Place createPlace(CreatePlaceRequest request, Diary diary) {
    List<Place> places = placeRepo.findByDiary(diary).orElseThrow(() -> new DiaryNotFoundException("Places are not found"));
    Place newPlace = Place
        .builder()
        .name(request.getName())
        .googlePlaceId(request.getGooglePlaceId())
        .lat(request.getLat())
        .lng(request.getLng())
        .diary(diary)
        .getHereBy(request.getGetHereBy())
        .index(places.size())
        .build();
    this.placeRepo.save(newPlace);
    return newPlace;
  }

  @Override
  public List<Place> getPlacesInOrder(String diaryId) {
    return this.placeRepo.findByDiaryDiaryIdOrderByIndexAsc(diaryId).orElseThrow(() -> new DiaryNotFoundException("Diary Not Found exception"));
  }

  @Override
  public List<PlaceResponse> getPlaceResponse(String diaryId) {
    List<Place> places = this.getPlacesInOrder(diaryId);
    List<PlaceResponse> responses = new ArrayList<>();
    for (Place place: places) {
      responses.add(PlaceResponse
          .builder()
              .name(place.getName())
              .googlePlaceId(place.getGooglePlaceId())
              .getHereBy(place.getGetHereBy())
              .lat(place.getLat())
              .lng(place.getLng())
              .index(place.getIndex())
          .build());
    }
    return responses;
  }


}
