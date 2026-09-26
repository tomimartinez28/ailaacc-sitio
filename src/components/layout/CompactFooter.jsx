import { Link } from 'react-router';
import { INSTITUCION } from '../../data/institucion.js';

export function CompactFooter({ to = '/', texto = '← Volver al sitio' }) {
  return (
    <footer className="foot-compact">
      <div className="wrap">
        <div className="foot-bottom">
          <span>{`© ${INSTITUCION.nombre} · ${INSTITUCION.registro} · Provincia del Chaco`}</span>
          <Link className="foot-staff" to={to}>{texto}</Link>
        </div>
      </div>
    </footer>
  );
}
