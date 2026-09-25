import { Link } from 'react-router';
import { LOGO } from '../../lib/asset.js';
import { INSTITUCION } from '../../data/sitio.js';

// Logo + sigla. Con `to` navega con el router; con `href` es un ancla (ej. "#inicio").
export function Brand({ subtitle, to, href, label }) {
  const contenido = (
    <>
      <img src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="" />
      <span className="brand-text"><b>{INSTITUCION.sigla}</b><span>{subtitle}</span></span>
    </>
  );
  return to
    ? <Link className="brand" to={to} aria-label={label}>{contenido}</Link>
    : <a className="brand" href={href} aria-label={label}>{contenido}</a>;
}
