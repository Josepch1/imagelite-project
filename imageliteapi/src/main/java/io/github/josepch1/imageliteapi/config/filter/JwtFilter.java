package io.github.josepch1.imageliteapi.config.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.josepch1.imageliteapi.application.jwt.JwtService;
import io.github.josepch1.imageliteapi.domain.entity.User;
import io.github.josepch1.imageliteapi.domain.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserService userService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String token = extractToken(request);

    if (token != null) {
      try {
        String email = jwtService.getEmailByToken(token);
        User user = userService.getByEmail(email);

        setUserAsAuthenticated(user);
      } catch (Exception e) {
        log.error("Error while authenticating user", e);
      }
    }

    filterChain.doFilter(request, response);
  }

  private void setUserAsAuthenticated(User user) {
    UserDetails userDetails = org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPassword())
        .roles("USER")
        .build();

    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
        userDetails.getAuthorities());

    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  private String extractToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");

    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.split(" ")[1];
    }

    return null;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    return request.getRequestURI().contains("/v1/users");
  }
}
