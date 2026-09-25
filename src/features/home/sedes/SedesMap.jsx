import { memo } from 'react';

// Mapa esquemático: silueta de la provincia (recuadro) + zona ampliada con las 6 sedes.
// Memoizado: solo se vuelve a dibujar cuando cambia la sede activa.
export const SedesMap = memo(function SedesMap({ sedes, activa, onElegir }) {
  const central = sedes.find((s) => s.central);
  const alTeclear = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onElegir(id); }
  };

  return (
    <div className="map-card">
      <svg viewBox="0 0 340 320" role="group" aria-label="Mapa esquemático de las sedes en el centro-sur del Chaco">
        <rect x="1" y="1" width="338" height="318" rx="4" fill="var(--bg-soft)" />
        <g aria-hidden="true">
          <polygon points="27.3,12.9 46,25.6 64.7,37.5 81.7,49.4 93.6,61.3 90.2,69.8 80,80 37.5,80 30.7,69.8 23.9,51.1 12,39.2 20.5,22.2" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
          <rect x="41.8" y="47.7" width="28.9" height="28.9" fill="none" stroke="var(--orange)" strokeWidth="1.2" />
          <text className="map-inset-label" x="52" y="94" textAnchor="middle">CHACO</text>
          <text className="map-compass" x="318" y="24" textAnchor="middle">N</text>
          <path d="M318 28v14M314 32l4-4 4 4" stroke="var(--ink-soft)" strokeWidth="1.2" fill="none" />
        </g>
        <g aria-hidden="true">
          {sedes.filter((s) => !s.central).map((s) => (
            <line key={s.id} className="map-link" x1={central.mapa.x} y1={central.mapa.y} x2={s.mapa.x} y2={s.mapa.y} />
          ))}
        </g>
        {sedes.map((s) => (
          <g
            key={s.id}
            className={'map-pin' + (activa === s.id ? ' active' : '')}
            data-sede={s.id}
            tabIndex={0}
            role="button"
            aria-label={`Ver sede ${s.nombre}${s.central ? ', casa central' : ''}`}
            onClick={() => onElegir(s.id)}
            onKeyDown={(e) => alTeclear(e, s.id)}
          >
            <circle className="halo" cx={s.mapa.x} cy={s.mapa.y} r="14" />
            <circle className="dot" cx={s.mapa.x} cy={s.mapa.y} r={s.central ? 9 : 7} fill={s.central ? 'var(--orange)' : 'var(--yellow)'} />
            <text x={s.mapa.lx} y={s.mapa.ly} textAnchor={s.mapa.anchor}>{s.nombre}</text>
          </g>
        ))}
      </svg>
      <p className="map-caption">Posición relativa real de cada sede · líneas: coordinación desde casa central</p>
    </div>
  );
});
