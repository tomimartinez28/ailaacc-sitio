import { Icon } from '../../../components/ui/Icon.jsx';
import { CONTACTO, REDES, SEDE_CENTRAL, direccionCompleta } from '../../../data/sitio.js';

function Linea({ icon, children }) {
  return <div className="side-line"><Icon name={icon} /><span>{children}</span></div>;
}

function Bloque({ titulo, children }) {
  return <div className="side-block"><h4>{titulo}</h4>{children}</div>;
}

export function ContactInfo() {
  return (
    <aside className="contact-side">
      <Bloque titulo={`Casa central — ${SEDE_CENTRAL.nombre}`}>
        <Linea icon="ubicacion">{direccionCompleta(SEDE_CENTRAL)}</Linea>
        <Linea icon="telefono"><a href={CONTACTO.telefono.href}>{CONTACTO.telefono.texto}</a></Linea>
        <Linea icon="mail"><a href={'mailto:' + CONTACTO.email}>{CONTACTO.email}</a></Linea>
      </Bloque>
      <Bloque titulo="Horario de atención">
        <Linea icon="reloj">{CONTACTO.horario}</Linea>
      </Bloque>
      <Bloque titulo="Redes">
        {REDES.map((r) => (
          <Linea key={r.red} icon={r.icono}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.texto} en ${r.red} (se abre en una pestaña nueva)`}>{r.texto}</a>
            {` en ${r.red}`}
          </Linea>
        ))}
      </Bloque>
    </aside>
  );
}
