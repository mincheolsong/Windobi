package com.beenest.windobi.users.repository;

import com.beenest.windobi.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface UsersRepo extends JpaRepository<Users,Long> {
    Users findByIdAndPassword(String userId, String password);
}
