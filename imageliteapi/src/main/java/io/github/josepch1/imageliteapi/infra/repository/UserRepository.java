package io.github.josepch1.imageliteapi.infra.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.josepch1.imageliteapi.domain.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

  User findByEmail(String email);
  
}
