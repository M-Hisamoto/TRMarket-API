package dev.hisamoto.trmarket.repository;

import dev.hisamoto.trmarket.model.Skin;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SkinSpecification {

    public static Specification<Skin> filtrar(
            String arma,
            String nome,
            Skin.Categoria categoria,
            Skin.Time time,
            Skin.Raridade raridade,
            Skin.Desgaste desgaste,
            Boolean statTrak,
            Boolean souvenir,
            Skin.Status status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (arma != null && !arma.isBlank())
                predicates.add(cb.like(cb.lower(root.get("arma")),
                        "%" + arma.toLowerCase() + "%"));

            if (nome != null && !nome.isBlank())
                predicates.add(cb.like(cb.lower(root.get("nome")),
                        "%" + nome.toLowerCase() + "%"));

            if (categoria != null)
                predicates.add(cb.equal(root.get("categoria"), categoria));

            if (time != null)
                predicates.add(cb.equal(root.get("time"), time));

            if (raridade != null)
                predicates.add(cb.equal(root.get("raridade"), raridade));

            if (desgaste != null)
                predicates.add(cb.equal(root.get("desgaste"), desgaste));

            if (statTrak != null)
                predicates.add(cb.equal(root.get("statTrak"), statTrak));

            if (souvenir != null)
                predicates.add(cb.equal(root.get("souvenir"), souvenir));

            if (status != null)
                predicates.add(cb.equal(root.get("status"), status));
            else
                predicates.add(cb.equal(root.get("status"), Skin.Status.DISPONIVEL));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}