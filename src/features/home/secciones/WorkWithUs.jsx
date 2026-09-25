import { Button } from '../../../components/ui/Button.jsx';
import { MOTIVO_TRABAJO } from '../../../data/sitio.js';
import { useAccionesContacto } from '../contacto/useContacto.js';

export function WorkWithUs() {
  const { elegirMotivo } = useAccionesContacto();
  return (
    <section className="section-tight">
      <div className="wrap">
        <div className="work-with-us">
          <div>
            <h3>¿Querés formar parte del equipo?</h3>
            <p>Sumamos profesionales de educación especial, psicología, fonoaudiología, psicopedagogía, terapia ocupacional y transporte en nuestras seis sedes.</p>
          </div>
          <Button variant="white" href="#contacto" onClick={() => elegirMotivo(MOTIVO_TRABAJO)}>Enviar CV / postularme</Button>
        </div>
      </div>
    </section>
  );
}
