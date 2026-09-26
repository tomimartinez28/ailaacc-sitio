import { useCallback, useState } from 'react';
import { Brand } from '../ui/Brand.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { useActiveSection } from '../../hooks/useActiveSection.js';

// Header de la landing: menú de secciones con resaltado según el scroll y menú móvil.
export function LandingHeader({ secciones, subtitle }) {
  const [abierto, setAbierto] = useState(false);
  const activa = useActiveSection(secciones.map((s) => s.id));
  const cerrar = useCallback(() => setAbierto(false), []);

  return (
    <header className={'site' + (abierto ? ' menu-open' : '')}>
      <nav className="nav">
        <Brand href="#inicio" subtitle={subtitle} label="AILAACC — inicio" />

        <div className="nav-links">
          {secciones.map((s) => (
            <a key={s.id} href={'#' + s.id} className={activa === s.id ? 'active' : undefined}>{s.label}</a>
          ))}
        </div>

        <div className="nav-cta">
          <Button variant="white" size="sm" href="#contacto">Consultar</Button>
          <button
            type="button"
            className="nav-burger"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
            aria-controls="mobile-panel"
            onClick={() => setAbierto((v) => !v)}
          >
            <Icon name={abierto ? 'cerrar' : 'menu'} />
          </button>
        </div>
      </nav>

      <div className="mobile-panel" id="mobile-panel">
        {secciones.map((s) => <a key={s.id} href={'#' + s.id} onClick={cerrar}>{s.label}</a>)}
        <Button href="#contacto" onClick={cerrar}>Consultar ahora</Button>
      </div>
    </header>
  );
}

// Header simple: marca que lleva al inicio + una acción opcional a la derecha.
export function SimpleHeader({ subtitle, children }) {
  return (
    <header className="site site-tools">
      <nav className="nav">
        <Brand to="/" subtitle={subtitle} label="AILAACC — inicio" />
        {children}
      </nav>
    </header>
  );
}

// Header de las herramientas: con botón "Volver al sitio".
export function ToolsHeader({ subtitle }) {
  return (
    <SimpleHeader subtitle={subtitle}>
      <Button variant="ghost" size="sm" to="/" className="nav-back">
        <Icon name="volver" />
        Volver al sitio
      </Button>
    </SimpleHeader>
  );
}
