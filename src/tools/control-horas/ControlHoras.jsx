import { ToolHero } from '../components/ToolHero.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { DropZone } from './components/DropZone.jsx';
import { Legend } from './components/Legend.jsx';
import { ResultList } from './components/ResultItem.jsx';
import { useProcesarReportes } from './hooks/useProcesarReportes.js';
import './control-horas.css';

export default function ControlHoras() {
  useDocumentTitle('Control de horas – AILAACC');
  const { items, procesar } = useProcesarReportes();

  return (
    <>
      <ToolHero eyebrow="Registro dactilar · Uso interno" title="Control de horas">
        Subí los reportes del registro dactilar y descargá un Excel con las entradas,
        salidas y horas de cada persona, día por día. Los archivos se procesan en tu
        computadora y no se envían a ningún servidor.
      </ToolHero>

      <main className="tool-main">
        <div className="wrap">
          <div className="tool-card">
            <DropZone
              onArchivos={procesar}
              accept=".xls,.xlsx"
              titulo="Elegí o arrastrá los reportes"
              descripcion={'ANVIZ / CrossChex (listado de registros) o reporte con hoja "Logs". Podés subir varios a la vez.'}
            />
            <ResultList items={items} />
          </div>
          <Legend />
        </div>
      </main>
    </>
  );
}
