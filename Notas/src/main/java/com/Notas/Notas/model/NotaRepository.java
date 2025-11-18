package com.Notas.Notas.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double calcularPromedioNotas(@Param("avisoId") Integer avisoId);
    
    @Query("SELECT COUNT(n) FROM Nota n WHERE n.aviso.id = :avisoId")
    Long contarNotasPorAviso(@Param("avisoId") Integer avisoId);
}
