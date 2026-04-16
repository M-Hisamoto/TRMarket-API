package dev.hisamoto.trmarket.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ProfileUpdateRequest {

    @NotBlank
    private String nome;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}