package dev.hisamoto.trmarket.controller;

import dev.hisamoto.trmarket.model.Skin;
import dev.hisamoto.trmarket.repository.SkinRepository;
import dev.hisamoto.trmarket.repository.SkinSpecification;
import dev.hisamoto.trmarket.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkinController {

    private final SkinRepository skinRepository;
    private final EmailService emailService;

    public SkinController(SkinRepository skinRepository, EmailService emailService) {
        this.skinRepository = skinRepository;
        this.emailService = emailService;
    }

    // ── Público ─────────────────────────────────────

    @GetMapping("/skins")
    public ResponseEntity<List<Skin>> listarDisponiveis() {
        return ResponseEntity.ok(
                skinRepository.findByStatus(Skin.Status.DISPONIVEL)
        );
    }

    @GetMapping("/skins/filtrar")
    public ResponseEntity<List<Skin>> filtrar(
            @RequestParam(required = false) String arma,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Skin.Categoria categoria,
            @RequestParam(required = false) Skin.Time time,
            @RequestParam(required = false) Skin.Raridade raridade,
            @RequestParam(required = false) Skin.Desgaste desgaste,
            @RequestParam(required = false) Boolean statTrak,
            @RequestParam(required = false) Boolean souvenir,
            @RequestParam(required = false) Skin.Status status) {

        return ResponseEntity.ok(
                skinRepository.findAll(
                        SkinSpecification.filtrar(
                                arma, nome, categoria, time,
                                raridade, desgaste, statTrak, souvenir, status
                        )
                )
        );
    }

    @GetMapping("/skins/{id}")
    public ResponseEntity<Skin> buscarPorId(@PathVariable Long id) {
        return skinRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skins/raridade/{raridade}")
    public ResponseEntity<List<Skin>> porRaridade(
            @PathVariable Skin.Raridade raridade) {
        return ResponseEntity.ok(
                skinRepository.findByRaridadeAndStatus(raridade, Skin.Status.DISPONIVEL)
        );
    }

    @GetMapping("/skins/arma/{arma}")
    public ResponseEntity<List<Skin>> porArma(@PathVariable String arma) {
        return ResponseEntity.ok(
                skinRepository.findByArmaAndStatus(arma, Skin.Status.DISPONIVEL)
        );
    }

    @GetMapping("/skins/stattrak")
    public ResponseEntity<List<Skin>> statTrak() {
        return ResponseEntity.ok(
                skinRepository.findByStatTrakTrueAndStatus(Skin.Status.DISPONIVEL)
        );
    }

    @GetMapping("/skins/souvenir")
    public ResponseEntity<List<Skin>> souvenir() {
        return ResponseEntity.ok(
                skinRepository.findBySouvenirTrueAndStatus(Skin.Status.DISPONIVEL)
        );
    }

    @GetMapping("/skins/desgaste/{desgaste}")
    public ResponseEntity<List<Skin>> porDesgaste(
            @PathVariable Skin.Desgaste desgaste) {
        return ResponseEntity.ok(
                skinRepository.findByDesgasteAndStatus(desgaste, Skin.Status.DISPONIVEL)
        );
    }

    // ── Admin ────────────────────────────────────────

    @PostMapping("/admin/skins")
    public ResponseEntity<Skin> cadastrar(@Valid @RequestBody Skin skin) {
        Skin salva = skinRepository.save(skin);
        emailService.enviarNovaSkin(salva);
        return ResponseEntity.ok(salva);
    }

    @GetMapping("/admin/skins")
    public ResponseEntity<List<Skin>> listarTodas() {
        return ResponseEntity.ok(skinRepository.findAll());
    }

    @PutMapping("/admin/skins/{id}")
    public ResponseEntity<Skin> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Skin skinAtualizada) {

        return skinRepository.findById(id).map(skin -> {
            skin.setArma(skinAtualizada.getArma());
            skin.setNome(skinAtualizada.getNome());
            skin.setCategoria(skinAtualizada.getCategoria());
            skin.setTime(skinAtualizada.getTime());
            skin.setRaridade(skinAtualizada.getRaridade());
            skin.setDesgaste(skinAtualizada.getDesgaste());
            skin.setStatTrak(skinAtualizada.isStatTrak());
            skin.setSouvenir(skinAtualizada.isSouvenir());
            skin.setPreco(skinAtualizada.getPreco());
            skin.setStatus(skinAtualizada.getStatus());
            skin.setImagemUrl(skinAtualizada.getImagemUrl());
            skin.setDescricao(skinAtualizada.getDescricao());
            return ResponseEntity.ok(skinRepository.save(skin));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/admin/skins/{id}/vender")
    public ResponseEntity<Skin> marcarVendida(@PathVariable Long id) {
        return skinRepository.findById(id).map(skin -> {
            skin.setStatus(Skin.Status.VENDIDA);
            return ResponseEntity.ok(skinRepository.save(skin));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/skins/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!skinRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        skinRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}