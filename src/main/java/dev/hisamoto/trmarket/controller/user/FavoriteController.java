package dev.hisamoto.trmarket.controller.user;

import dev.hisamoto.trmarket.model.Skin;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.model.UserFavorite;
import dev.hisamoto.trmarket.repository.SkinRepository;
import dev.hisamoto.trmarket.repository.UserFavoriteRepository;
import dev.hisamoto.trmarket.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/favoritos")
public class FavoriteController {

    private final UserFavoriteRepository favoritoRepository;
    private final UserRepository userRepository;
    private final SkinRepository skinRepository;

    public FavoriteController(UserFavoriteRepository favoriteRepository,
                              UserRepository userRepository,
                              SkinRepository skinRepository) {
        this.favoritoRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.skinRepository = skinRepository;
    }

    @GetMapping
    public ResponseEntity<List<Skin>> listarFavoritos(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Skin> skins = favoritoRepository.findByUserId(user.getId())
                .stream()
                .map(fav -> skinRepository.findById(fav.getSkin().getId()).orElseThrow())
                .toList();

        return ResponseEntity.ok(skins);
    }

    @PostMapping("/{skinId}")
    public ResponseEntity<?> favoritar(@PathVariable Long skinId,
                                       Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (favoritoRepository.existsByUserIdAndSkinId(user.getId(), skinId)) {
            return ResponseEntity.badRequest().body("Skin já está nos favoritos");
        }

        Skin skin = skinRepository.findById(skinId)
                .orElseThrow(() -> new RuntimeException("Skin não encontrada"));

        UserFavorite favorito = new UserFavorite();
        favorito.setUser(user);
        favorito.setSkin(skin);

        favoritoRepository.save(favorito);

        return ResponseEntity.ok("Skin adicionada aos favoritos");
    }

    @DeleteMapping("/{skinId}")
    @Transactional
    public ResponseEntity<?> desfavoritar(@PathVariable Long skinId,
                                          Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!favoritoRepository.existsByUserIdAndSkinId(user.getId(), skinId)) {
            return ResponseEntity.notFound().build();
        }

        favoritoRepository.deleteByUserIdAndSkinId(user.getId(), skinId);

        return ResponseEntity.ok("Skin removida dos favoritos");
    }
}