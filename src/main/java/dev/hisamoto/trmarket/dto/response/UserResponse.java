package dev.hisamoto.trmarket.dto.response;

public class UserResponse {

    private Long id;
    private String email;
    private String nome;
    private String role;
    private boolean lembretes;

    public UserResponse(Long id, String email, String nome,
                        String role, boolean lembretes) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.role = role;
        this.lembretes = lembretes;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getRole() { return role; }
    public boolean isLembretes() { return lembretes; }
}