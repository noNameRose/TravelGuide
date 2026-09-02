package com.backend.TravelDiary.services.impl;

import com.backend.TravelDiary.dto.CreatePlaceRequest;
import com.backend.TravelDiary.exceptions.DiaryNotFoundException;
import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;
import com.backend.TravelDiary.repos.PlaceRepo;
import com.backend.TravelDiary.services.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

}
