import { Button } from '../../../components/ui/Button.jsx';
import { Icon } from '../../../components/ui/Icon.jsx';
import { SectionHead } from '../../../components/ui/SectionHead.jsx';
import { MOTIVO_OTRA, SERVICIOS } from '../../../data/sitio.js';
import { useAccionesContacto } from '../contacto/useContacto.js';

export function ServiceCard({ tone, icon, tag, titulo, texto }) {
  return (
    <div className={`serv-card tone-${tone}`}>
      <Icon name={icon} className="icon" />
      <span className="tag">{tag}</span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  );
}

function ServiceCta() {
  const { elegirMotivo } = useAccionesContacto();
  return (
    <div className="serv-card serv-cta">
      <h3>¿No sabés qué servicio necesitás?</h3>
      <p>Contanos la situación y te orientamos hacia el abordaje adecuado.</p>
      <Button variant="white" size="sm" href="#contacto" onClick={() => elegirMotivo(MOTIVO_OTRA)}>Escribinos</Button>
    </div>
  );
}

export function Services() {
  return (
    <section id="servicios" className="wash">
      <div className="wrap">
        <SectionHead
          eyebrow="Nuestros servicios"
          title="Cinco áreas de trabajo, un mismo acompañamiento."
          lede="Desde el diagnóstico inicial hasta el sostén cotidiano en la escuela y el traslado a cada prestación."
        />
        <div className="serv-grid">
          {SERVICIOS.map((s) => <ServiceCard key={s.id} {...s} />)}
          <ServiceCta />
        </div>
      </div>
    </section>
  );
}
