package com.beenest.windobi.users.controller;

import com.beenest.windobi.response.ResponseDto;
import com.beenest.windobi.users.dto.LoginDto;
import com.beenest.windobi.users.service.UsersServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    UsersServiceImpl usersServiceImpl;
    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto){
        HashMap<Object, String> response = usersServiceImpl.login(loginDto);
        return new ResponseEntity<HashMap<Object, String>>(response, HttpStatus.OK);
    }

    //계정삭제

}
