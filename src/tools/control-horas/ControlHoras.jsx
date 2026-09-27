import { ToolHero } from '../components/ToolHero.jsx';
import { ProcesadorArchivos } from '../components/ProcesadorArchivos.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Legend } from './components/Legend.jsx';
import { procesarArchivo } from './motor/index.js';
import { describirHoras, salidaHoras } from './resumen.js';
import './control-horas.css';

export default function ControlHoras() {
  useDocumentTitle('Control de horas – AILAACC');

  return (
    <>
      <ToolHero eyebrow="Registro dactilar · Uso interno" title="Control de horas">
        Subí los reportes del registro dactilar y descargá un Excel con las entradas,
        salidas y horas de cada persona, día por día. Los archivos se procesan en tu
        computadora y no se envían a ningún servidor.
      </ToolHero>

      <ProcesadorArchivos
        procesarArchivo={procesarArchivo}
        accept=".xls,.xlsx"
        titulo="Elegí o arrastrá los reportes"
        descripcion={'ANVIZ / CrossChex (listado de registros) o reporte con hoja "Logs". Podés subir varios a la vez.'}
        describir={describirHoras}
        nombreSalida={salidaHoras}
      >
        <Legend />
      </ProcesadorArchivos>
    </>
  );
}
