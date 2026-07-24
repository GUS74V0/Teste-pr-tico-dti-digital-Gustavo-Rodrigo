import { useState, useEffect } from 'react';
import './App.css';
import { Package, Battery, Crosshair, Zap } from 'lucide-react';
import MapGrid from './components/MapGrid';
import SidebarQueue from './components/SidebarQueue';
import DashboardMetrics from './components/DashboardMetrics';
import axios from 'axios';

import type { Pedido, Drone, Obstaculo } from './types';

function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [obstaculos, setObstaculos] = useState<Obstaculo[]>([]);

  const fetchDados = async () => {
    try {
      // Usaremos try-catch e ignoraremos falhas se o endpoint não estiver pronto,
      // mas na vida real os endpoints /pedidos, /drones, /obstaculos deveriam existir.
      // O desafio possui /drones.
      
      const resDrones = await axios.get('http://localhost:8080/drones/status').catch(() => ({ data: [] }));
      setDrones(Array.isArray(resDrones.data) ? resDrones.data : []);
      
      const resObstaculos = await axios.get('http://localhost:8080/obstaculos').catch(() => ({ data: [] }));
      setObstaculos(Array.isArray(resObstaculos.data) ? resObstaculos.data : []);
      
      // Assumindo endpoint de pedidos
      const resPedidos = await axios.get('http://localhost:8080/pedidos').catch(() => ({ data: [] }));
      setPedidos(Array.isArray(resPedidos.data) ? resPedidos.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDados();
    const interval = setInterval(fetchDados, 5000); // Polling a cada 5s
    return () => clearInterval(interval);
  }, []);

  const handleAddObstaculo = async (obs: Obstaculo) => {
    try {
      const res = await axios.post('http://localhost:8080/obstaculos', obs);
      setObstaculos(prev => [...prev, res.data]);
    } catch (e) {
      console.error("Erro ao adicionar obstáculo:", e);
    }
  };

  const handleAddPedido = async (pedido: any) => {
    try {
      const res = await axios.post('http://localhost:8080/pedidos', pedido);
      setPedidos(prev => [...prev, res.data]);
    } catch (e) {
      console.error("Erro ao criar pedido:", e);
    }
  };

  return (
    <div className="app-container">
      <header className="dashboard-header glass-panel">
        <h1 className="glow-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap color="var(--neon-cyan)" /> DroneX Simulator 2D
        </h1>
        <DashboardMetrics drones={drones} pedidos={pedidos} />
      </header>

      <aside className="sidebar glass-panel">
        <SidebarQueue pedidos={pedidos} onAddPedido={handleAddPedido} />
      </aside>

      <main className="main-content glass-panel">
        <MapGrid 
          obstaculos={obstaculos} 
          drones={drones} 
          pedidos={pedidos}
          onAddObstaculo={handleAddObstaculo} 
        />
      </main>
    </div>
  );
}

export default App;
