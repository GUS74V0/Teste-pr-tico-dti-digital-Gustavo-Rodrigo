package com.example.demo.service;

import com.example.demo.model.Pedido;
import com.example.demo.model.StatusPedido;
import com.example.demo.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    
    public Pedido criarPedido(Pedido pedido) {
        pedido.setStatus(StatusPedido.PENDENTE);
        return pedidoRepository.save(pedido);
    }
    
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }
}
