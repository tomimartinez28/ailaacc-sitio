import { Button } from '../../../components/ui/Button.jsx';
import { Eyebrow } from '../../../components/ui/SectionHead.jsx';
import { Icon } from '../../../components/ui/Icon.jsx';
import { LOGO } from '../../../lib/asset.js';
import { SERVICIOS } from '../../../data/sitio.js';

const DATOS = [
  ['6 sedes', 'en la provincia'],
  ['5 servicios', 'especializados'],
  ['U.E.G.P. N° 195', '· Chaco'],
];

// Tarjeta chica del hero que lleva a la sección de servicios
export function HeroCard({ tone, icon, titulo, texto, href = '#servicios' }) {
  return (
    <a className={`hcard tone-${tone}`} href={href}>
      <span className="ico"><Icon name={icon} strokeWidth={2.4} /></span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      <span className="more">Ver servicio →</span>
    </a>
  );
}

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="wrap hero-inner">
        <Eyebrow>Institución de gestión privada · Chaco, Argentina</Eyebrow>
        <h1>Acompañamos a las personas con discapacidad, <span className="grad">en cada etapa.</span></h1>
        <p className="lede">A.I.L.A.A.C.C. (U.E.G.P. N° 195) brinda educación terapéutica, integración escolar, estimulación temprana, transporte adaptado y diagnóstico interdisciplinario, con equipos presentes en seis localidades del Chaco.</p>
        <div className="hero-actions">
          <Button variant="white" href="#contacto">Quiero información <Icon name="flecha" /></Button>
          <Button variant="ghost" href="#sedes">Ver sedes en el Chaco</Button>
        </div>
        <p className="hero-trust">
          {DATOS.map(([fuerte, resto]) => (
            <span key={fuerte}><Icon name="check" /><b>{fuerte}</b>{` ${resto}`}</span>
          ))}
        </p>
      </div>

      <div className="wrap">
        <div className="hero-cards">
          <div className="hcard hcard-logo">
            <img src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="Logo de A.I.L.A.A.C.C." />
            <div><b>A.I.L.A.A.C.C.</b><span>Equipo interdisciplinario en seis sedes</span></div>
          </div>
          {SERVICIOS.filter((s) => s.hero).map((s) => (
            <HeroCard key={s.id} tone={s.tone} icon={s.icon} titulo={s.hero.titulo} texto={s.hero.texto} />
          ))}
        </div>
      </div>
    </section>
  );
}
