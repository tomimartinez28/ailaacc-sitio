import { Link } from 'react-router';
import { Icon } from '../components/ui/Icon.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { ToolHero } from '../tools/components/ToolHero.jsx';
import { HERRAMIENTAS } from '../tools/registro.js';

export function ToolCard({ slug, nombre, descripcion, etiqueta, icono, tone }) {
  return (
    <Link className={`hcard tone-${tone}`} to={`/herramientas/${slug}`}>
      <span className="ico"><Icon name={icono} /></span>
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <span className="more">{etiqueta} · Abrir →</span>
    </Link>
  );
}

export default function ToolsIndexPage() {
  useDocumentTitle('Herramientas – AILAACC');
  return (
    <>
      <ToolHero eyebrow="Uso interno" title="Herramientas del personal">
        Utilidades para el trabajo administrativo de las sedes. Todo se procesa en tu computadora.
      </ToolHero>
      <main className="tool-main">
        <div className="wrap">
          <div className="tools-grid">
            {HERRAMIENTAS.map((h) => <ToolCard key={h.slug} {...h} />)}
            <div className="tool-soon"><b>Próximamente</b><span>Nuevas herramientas para el equipo.</span></div>
          </div>
        </div>
      </main>
    </>
  );
}
