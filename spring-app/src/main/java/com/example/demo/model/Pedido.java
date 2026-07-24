package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Localização do cliente (X, Y)[cite: 1]
    private Double coordenadaX;
    private Double coordenadaY;

    // Peso do pacote[cite: 1]
    private Double peso;

    @Enumerated(EnumType.STRING)
    // Prioridade da entrega (baixa, média, alta)[cite: 1]
    private PrioridadePedido prioridade;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    // Chave estrangeira ligando o pacote a um voo específico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voo_id")
    private Voo voo;

    public Pedido() {
    }
}
