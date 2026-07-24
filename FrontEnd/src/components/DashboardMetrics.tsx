import type { Drone, Pedido } from '../types';
import './DashboardMetrics.css';

interface DashboardMetricsProps {
  drones: Drone[];
  pedidos: Pedido[];
}

export default function DashboardMetrics({ drones, pedidos }: DashboardMetricsProps) {
  const dronesDisponiveis = drones.filter(d => d.status === 'IDLE').length;
  const dronesEmVoo = drones.filter(d => d.status === 'CARREGANDO' || d.status === 'EM_TRANSITO').length;
  
  const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE').length;
  const pedidosEntregues = pedidos.filter(p => p.status === 'ENTREGUE').length;

  return (
    <div className="metrics-container">
      <div className="metric-card">
        <span className="metric-label">Drones Disponíveis</span>
        <span className="metric-value neon-green">{dronesDisponiveis}</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Drones em Voo</span>
        <span className="metric-value neon-cyan">{dronesEmVoo}</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Pedidos Pendentes</span>
        <span className="metric-value neon-yellow">{pedidosPendentes}</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Entregas Concluídas</span>
        <span className="metric-value neon-purple">{pedidosEntregues}</span>
      </div>
    </div>
  );
}
