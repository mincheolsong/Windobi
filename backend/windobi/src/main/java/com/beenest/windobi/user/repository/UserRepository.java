package com.beenest.windobi.user.repository;

import com.beenest.windobi.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
