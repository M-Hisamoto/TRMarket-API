package dev.hisamoto.trmarket.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_favoritos",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skin_id"}))
public class UserFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skin_id", nullable = false)
    private Skin skin;

    @Column(updatable = false)
    private LocalDateTime favoritadoEm;

    @PrePersist
    protected void onCreate() {
        favoritadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Skin getSkin() { return skin; }
    public LocalDateTime getFavoritadoEm() { return favoritadoEm; }

    public void setUser(User user) { this.user = user; }
    public void setSkin(Skin skin) { this.skin = skin; }
}