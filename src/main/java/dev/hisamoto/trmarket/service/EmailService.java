package dev.hisamoto.trmarket.service;

import dev.hisamoto.trmarket.model.Skin;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public EmailService(JavaMailSender mailSender,
                        UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void enviarNovaSkin(Skin skin) {
        List<User> usuarios = userRepository.findByLembretesTrue();
        for (User user : usuarios) {
            try {
                enviarEmailNovaSkin(user, skin);
            } catch (Exception e) {
                System.err.println("Erro ao enviar e-mail para "
                        + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void enviarEmailPersonalizado(String destinatario,
                                         String assunto,
                                         String mensagem) {
        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(mensagem, true);
            mailSender.send(mail);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    private void enviarEmailNovaSkin(User user, Skin skin) throws Exception {
        MimeMessage mail = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");

        helper.setTo(user.getEmail());
        helper.setSubject("Nova skin disponível — " + skin.getArma()
                + " | " + skin.getNome());
        helper.setText(buildEmailNovaSkin(user, skin), true);

        mailSender.send(mail);
    }

    private String buildEmailNovaSkin(User user, Skin skin) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #e8c84a;">Nova skin disponível no TRMarket!</h2>
                <p>Olá, <strong>%s</strong>!</p>
                <p>Uma nova skin foi adicionada à vitrine:</p>
                <table style="border-collapse: collapse; width: 100%%; max-width: 500px;">
                    <tr><td><strong>Arma</strong></td><td>%s</td></tr>
                    <tr><td><strong>Nome</strong></td><td>%s</td></tr>
                    <tr><td><strong>Raridade</strong></td><td>%s</td></tr>
                    <tr><td><strong>Desgaste</strong></td><td>%s</td></tr>
                    <tr><td><strong>Preço</strong></td><td>R$ %s</td></tr>
                    %s
                </table>
                <br>
                <a href="http://localhost:8080/api/skins/%d"
                   style="background:#e8c84a;color:#000;padding:10px 20px;
                          text-decoration:none;border-radius:4px;">
                    Ver skin
                </a>
                <br><br>
                <small>Para cancelar os lembretes, acesse seu perfil.</small>
            </body>
            </html>
            """.formatted(
                user.getNome(),
                skin.getArma(),
                skin.getNome(),
                skin.getRaridade(),
                skin.getDesgaste(),
                skin.getPreco().toString(),
                skin.isStatTrak() ? "<tr><td colspan='2'>✓ StatTrak™</td></tr>" : "",
                skin.getId()
        );
    }
}