import { useState } from 'react';
import { Icon } from '../../../components/ui/Icon.jsx';

// Zona para elegir o arrastrar archivos. Llama a onArchivos(File[]) y espera a que termine
// antes de limpiar el input (así se puede volver a elegir el mismo archivo).
export function DropZone({ onArchivos, accept, titulo, descripcion }) {
  const [sobre, setSobre] = useState(false);

  const entrar = (e) => { e.preventDefault(); setSobre(true); };
  const salir = (e) => { e.preventDefault(); setSobre(false); };

  const alSoltar = (e) => {
    salir(e);
    onArchivos([...e.dataTransfer.files]);
  };

  const alElegir = async (e) => {
    const input = e.currentTarget;
    await onArchivos([...input.files]);
    input.value = '';
  };

  return (
    <label className={'zona' + (sobre ? ' sobre' : '')} id="zona"
      onDragEnter={entrar} onDragOver={entrar} onDragLeave={salir} onDrop={alSoltar}>
      <input type="file" id="archivos" accept={accept} multiple onChange={alElegir} />
      <span className="zona-ico" aria-hidden="true"><Icon name="subir" /></span>
      <strong>{titulo}</strong>
      <span className="zona-desc">{descripcion}</span>
      <span className="zona-btn" aria-hidden="true">Elegir archivos</span>
    </label>
  );
}
