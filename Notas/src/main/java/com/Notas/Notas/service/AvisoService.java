package com.Notas.Notas.service;

import com.Notas.Notas.model.AvisoAdopcion;
import com.Notas.Notas.model.Nota;
import com.Notas.Notas.model.AvisoAdopcionRepository;
import com.Notas.Notas.model.NotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AvisoService {
    
    private final AvisoAdopcionRepository avisoRepository;
    private final NotaRepository notaRepository;
    
    public AvisoService(AvisoAdopcionRepository avisoRepository, NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }
    
    public List<Map<String, String>> obtenerTodosLosAvisos() {
        List<AvisoAdopcion> avisos = avisoRepository.findAllWithComuna();
        List<Map<String, String>> resultado = new ArrayList<>();
        
        for (AvisoAdopcion aviso : avisos) {
            Map<String, String> avisoData = new HashMap<>();
            Double promedio = notaRepository.calcularPromedioNotas(aviso.getId());
            
            avisoData.put("id", aviso.getId().toString());
            avisoData.put("fechaPublicacion", aviso.getFechaIngreso().toString());
            avisoData.put("sector", aviso.getSector() != null ? aviso.getSector() : "");
            avisoData.put("cantidad", aviso.getCantidad().toString());
            avisoData.put("tipo", aviso.getTipo().name());
            avisoData.put("edad", aviso.getEdad() + " " + 
                (aviso.getUnidadMedida().name().equals("m") ? "meses" : "años"));
            avisoData.put("comuna", aviso.getComuna().getNombre());
            avisoData.put("nota", promedio != null ? String.format("%.1f", promedio) : "-");
            
            resultado.add(avisoData);
        }
        
        return resultado;
    }
    
    @Transactional
    public Map<String, Object> agregarNota(Integer avisoId, Integer notaValor) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<AvisoAdopcion> avisoOpt = avisoRepository.findById(avisoId);
            if (!avisoOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Aviso no encontrado");
                return response;
            }
            
            AvisoAdopcion aviso = avisoOpt.get();
            
            Nota nota = new Nota();
            nota.setAviso(aviso);
            nota.setNota(notaValor);
            notaRepository.save(nota);
            
            Double nuevoPromedio = notaRepository.calcularPromedioNotas(aviso.getId());
            
            response.put("success", true);
            response.put("message", "Nota agregada exitosamente");
            response.put("promedioNota", nuevoPromedio != null ? 
                String.format("%.1f", nuevoPromedio) : "-");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al agregar la nota: " + e.getMessage());
        }
        
        return response;
    }
}
