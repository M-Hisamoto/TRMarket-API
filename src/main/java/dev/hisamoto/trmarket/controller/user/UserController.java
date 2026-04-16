package dev.hisamoto.trmarket.controller.user;

import dev.hisamoto.trmarket.dto.request.PreferencesRequest;
import dev.hisamoto.trmarket.dto.response.UserResponse;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UserResponse> perfil(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNome(),
                user.getRole().name(),
                user.isLembretes()
        ));
    }

    @PutMapping("/preferencias")
    public ResponseEntity<UserResponse> atualizarPreferencias(
            @Valid @RequestBody PreferencesRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setLembretes(request.isLembretes());
        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNome(),
                user.getRole().name(),
                user.isLembretes()
        ));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UserResponse> atualizarPerfil(
            @RequestBody dev.hisamoto.trmarket.dto.request.ProfileUpdateRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (request.getNome() != null && !request.getNome().isBlank())
            user.setNome(request.getNome());

        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNome(),
                user.getRole().name(),
                user.isLembretes()
        ));
    }
}