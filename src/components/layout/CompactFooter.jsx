import { INSTITUCION } from '../../data/institucion.js';

export function CompactFooter() {
  return (
    <footer className="foot-compact">
      <div className="wrap">
        <div className="foot-bottom">
          <span>{`© ${INSTITUCION.nombre} · ${INSTITUCION.registro}`}</span>
        </div>
      </div>
    </footer>
  );
}
