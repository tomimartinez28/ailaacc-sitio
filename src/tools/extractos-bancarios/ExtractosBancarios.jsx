import { ToolHero } from '../components/ToolHero.jsx';
import { ProcesadorArchivos } from '../components/ProcesadorArchivos.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Legend } from './components/Legend.jsx';
import { procesarExtracto } from './motor/index.js';
import { describirExtracto, salidaExtracto } from './resumen.js';
import { FORMATOS_ACEPTADOS } from './config.js';
import './extractos.css';

const AVISO = (
  <p className="aviso" role="note">
    <Icon name="info" />
    Herramienta en desarrollo: por ahora podés ver la interfaz, pero todavía no procesa extractos.
  </p>
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
        descripcion="Extractos bancarios en Excel, CSV o PDF. Podés subir varios a la vez."
        describir={describirExtracto}
        nombreSalida={salidaExtracto}
        aviso={AVISO}
      >
        <Legend />
      </ProcesadorArchivos>
    </>
  );
}
