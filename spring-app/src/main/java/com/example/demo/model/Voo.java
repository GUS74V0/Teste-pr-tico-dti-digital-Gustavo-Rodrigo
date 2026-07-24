package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Entity
public class Voo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drone_id")
    private Drone drone;

    @OneToMany(mappedBy = "voo", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;

    private Double distanciaTotalPrevistaKm;
    private Double pesoTotalCarregadoKg;

    @Enumerated(EnumType.STRING)
    private StatusVoo status;

    private LocalDateTime dataHoraSaida;
    private LocalDateTime dataHoraChegada;

    public Voo() {
    }

}
