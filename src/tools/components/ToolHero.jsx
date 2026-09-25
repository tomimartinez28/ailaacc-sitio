import { Eyebrow } from '../../components/ui/SectionHead.jsx';

// Cabecera con degradé de marca, común a todas las páginas del área de herramientas
export function ToolHero({ eyebrow, title, children }) {
  return (
    <section className="tool-hero">
      <div className="wrap">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {children && <p className="bajada">{children}</p>}
      </div>
    </section>
  );
}
