package dev.hisamoto.trmarket.controller.admin;

import dev.hisamoto.trmarket.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EmailService emailService;

    public AdminController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/emails/enviar")
    public ResponseEntity<String> enviarEmailManual(
            @RequestParam String destinatario,
            @RequestParam String assunto,
            @RequestParam String mensagem) {

        emailService.enviarEmailPersonalizado(destinatario, assunto, mensagem);
        return ResponseEntity.ok("E-mail enviado com sucesso!");
    }
}