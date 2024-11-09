package io.github.josepch1.imageliteapi.application.users;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.josepch1.imageliteapi.application.jwt.JwtService;
import io.github.josepch1.imageliteapi.domain.AccessToken;
import io.github.josepch1.imageliteapi.domain.entity.User;
import io.github.josepch1.imageliteapi.domain.service.UserService;
import io.github.josepch1.imageliteapi.infra.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  @Override
  public User getByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  @Transactional
  public User save(User user) {
    var verifyUser = getByEmail(user.getEmail());
    
    if(verifyUser != null){
      throw new RuntimeException("Email already exists");
    }

    encodePassword(user);

    return userRepository.save(user);
  }

  @Override
  public AccessToken authenticate(String email, String password) {
    var user = getByEmail(email);

    if(user == null){
      throw new RuntimeException("User not found");
    }

    if(!passwordEncoder.matches(password, user.getPassword())){
      throw new RuntimeException("Invalid password");
    }

    return jwtService.generateToken(user);
  }
  

  private void encodePassword(User user) {
    String rawPassword = user.getPassword();
    String encodedPassword = passwordEncoder.encode(rawPassword);

    user.setPassword(encodedPassword);
  }
}
