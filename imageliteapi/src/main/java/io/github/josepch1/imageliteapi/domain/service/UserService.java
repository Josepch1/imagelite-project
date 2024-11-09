package io.github.josepch1.imageliteapi.domain.service;

import io.github.josepch1.imageliteapi.domain.AccessToken;
import io.github.josepch1.imageliteapi.domain.entity.User;

public interface UserService {
  User getByEmail(String email);
  User save(User user);
  AccessToken authenticate(String email, String password);
}
