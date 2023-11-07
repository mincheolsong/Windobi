package com.beenest.windobi.users.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userNo;

    @Column(length = 100, unique = true)
    private String id;

    @Column(length = 100, unique = true)
    private String nickname;

    @Column(length = 100)
    private String password;

    @Column(nullable = false)
    private LocalDateTime create_date = LocalDateTime.now();
}
