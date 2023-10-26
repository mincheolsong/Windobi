package com.beenest.windobi.user.service;

import com.beenest.windobi.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
  
  private final UserRepository userRepository;
}
