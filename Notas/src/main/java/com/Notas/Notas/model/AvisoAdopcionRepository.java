package com.Notas.Notas.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Integer> {

    @Query("SELECT a FROM AvisoAdopcion a LEFT JOIN FETCH a.comuna c LEFT JOIN FETCH c.region ORDER BY a.id DESC")
    List<AvisoAdopcion> findAllWithComuna();
}
