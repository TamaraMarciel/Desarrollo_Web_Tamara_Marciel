package com.Notas.Notas.controller;

import com.Notas.Notas.service.AvisoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AvisoController {
    
    private final AvisoService avisoService;
    
    public AvisoController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }
    
    @GetMapping("/")
    public String index() {
        return "redirect:/avisos";
    }
    
    @GetMapping("/avisos")
    public String listarAvisos(Model model) {
        List<Map<String, String>> avisos = avisoService.obtenerTodosLosAvisos();
        model.addAttribute("avisos", avisos);
        return "listado-avisos";
    }
    
    @PostMapping("/api/notas")
    @ResponseBody
    public Map<String, Object> agregarNota(@RequestParam("avisoId") Integer avisoId,
                                            @RequestParam("nota") Integer nota) {
        Map<String, Object> response = new HashMap<>();
        
        if (nota < 1 || nota > 7) {
            response.put("success", false);
            response.put("message", "La nota debe estar entre 1 y 7");
            return response;
        }
        
        return avisoService.agregarNota(avisoId, nota);
    }
}
