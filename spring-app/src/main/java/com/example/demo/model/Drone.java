package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Entity
public class Drone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double capacidadeMaximaKg;
    private Double autonomiaMaximaKm;
    private Double autonomiaAtualKm;
    private Double velocidadeKmH; // Ex: 60 km/h

    @Enumerated(EnumType.STRING)
    private StatusDrone status;

    @OneToMany(mappedBy = "drone")
    private List<Voo> voos;

    public Drone() {
    }

}
