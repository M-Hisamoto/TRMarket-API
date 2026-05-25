package dev.hisamoto.trmarket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hisamoto.trmarket.model.Skin;
import dev.hisamoto.trmarket.model.User;
import dev.hisamoto.trmarket.repository.SkinRepository;
import dev.hisamoto.trmarket.repository.UserRepository;
import dev.hisamoto.trmarket.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.util.HashMap;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SkinControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SkinRepository skinRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenAdmin;
    private String tokenUser;

    @BeforeEach
    void setUp() {
        skinRepository.deleteAll();;
        userRepository.deleteAll();

        User admin = new User();
        admin.setEmail("admin@teste.com");
        admin.setSenhaHash(passwordEncoder.encode("admin123"));
        admin.setNome("Admin");
        admin.setRole(User.Role.ROLE_ADMIN);
        admin.setProvider(User.Provider.LOCAL);
        admin.setLembretes(false);
        userRepository.save(admin);
        tokenAdmin = jwtService.gerarToken(admin.getEmail(), admin.getRole().name());

        User user = new User();
        user.setEmail("user@teste.com");
        user.setSenhaHash(passwordEncoder.encode("senha123"));
        user.setNome("User");
        user.setRole(User.Role.ROLE_USER);
        user.setProvider(User.Provider.LOCAL);
        user.setLembretes(false);
        userRepository.save(user);
        tokenUser = jwtService.gerarToken(user.getEmail(), user.getRole().name());
    }

    @Test
    void deveListarSkinsPublicamente() throws Exception {
        Skin skin = criarSkin("AK-47", "Asiimov");
        skinRepository.save(skin);

        mockMvc.perform(get("/api/skins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Asiimov"));
    }

    @Test
    void deveCadastrarSkinComoAdmin() throws Exception {
        var body = new HashMap<String, Object>();
        body.put("arma", "AWP");
        body.put("nome", "Dragon Lore");
        body.put("categoria", "SNIPER");
        body.put("time", "CT");
        body.put("raridade", "COVERT");
        body.put("desgaste", "FACTORY_NEW");
        body.put("statTrak", false);
        body.put("souvenir", false);
        body.put("preco", 8500.00);
        body.put("status", "DISPONIVEL");
        body.put("imagemUrl", "");
        body.put("descricao", "Skin rara");

        mockMvc.perform(post("/api/admin/skins")
                        .header("Authorization", "Bearer " + tokenAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Dragon Lore"))
                .andExpect(jsonPath("$.status").value("DISPONIVEL"));
    }

    @Test
    void naoDeveCadastrarSkinComoUsuarioComum() throws Exception {
        var body = new HashMap<String, Object>();
        body.put("arma", "AWP");
        body.put("nome", "Dragon Lore");
        body.put("categoria", "SNIPER");
        body.put("time", "CT");
        body.put("raridade", "COVERT");
        body.put("desgaste", "FACTORY_NEW");
        body.put("statTrak", false);
        body.put("souvenir", false);
        body.put("preco", 8500.00);
        body.put("status", "DISPONIVEL");
        body.put("imagemUrl", "");
        body.put("descricao", "");

        mockMvc.perform(post("/api/admin/skins")
                        .header("Authorization", "Bearer " + tokenUser)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }

    @Test
    void deveMarcarSkinComoVendida() throws Exception {
        Skin skin = skinRepository.save(criarSkin("M4A4", "Howl"));

        mockMvc.perform(patch("/api/admin/skins/" + skin.getId() + "/vender")
                        .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VENDIDA"));
    }

    @Test
    void deveFiltrarSkinsPorRaridade() throws Exception {
        Skin covert = criarSkin("AK-47", "Asiimov");
        covert.setRaridade(Skin.Raridade.COVERT);
        skinRepository.save(covert);

        Skin milspec = criarSkin("Glock", "Water Elemental");
        milspec.setRaridade(Skin.Raridade.MIL_SPEC);
        skinRepository.save(milspec);

        mockMvc.perform(get("/api/skins/filtrar?raridade=COVERT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nome").value("Asiimov"));
    }

    @Test
    void deveDeletarSkinComoAdmin() throws Exception {
        Skin skin = skinRepository.save(criarSkin("USP-S", "Kill Confirmed"));

        mockMvc.perform(delete("/api/admin/skins/" + skin.getId())
                        .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isNoContent());
    }

    private Skin criarSkin(String arma, String nome) {
        Skin skin = new Skin();
        skin.setArma(arma);
        skin.setNome(nome);
        skin.setCategoria(Skin.Categoria.RIFLE);
        skin.setTime(Skin.Time.AMBOS);
        skin.setRaridade(Skin.Raridade.COVERT);
        skin.setDesgaste(Skin.Desgaste.FIELD_TESTED);
        skin.setStatTrak(false);
        skin.setSouvenir(false);
        skin.setPreco(new BigDecimal("1000.00"));
        skin.setStatus(Skin.Status.DISPONIVEL);
        return skin;
    }
}