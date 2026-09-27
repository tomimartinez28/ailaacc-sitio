import { DropZone } from './DropZone.jsx';
import { ResultList } from './ResultList.jsx';
import { useProcesarArchivos } from '../hooks/useProcesarArchivos.js';

// Cuerpo común de una herramienta que procesa archivos y devuelve un Excel:
// zona para subir archivos + lista de resultados + (children) recuadro de ayuda.
export function ProcesadorArchivos({ procesarArchivo, accept, titulo, descripcion, describir, nombreSalida, aviso, children }) {
  const { items, procesar } = useProcesarArchivos(procesarArchivo);
  return (
    <main className="tool-main">
      <div className="wrap">
        <div className="tool-card">
          {aviso}
          <DropZone onArchivos={procesar} accept={accept} titulo={titulo} descripcion={descripcion} />
          <ResultList items={items} describir={describir} nombreSalida={nombreSalida} />
        </div>
        {children}
      </div>
    </main>
  );
}
