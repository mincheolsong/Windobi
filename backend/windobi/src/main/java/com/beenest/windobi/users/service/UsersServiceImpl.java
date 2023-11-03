package com.beenest.windobi.users.service;

import com.beenest.windobi.users.dto.LoginDto;
import com.beenest.windobi.users.entity.Users;
import com.beenest.windobi.users.repository.UsersRepo;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class UsersServiceImpl implements UsersService{
    @Autowired
    UsersRepo usersRepo;
    @Override
    public HashMap<Object,String> login(LoginDto loginDto) {
        Users loginUser = usersRepo.findByIdAndPassword(loginDto.getId(), loginDto.getPassword());
        HashMap<Object, String> map = new HashMap<Object, String>();
        if(loginUser == null){
            map.put("message", "로그인 실패!");
            return map;
        }
        map.put("message", "로그인 성공!");
        return map;
    }
}
