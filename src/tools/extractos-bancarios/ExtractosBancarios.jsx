import { ToolHero } from '../components/ToolHero.jsx';
import { ProcesadorArchivos } from '../components/ProcesadorArchivos.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Legend } from './components/Legend.jsx';
import { procesarExtracto } from './motor/index.js';
import { describirExtracto, salidaExtracto } from './resumen.js';
import { FORMATOS_ACEPTADOS } from './config.js';
import './extractos.css';

const AVISO_BETA = (
  <div className="aviso" role="note" aria-label="Versión beta">
    <Icon name="info" />
    <p>
      <strong>Versión BETA.</strong> La herramienta todavía se está ajustando. Si encontrás un error
      (un movimiento mal clasificado, un CUIT que falta o un extracto que no se lee), documentalo con el
      nombre del archivo, la fecha, el concepto y el importe del movimiento para poder corregirlo.
    </p>
  </div>
);

export default function ExtractosBancarios() {
  useDocumentTitle('Extractos bancarios – AILAACC');

  return (
    <>
      <ToolHero eyebrow="Bancos · Uso interno" title="Procesamiento de extractos bancarios">
        Subí los extractos de los distintos bancos y descargá un Excel con el resumen de
        ingresos (pagos recibidos) y gastos bancarios (comisiones). Los archivos se procesan
        en tu computadora y no se envían a ningún servidor.
      </ToolHero>

      <ProcesadorArchivos
        procesarArchivo={procesarExtracto}
        accept={FORMATOS_ACEPTADOS}
        titulo="Elegí o arrastrá los extractos"
        descripcion="Extractos en Excel (.xlsx) de Santander, Credicoop, Francés o NBCH. Podés subir varios a la vez."
        describir={describirExtracto}
        nombreSalida={salidaExtracto}
        aviso={AVISO_BETA}
      >
        <Legend />
      </ProcesadorArchivos>
    </>
  );
}
