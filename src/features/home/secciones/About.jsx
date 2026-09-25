import { SectionHead } from '../../../components/ui/SectionHead.jsx';
import { FICHA, VALORES } from '../../../data/sitio.js';

export function ValueCard({ tone, titulo, texto }) {
  return (
    <div className={`value tone-${tone}`}>
      <h4>{titulo}</h4>
      <p>{texto}</p>
    </div>
  );
}

export function IdCard({ filas }) {
  return (
    <div className="id-card">
      {filas.map(([k, v]) => <div className="row" key={k}><span>{k}</span><span>{v}</span></div>)}
    </div>
  );
}

export function About() {
  return (
    <section id="nosotros">
      <div className="wrap">
        <SectionHead eyebrow="Sobre nosotros" title="Un equipo interdisciplinario al servicio de cada trayectoria." />
        <div className="about-grid">
          <div className="about-copy">
            <p className="lede">A.I.L.A.A.C.C. es una institución educativa que trabaja junto a personas con discapacidad y sus familias, articulando abordajes terapéuticos, educativos y comunitarios a lo largo de toda la provincia del Chaco.</p>
            <p>Nuestro equipo está integrado por profesionales de la educación especial, psicología, fonoaudiología, psicopedagogía y terapia ocupacional, que diseñan planes de trabajo individuales según la etapa y las necesidades de cada persona.</p>
            <p>La sede central funciona en Sáenz Peña, y desde allí coordinamos el trabajo con los equipos de Villa Ángela, Quitilipi, Tres Isletas, Las Breñas y Charata.</p>
            <IdCard filas={FICHA} />
          </div>
          <div className="values">
            {VALORES.map((v) => <ValueCard key={v.titulo} {...v} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
