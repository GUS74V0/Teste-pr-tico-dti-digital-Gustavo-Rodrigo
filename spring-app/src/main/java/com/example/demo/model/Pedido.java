package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Localização do cliente (X, Y)
    private Double coordenadaX;
    private Double coordenadaY;

    // Peso do pacote
    private Double peso;

    @Enumerated(EnumType.STRING)
    // Prioridade da entrega (baixa, média, alta)
    private PrioridadePedido prioridade;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    // Chave estrangeira ligando o pacote a um voo específico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voo_id")
    private Voo voo;

    private LocalDateTime dataCriacao;

    public Pedido() {
    }

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }
}
