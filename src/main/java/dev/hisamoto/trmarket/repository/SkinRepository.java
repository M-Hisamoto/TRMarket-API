package dev.hisamoto.trmarket.repository;

import dev.hisamoto.trmarket.model.Skin;
import dev.hisamoto.trmarket.model.Skin.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkinRepository extends JpaRepository<Skin, Long>,
        JpaSpecificationExecutor<Skin> {

    List<Skin> findByStatus(Status status);
    List<Skin> findByRaridadeAndStatus(Raridade raridade, Status status);
    List<Skin> findByArmaAndStatus(String arma, Status status);
    List<Skin> findByStatTrakTrueAndStatus(Status status);
    List<Skin> findBySouvenirTrueAndStatus(Status status);
    List<Skin> findByDesgasteAndStatus(Desgaste desgaste, Status status);
}