package com.backend.TravelDiary.utils;


import com.backend.TravelDiary.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {


  @Value(value = "")
  private String SECRET_KEY;

  @Value(value = "")
  private Long REFRESH_TOKEN_EXPIRES_IN;

  public String generateToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    String token = this.createToken(claims, user.getEmail());
    return token;
  }

  public String createToken(Map<String, Object> claims, String email) {
    return Jwts.builder()
        .claims(claims)
        .subject(email)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + this.REFRESH_TOKEN_EXPIRES_IN))
        .signWith(this.getKey(), SignatureAlgorithm.ES256)
        .compact();
  }

  private Key getKey() {
    byte[] keyBytes = Decoders.BASE64.decode(this.SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  private Claims extractAllClaims(String token) {
    return Jwts
            .parser()
            .setSigningKey(this.getKey())
            .build().parseClaimsJws(token)
            .getBody();
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
    Claims claims = this.extractAllClaims(token);
    return claimResolver.apply(claims);
  }

  public String extractEmail(String token) {
    return this.extractClaim(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return this.extractClaim(token, Claims::getExpiration);
  }

  public boolean isTokenValid(String token) {
    return this.extractExpiration(token).before(new Date());
  }


}
