import { memo } from 'react';
import { Button } from '../../../components/ui/Button.jsx';
import { Icon } from '../../../components/ui/Icon.jsx';
import { HORARIO_SEDES } from '../../../data/sitio.js';

// Una sede del acordeón. Memoizada: al cambiar de sede solo se re-renderizan la que se abre y la que se cierra.
export const SedeItem = memo(function SedeItem({ sede, numero, abierta, onAlternar, onConsultar }) {
  const idHead = `sede-h-${sede.id}`;
  const idBody = `sede-b-${sede.id}`;
  return (
    <div className={'sede-item' + (abierta ? ' active' : '')} data-sede={sede.id}>
      <h3 className="sede-h">
        <button type="button" className="sede-head" id={idHead} aria-expanded={abierta} aria-controls={idBody} onClick={() => onAlternar(sede.id)}>
          <span className="sede-head-l">
            <span className="num">{String(numero).padStart(2, '0')}</span>
            <span className="sede-name">{sede.nombre}</span>
          </span>
          <span className="sede-head-r">
            {sede.central && <span className="sede-badge">Casa central</span>}
            <Icon name="chevron" className="sede-chev" />
          </span>
        </button>
      </h3>
      <div className="sede-body" id={idBody} role="region" aria-labelledby={idHead}>
        <div className="sede-body-inner">
          <div className="sede-line"><Icon name="ubicacion" /><span>{`Dirección a confirmar — ${sede.localidad}, Chaco`}</span></div>
          <div className="sede-line"><Icon name="telefono" /><span>{`${sede.telefono} · WhatsApp disponible`}</span></div>
          <div className="sede-line"><Icon name="reloj" /><span>{HORARIO_SEDES}</span></div>
          <Button size="sm" href="#contacto" onClick={() => onConsultar(sede.opcion)}>Consultar por esta sede</Button>
        </div>
      </div>
    </div>
  );
});
