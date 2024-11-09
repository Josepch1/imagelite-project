package io.github.josepch1.imageliteapi.application.users;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.josepch1.imageliteapi.domain.entity.User;
import io.github.josepch1.imageliteapi.domain.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {
  
  private final UserService userService;
  private final UserMapper userMapper;

  @SuppressWarnings("rawtypes")
  @PostMapping
  public ResponseEntity save(@RequestBody UserDTO dto) {
    try {
      User user = userMapper.mapToUser(dto);
      userService.save(user);
  
      return ResponseEntity.status(HttpStatus.CREATED).build();
    } catch (Exception e) {
      Map<String, String> error = Map.of("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  @SuppressWarnings("rawtypes")
  @PostMapping("/auth")
  public ResponseEntity authenticate(@RequestBody CredentialsDTO dto) {
    var token = userService.authenticate(dto.getEmail(), dto.getPassword());

    if (token == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return ResponseEntity.ok(token);
  }
}
