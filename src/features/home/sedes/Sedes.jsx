import { useCallback, useState } from 'react';
import { SectionHead } from '../../../components/ui/SectionHead.jsx';
import { SEDES } from '../../../data/sitio.js';
import { useAccionesContacto } from '../contacto/useContacto.js';
import { SedeItem } from './SedeItem.jsx';
import { SedesMap } from './SedesMap.jsx';

const SEDE_INICIAL = SEDES.find((s) => s.central).id;

// Estado local: qué sede está abierta. Lo comparten el mapa y el acordeón.
export function Sedes() {
  const [activa, setActiva] = useState(SEDE_INICIAL);
  const { elegirSede } = useAccionesContacto();

  // Acordeón: tocar la sede abierta la cierra
  const alternar = useCallback((id) => setActiva((actual) => (actual === id ? null : id)), []);

  // Mapa: siempre abre; en mobile el mapa queda arriba, así que lleva hasta la sede
  const elegirDesdeMapa = useCallback((id) => {
    setActiva(id);
    if (window.matchMedia('(max-width:900px)').matches) {
      document.querySelector(`.sede-item[data-sede="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <section id="sedes">
      <div className="wrap">
        <SectionHead
          eyebrow="Sedes en el Chaco"
          title="Presentes en seis localidades de la provincia."
          lede="Elegí una sede para ver su dirección, teléfono y horario de atención. La sede central coordina el trabajo institucional desde Sáenz Peña."
        />
        <div className="sedes-layout">
          <SedesMap sedes={SEDES} activa={activa} onElegir={elegirDesdeMapa} />
          <div className="sede-list">
            {SEDES.map((s, i) => (
              <SedeItem key={s.id} sede={s} numero={i + 1} abierta={activa === s.id} onAlternar={alternar} onConsultar={elegirSede} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
