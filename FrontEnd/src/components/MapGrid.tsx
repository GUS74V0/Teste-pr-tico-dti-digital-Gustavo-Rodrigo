import { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import type { Drone, Pedido, Obstaculo } from '../types';
import DroneMarker from './DroneMarker';
import './MapGrid.css';
import { MapPin } from 'lucide-react';

interface MapGridProps {
  obstaculos: Obstaculo[];
  drones: Drone[];
  pedidos: Pedido[];
  onAddObstaculo: (obs: Obstaculo) => void;
}

export default function MapGrid({ obstaculos, drones, pedidos, onAddObstaculo }: MapGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

  // Constants for map scale (0 to 100)
  const MAP_MAX = 100;

  const getCoordinates = (e: ReactMouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MAP_MAX;
    const y = ((e.clientY - rect.top) / rect.height) * MAP_MAX;
    return { x, y };
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    const coords = getCoordinates(e);
    setStartPoint(coords);
    setCurrentPoint(coords);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDrawing) return;
    setCurrentPoint(getCoordinates(e));
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !currentPoint) return;
    setIsDrawing(false);

    // Calculate center and radius based on dragged bounding box
    const cx = (startPoint.x + currentPoint.x) / 2;
    const cy = (startPoint.y + currentPoint.y) / 2;
    const dx = startPoint.x - currentPoint.x;
    const dy = startPoint.y - currentPoint.y;
    const radius = Math.sqrt(dx * dx + dy * dy) / 2; // Approximate radius

    if (radius > 2) { // Minimum size to avoid accidental clicks
      onAddObstaculo({
        coordenadaX: cx,
        coordenadaY: cy,
        raioKm: radius
      });
    }

    setStartPoint(null);
    setCurrentPoint(null);
  };

  return (
    <div 
      className="map-grid-wrapper"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="map-grid">
        {/* Draw Base Station */}
        <div className="base-station" style={{ top: '0%', left: '0%' }}>
          BASE
        </div>

        {/* Draw Pedidos as Pins */}
        {pedidos.map(p => (
          <div key={p.id} className="pedido-pin" style={{ top: `${p.coordenadaY}%`, left: `${p.coordenadaX}%` }}>
            <MapPin color={p.status === 'ENTREGUE' ? 'var(--neon-purple)' : 'var(--neon-yellow)'} size={20} />
            <span className="pin-id">#{p.id}</span>
          </div>
        ))}

        {/* Draw Obstáculos */}
        {obstaculos.map((obs, i) => (
          <div 
            key={obs.id || i} 
            className="obstaculo-zone"
            style={{ 
              top: `${obs.coordenadaY}%`, 
              left: `${obs.coordenadaX}%`,
              width: `${obs.raioKm * 2}%`,
              height: `${obs.raioKm * 2}%`
            }}
          />
        ))}

        {/* Draw Current Selection Box */}
        {isDrawing && startPoint && currentPoint && (
          <div 
            className="selection-box"
            style={{
              top: `${Math.min(startPoint.y, currentPoint.y)}%`,
              left: `${Math.min(startPoint.x, currentPoint.x)}%`,
              width: `${Math.abs(startPoint.x - currentPoint.x)}%`,
              height: `${Math.abs(startPoint.y - currentPoint.y)}%`,
            }}
          />
        )}

        {/* Draw Drones */}
        {drones.map(d => {
          // Simplification for 2D visualization: 
          // If IDLE, they are at base (0,0). 
          // If CARREGANDO/EM_TRANSITO, we could try to place them somewhere. For this demo, let's put them at base if IDLE, else randomly spread or moving.
          // In a real system, the Voo would have current coordinates.
          const isIdle = d.status === 'IDLE';
          const x = isIdle ? 0 : 50 + (d.id * 5); // Mock moving position
          const y = isIdle ? 0 : 50 + (d.id * 5); // Mock moving position

          return <DroneMarker key={d.id} drone={d} x={x} y={y} />;
        })}
      </div>
    </div>
  );
}
