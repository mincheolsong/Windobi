package com.beenest.windobi.users.service;

import com.beenest.windobi.users.dto.LoginDto;
import com.beenest.windobi.users.entity.Users;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public interface UsersService {
    HashMap<Object,String> login(LoginDto loginDto);
}
