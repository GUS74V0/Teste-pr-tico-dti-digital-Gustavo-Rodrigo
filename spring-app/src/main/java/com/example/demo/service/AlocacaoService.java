package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.DroneRepository;
import com.example.demo.repository.PedidoRepository;
import com.example.demo.repository.VooRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlocacaoService {

    private final PedidoRepository pedidoRepository;
    private final DroneRepository droneRepository;
    private final VooRepository vooRepository;

    public AlocacaoService(PedidoRepository pedidoRepository, DroneRepository droneRepository, VooRepository vooRepository) {
        this.pedidoRepository = pedidoRepository;
        this.droneRepository = droneRepository;
        this.vooRepository = vooRepository;
    }


    @Transactional
    public void alocarPedidos() {
        List<Drone> dronesDisponiveis = droneRepository.findAll().stream()
                .filter(d -> d.getStatus() == StatusDrone.IDLE)
                .toList();

        if (dronesDisponiveis.isEmpty()) {
            return;
        }

        List<Pedido> pedidosPendentes = pedidoRepository.findByStatusOrderByPrioridadeDesc(StatusPedido.PENDENTE);

        for (Drone drone : dronesDisponiveis) {
            if (pedidosPendentes.isEmpty()) break;

            List<Pedido> pedidosAlocados = new ArrayList<>();
            double pesoAtual = 0.0;
            double xAtual = 0.0;
            double yAtual = 0.0;
            double distanciaTotalPrevista = 0.0;

            for (Pedido pedido : new ArrayList<>(pedidosPendentes)) {
                if (pesoAtual + pedido.getPeso() > drone.getCapacidadeMaximaKg()) {
                    continue;
                }

                double distanciaParaPedido = calcularDistancia(xAtual, yAtual, pedido.getCoordenadaX(), pedido.getCoordenadaY());
                double distanciaDeVolta = calcularDistancia(pedido.getCoordenadaX(), pedido.getCoordenadaY(), 0.0, 0.0);
                
                double distanciaDeVoltaAntiga = calcularDistancia(xAtual, yAtual, 0.0, 0.0);
                double novaDistanciaTotal = distanciaTotalPrevista - distanciaDeVoltaAntiga + distanciaParaPedido + distanciaDeVolta;

                if (novaDistanciaTotal <= drone.getAutonomiaAtualKm()) {
                    pedidosAlocados.add(pedido);
                    pesoAtual += pedido.getPeso();
                    distanciaTotalPrevista = novaDistanciaTotal;
                    xAtual = pedido.getCoordenadaX();
                    yAtual = pedido.getCoordenadaY();
                    pedidosPendentes.remove(pedido); 
                }
            }

            if (!pedidosAlocados.isEmpty()) {
                Voo voo = new Voo();
                voo.setDrone(drone);
                voo.setPedidos(pedidosAlocados);
                voo.setPesoTotalCarregadoKg(pesoAtual);
                voo.setDistanciaTotalPrevistaKm(distanciaTotalPrevista);
                voo.setStatus(StatusVoo.CRIADO);
                voo.setDataHoraSaida(LocalDateTime.now());

                voo = vooRepository.save(voo);

                for (Pedido p : pedidosAlocados) {
                    p.setStatus(StatusPedido.ALOCADO);
                    p.setVoo(voo);
                    pedidoRepository.save(p);
                }

                drone.setStatus(StatusDrone.CARREGANDO);
                droneRepository.save(drone);
            }
        }
    }

    private double calcularDistancia(double x1, double y1, double x2, double y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}
