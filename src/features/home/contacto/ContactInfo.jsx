import { Icon } from '../../../components/ui/Icon.jsx';
import { CONTACTO } from '../../../data/sitio.js';

function Linea({ icon, children }) {
  return <div className="side-line"><Icon name={icon} /><span>{children}</span></div>;
}

function Bloque({ titulo, children }) {
  return <div className="side-block"><h4>{titulo}</h4>{children}</div>;
}

export function ContactInfo() {
  return (
    <aside className="contact-side">
      <Bloque titulo="Casa central — Sáenz Peña">
        <Linea icon="ubicacion">{CONTACTO.direccionCentral}</Linea>
        <Linea icon="telefono"><a href={CONTACTO.telefono.href}>{CONTACTO.telefono.texto}</a></Linea>
        <Linea icon="mail"><a href={'mailto:' + CONTACTO.email}>{CONTACTO.email}</a></Linea>
      </Bloque>
      <Bloque titulo="Horario de atención">
        <Linea icon="reloj">{CONTACTO.horario}</Linea>
      </Bloque>
      <Bloque titulo="Redes">
        {/* TODO: confirmar usuario y enlazar a https://www.instagram.com/USUARIO/ */}
        <Linea icon="instagram">{`${CONTACTO.instagram} en Instagram`}</Linea>
      </Bloque>
    </aside>
  );
}
