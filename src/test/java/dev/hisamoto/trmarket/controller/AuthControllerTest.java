package dev.hisamoto.trmarket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void deveRegistrarUsuarioComSucesso() throws Exception {
        var body = Map.of(
                "nome", "João Silva",
                "email", "joao@teste.com",
                "senha", "senha123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("joao@teste.com"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    void naoDeveRegistrarEmailDuplicado() throws Exception {
        var body = Map.of(
                "nome", "João Silva",
                "email", "joao@teste.com",
                "senha", "senha123"
        );

        // Registra pela primeira vez
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        // Tenta registrar de novo com o mesmo e-mail
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveLogarAdminComSucesso() throws Exception {
        // Cria admin no banco
        User admin = new User();
        admin.setEmail("admin@teste.com");
        admin.setSenhaHash(passwordEncoder.encode("admin123"));
        admin.setNome("Admin");
        admin.setRole(User.Role.ROLE_ADMIN);
        admin.setProvider(User.Provider.LOCAL);
        admin.setLembretes(false);
        userRepository.save(admin);

        var body = Map.of(
                "email", "admin@teste.com",
                "senha", "admin123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    void naoDeveLogarComSenhaErrada() throws Exception {
        User user = new User();
        user.setEmail("user@teste.com");
        user.setSenhaHash(passwordEncoder.encode("senhaCorreta"));
        user.setNome("User");
        user.setRole(User.Role.ROLE_USER);
        user.setProvider(User.Provider.LOCAL);
        user.setLembretes(false);
        userRepository.save(user);

        var body = Map.of(
                "email", "user@teste.com",
                "senha", "senhaErrada"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }
}