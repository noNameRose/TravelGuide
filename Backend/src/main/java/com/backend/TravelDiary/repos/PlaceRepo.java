package com.backend.TravelDiary.repos;

import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepo extends JpaRepository<Place, Long> {
  Optional<List<Place>> findByDiary(Diary diary);
  Optional<List<Place>> findByDiaryDiaryIdOrderByIndexAsc(String diaryId);
}
