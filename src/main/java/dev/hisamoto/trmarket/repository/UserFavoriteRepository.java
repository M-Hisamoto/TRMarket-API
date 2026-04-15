package dev.hisamoto.trmarket.repository;

import dev.hisamoto.trmarket.model.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {

    List<UserFavorite> findByUserId(Long userId);
    Optional<UserFavorite> findByUserIdAndSkinId(Long userId, Long skinId);
    boolean existsByUserIdAndSkinId(Long userId, Long skinId);
    void deleteByUserIdAndSkinId(Long userId, Long skinId);
}