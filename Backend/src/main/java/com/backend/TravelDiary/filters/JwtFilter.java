package com.backend.TravelDiary.filters;


import com.backend.TravelDiary.models.User;
import com.backend.TravelDiary.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

  @Autowired
  private final JwtUtil jwtUtil;
  @Autowired
  private final UserDetailsService userDetailsService;
  private final List<String> PUBLIC_URLS = List.of(
      "/auth/google/login",
      "/auth/google/callback",
      "/auth/access_token"
  );

  public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

    if (PUBLIC_URLS.contains(request.getServletPath())) {
      filterChain.doFilter(request, response);
      return;
    }

    String jwtToken = null;
    String authorizationInfo = request.getHeader("Authorization");
    if (authorizationInfo != null && authorizationInfo.startsWith("Bearer "))
      jwtToken = authorizationInfo.substring(7);

    if (jwtToken != null) {
      String email = this.jwtUtil.extractEmail(jwtToken);
      if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails user = this.userDetailsService.loadUserByUsername(email);

        if (user != null && this.jwtUtil.isTokenValid(jwtToken)) {
          var authToken = new UsernamePasswordAuthenticationToken(
              user, null, user.getAuthorities()
          );
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }

      }
    }
    request.setAttribute("rawToken", jwtToken);
    filterChain.doFilter(request, response);
  }
}
