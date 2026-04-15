package dev.hisamoto.trmarket.model;

import jakarta.persistence.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "skins")
public class Skin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String arma;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    private Time time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Raridade raridade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Desgaste desgaste;

    private boolean statTrak;
    private boolean souvenir;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String imagemUrl;

    @Column(length = 500)
    private String descricao;

    @Column(updatable = false)
    private LocalDateTime criadaEm;

    private LocalDateTime atualizadaEm;

    public Long getId() { return id; }
    public String getArma() { return arma; }
    public String getNome() { return nome; }
    public Categoria getCategoria() { return categoria; }
    public Time getTime() { return time; }
    public Raridade getRaridade() { return raridade; }
    public Desgaste getDesgaste() { return desgaste; }
    public boolean isStatTrak() { return statTrak; }
    public boolean isSouvenir() { return souvenir; }
    public java.math.BigDecimal getPreco() { return preco; }
    public Status getStatus() { return status; }
    public String getImagemUrl() { return imagemUrl; }
    public String getDescricao() { return descricao; }
    public java.time.LocalDateTime getCriadaEm() { return criadaEm; }
    public java.time.LocalDateTime getAtualizadaEm() { return atualizadaEm; }

    public void setArma(String arma) { this.arma = arma; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    public void setTime(Time time) { this.time = time; }
    public void setRaridade(Raridade raridade) { this.raridade = raridade; }
    public void setDesgaste(Desgaste desgaste) { this.desgaste = desgaste; }
    public void setStatTrak(boolean statTrak) { this.statTrak = statTrak; }
    public void setSouvenir(boolean souvenir) { this.souvenir = souvenir; }
    public void setPreco(java.math.BigDecimal preco) { this.preco = preco; }
    public void setStatus(Status status) { this.status = status; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    @PrePersist
    protected void onCreate() {
        criadaEm = LocalDateTime.now();
        atualizadaEm = LocalDateTime.now();
        if (status == null) status = Status.DISPONIVEL;
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadaEm = LocalDateTime.now();
    }

    // ── Enums internos ──────────────────────────────

    public enum Categoria {
        RIFLE, PISTOLA, FACA, SMG, SHOTGUN, SNIPER, ACESSORIO, AGENTE
    }

    public enum Time {
        CT, TR, AMBOS
    }

    public enum Raridade {
        CONSUMER, INDUSTRIAL, MIL_SPEC, RESTRICTED, CLASSIFIED, COVERT, CONTRABAND
    }

    public enum Desgaste {
        FACTORY_NEW, MINIMAL_WEAR, FIELD_TESTED, WELL_WORN, BATTLE_SCARRED
    }

    public enum Status {
        DISPONIVEL, VENDIDA, RESERVADA
    }
}