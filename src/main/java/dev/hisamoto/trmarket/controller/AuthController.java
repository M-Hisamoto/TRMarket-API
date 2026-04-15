package dev.hisamoto.trmarket.controller;

import dev.hisamoto.trmarket.dto.request.LoginRequest;
import dev.hisamoto.trmarket.dto.request.RegisterRequest;
import dev.hisamoto.trmarket.dto.response.AuthResponse;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.repository.UserRepository;
import dev.hisamoto.trmarket.security.jwt.JwtService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authManager,
                          JwtService jwtService,
                          UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("E-mail já cadastrado");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setSenhaHash(passwordEncoder.encode(request.getSenha()));
        user.setNome(request.getNome());
        user.setRole(User.Role.ROLE_USER);
        user.setProvider(User.Provider.LOCAL);
        user.setLembretes(false);

        userRepository.save(user);

        String token = jwtService.gerarToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        ));
    }

    // Login com e-mail e senha (admin)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String token = jwtService.gerarToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        ));
    }

    // Callback após login com Google — gera JWT e retorna
    @GetMapping("/oauth2/success")
    public ResponseEntity<AuthResponse> oauth2Success(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String token = jwtService.gerarToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        ));
    }
}