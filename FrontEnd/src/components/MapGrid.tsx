import { useState, useRef, MouseEvent as ReactMouseEvent, useEffect } from 'react';
import type { Drone, Pedido, Obstaculo } from '../types';
import DroneMarker from './DroneMarker';
import './MapGrid.css';
import { MapPin, X, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move } from 'lucide-react';

interface MapGridProps {
  obstaculos: Obstaculo[];
  drones: Drone[];
  pedidos: Pedido[];
  activeVoos: any[];
  onAddObstaculo: (obs: Obstaculo) => void;
  onDeleteObstaculo: (id: number) => void;
}

export default function MapGrid({ obstaculos, drones, pedidos, activeVoos, onAddObstaculo, onDeleteObstaculo }: MapGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapGridRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [pendingObstaculo, setPendingObstaculo] = useState<Obstaculo | null>(null);
  const [animatedDrones, setAnimatedDrones] = useState<Record<number, {x: number, y: number, status: string}>>({});
  
  // Camera controls
  const [manualZoom, setManualZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  useEffect(() => {
    if (activeVoos && activeVoos.length > 0) {
      activeVoos.forEach(voo => {
        const droneId = voo.drone.id;
        const pts = voo.pedidos;
        if (!pts || pts.length === 0) return;

        let sequence: any[] = [];
        // Start
        sequence.push({ x: 0, y: 0, status: 'CARREGANDO', delay: 1000 });
        // Deliveries
        pts.forEach((p: any) => {
          sequence.push({ x: p.coordenadaX, y: p.coordenadaY, status: 'EM_VOO', delay: 2000 });
          sequence.push({ x: p.coordenadaX, y: p.coordenadaY, status: 'ENTREGANDO', delay: 1000 });
        });
        // Return
        sequence.push({ x: 0, y: 0, status: 'RETORNANDO', delay: 2000 });
        sequence.push({ x: 0, y: 0, status: 'IDLE', delay: 500 });

        let currentStep = 0;
        const playNext = () => {
          if (currentStep >= sequence.length) return;
          const step = sequence[currentStep];
          setAnimatedDrones(prev => ({
            ...prev,
            [droneId]: { x: step.x, y: step.y, status: step.status }
          }));
          currentStep++;
          setTimeout(playNext, step.delay);
        };
        playNext();
      });
    }
  }, [activeVoos]);

  // Constants for map scale (0 to 100)
  const MAP_MAX = 100;

  const getCoordinates = (e: ReactMouseEvent) => {
    if (!mapGridRef.current) return { x: 0, y: 0 };
    const rect = mapGridRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * MAP_MAX;
    let y = ((e.clientY - rect.top) / rect.height) * MAP_MAX;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    return { x, y };
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (pendingObstaculo || obstaculos.length >= 5) return; 
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

    const cx = (startPoint.x + currentPoint.x) / 2;
    const cy = (startPoint.y + currentPoint.y) / 2;
    const dx = startPoint.x - currentPoint.x;
    const dy = startPoint.y - currentPoint.y;
    const radius = Math.sqrt(dx * dx + dy * dy) / 2; 

    // Max size of 30% of map (15% radius)
    const clampedRadius = Math.min(radius, 15);

    if (clampedRadius > 2) { 
      setPendingObstaculo({
        coordenadaX: cx,
        coordenadaY: cy,
        raioKm: clampedRadius
      });
    } else {
      setStartPoint(null);
      setCurrentPoint(null);
    }
  };

  const confirmObstaculo = () => {
    if (pendingObstaculo) {
      onAddObstaculo(pendingObstaculo);
    }
    setPendingObstaculo(null);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const cancelObstaculo = () => {
    setPendingObstaculo(null);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  // Calculate center camera based on drone position (or base if none moving)
  let cameraX = 0;
  let cameraY = 0;
  let isMoving = false;

  const firstMovingDrone = Object.values(animatedDrones).find(d => d.status !== 'IDLE' && d.status !== 'CARREGANDO');
  if (firstMovingDrone) {
    cameraX = firstMovingDrone.x;
    cameraY = firstMovingDrone.y;
    isMoving = true;
  }
  
  let finalScale = manualZoom;
  let finalPanX = panX;
  let finalPanY = panY;

  if (isMoving) {
    finalScale = 1.2;
    finalPanX = 50 - cameraX;
    finalPanY = 50 - cameraY;
  }
  
  // Apply scale and translate
  const transform = `scale(${finalScale}) translate(${finalPanX}%, ${finalPanY}%)`;

  return (
    <div 
      className="map-grid-wrapper"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="map-controls-panel">
        <button onClick={() => setPanY(y => y + 15)} title="Mover para Cima"><ArrowUp size={16} /></button>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setPanX(x => x + 15)} title="Mover para Esquerda"><ArrowLeft size={16} /></button>
          <button onClick={() => { setManualZoom(1); setPanX(0); setPanY(0); }} title="Resetar Câmera"><Move size={16} /></button>
          <button onClick={() => setPanX(x => x - 15)} title="Mover para Direita"><ArrowRight size={16} /></button>
        </div>
        <button onClick={() => setPanY(y => y - 15)} title="Mover para Baixo"><ArrowDown size={16} /></button>
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <button onClick={() => setManualZoom(z => Math.min(z + 0.2, 3))} title="Zoom In"><ZoomIn size={16} /></button>
          <button onClick={() => setManualZoom(z => Math.max(z - 0.2, 0.5))} title="Zoom Out"><ZoomOut size={16} /></button>
        </div>
      </div>

      <div 
        className="map-grid" 
        ref={mapGridRef}
        style={{ transform, transition: 'transform 0.5s ease', transformOrigin: 'center' }}
      >
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
          >
            {obs.id && (
              <button 
                className="btn-delete-obs" 
                onClick={(e) => { e.stopPropagation(); onDeleteObstaculo(obs.id!); }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {/* Draw Current Selection Box (and pending state) */}
        {(isDrawing || pendingObstaculo) && startPoint && currentPoint && (
          <>
            <div 
              className="selection-box"
              style={{
                top: `${Math.min(startPoint.y, currentPoint.y)}%`,
                left: `${Math.min(startPoint.x, currentPoint.x)}%`,
                width: `${Math.abs(startPoint.x - currentPoint.x)}%`,
                height: `${Math.abs(startPoint.y - currentPoint.y)}%`,
              }}
            />
            {pendingObstaculo && (
              <div 
                className="confirm-box" 
                style={{
                  top: `${Math.max(startPoint.y, currentPoint.y) + 2}%`,
                  left: `${Math.min(startPoint.x, currentPoint.x)}%`,
                }}
              >
                <span>Criar Zona Bloqueada?</span>
                <div className="confirm-actions">
                  <button className="btn-confirm-yes" onClick={confirmObstaculo}>Confirmar</button>
                  <button className="btn-confirm-no" onClick={cancelObstaculo}>Cancelar</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Draw Drones */}
        {drones.map(d => {
          const animState = animatedDrones[d.id!];
          const x = animState ? animState.x : 0;
          const y = animState ? animState.y : 0;
          
          // Merge real backend drone with animated status
          const displayDrone = animState 
            ? { ...d, status: animState.status as any } 
            : d;

          return <DroneMarker key={d.id} drone={displayDrone} x={x} y={y} />;
        })}
      </div>
    </div>
  );
}
