import { Link } from 'react-router';
import { LOGO } from '../../lib/asset.js';
import { INSTITUCION, NAV_SECCIONES, SEDES } from '../../data/sitio.js';

const ANIO = new Date().getFullYear();

export function LandingFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="" />
            <b>{`${INSTITUCION.nombre} — ${INSTITUCION.registro}`}</b>
          </div>
          <div className="foot-links">
            {NAV_SECCIONES.map((s) => <a key={s.id} href={'#' + s.id}>{s.label}</a>)}
          </div>
        </div>
        <div className="foot-bottom">
          <span>{`© ${ANIO} ${INSTITUCION.nombre} · Provincia del Chaco, Argentina`}</span>
          <span>{SEDES.map((s) => s.nombre).join(' · ')}</span>
          <Link className="foot-staff" to="/herramientas">Acceso personal · Herramientas →</Link>
        </div>
      </div>
    </footer>
  );
}

export function CompactFooter() {
  return (
    <footer className="foot-compact">
      <div className="wrap">
        <div className="foot-bottom">
          <span>{`© ${INSTITUCION.nombre} · ${INSTITUCION.registro} · Provincia del Chaco`}</span>
          <Link className="foot-staff" to="/">← Volver al sitio</Link>
        </div>
      </div>
    </footer>
  );
}
