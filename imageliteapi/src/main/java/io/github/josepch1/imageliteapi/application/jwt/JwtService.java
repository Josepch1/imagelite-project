package io.github.josepch1.imageliteapi.application.jwt;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.github.josepch1.imageliteapi.domain.AccessToken;
import io.github.josepch1.imageliteapi.domain.entity.User;
import io.jsonwebtoken.Jwts;

@Service
public class JwtService {
  
  private final SecretKeyGenerator secretKeyGenerator;

  public JwtService(SecretKeyGenerator secretKeyGenerator) {
    this.secretKeyGenerator = secretKeyGenerator;
  }

  public AccessToken generateToken(User user) {
    SecretKey key = secretKeyGenerator.getKey();
    Date expirationDate = generateExpirationDate();
    Map<String, Object> claims = generateTokenClaims(user);

    String token = Jwts.builder()
                      .signWith(key)
                      .subject(user.getEmail())
                      .expiration(expirationDate)
                      .claims(claims)
                      .compact();

    return new AccessToken(token);
  }

  private Date generateExpirationDate() {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime expiration = now.plusMinutes(60);

    return Date.from(expiration.atZone(ZoneId.systemDefault()).toInstant());
  }

  private Map<String, Object> generateTokenClaims(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("name", user.getName());
    return claims;
  }

  public String getEmailByToken(String token) {
    try {
      return Jwts.parser()
                .verifyWith(secretKeyGenerator.getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
