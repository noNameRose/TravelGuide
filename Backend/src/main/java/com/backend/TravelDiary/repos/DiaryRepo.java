package com.backend.TravelDiary.repos;


import com.backend.TravelDiary.models.Diary;
import com.backend.TravelDiary.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepo extends JpaRepository<Diary, Long> {

  Optional<List<Diary>> findByUser(User user);
}
