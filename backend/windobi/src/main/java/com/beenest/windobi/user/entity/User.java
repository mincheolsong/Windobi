package com.beenest.windobi.user.entity;

import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
public class User {
  @Id
  private String userId;
  
  private String nickname;
  
  private Long googleId;
}
