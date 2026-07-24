package com.example.demo.controller;

import com.example.demo.model.Voo;
import com.example.demo.repository.VooRepository;
import com.example.demo.dto.VooResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entregas")
public class VooController {

    private final VooRepository vooRepository;

    public VooController(VooRepository vooRepository) {
        this.vooRepository = vooRepository;
    }

    @GetMapping("/rota")
    public List<Voo> listarVoos() {
        return vooRepository.findAll();
    }

    @PostMapping("/despachar")
    public ResponseEntity<VooResponseDTO> despacharVoo() {
        // Pega a rota calculada, aloca o drone disponível e altera o status para EM_VOO
        return ResponseEntity.ok(null);
    }

}
