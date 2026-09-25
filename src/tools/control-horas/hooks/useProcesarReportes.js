import { useCallback, useRef, useState } from 'react';
import { procesarArchivo as procesarConMotor } from '../motor/index.js';

// Estado de la lista de reportes procesados.
// Cada ítem: { id, nombre, estado: 'procesando' | 'listo' | 'error', resultado?, error? }
// Los archivos se procesan de a uno, en el orden en que se eligieron (igual que la versión HTML),
// y el más reciente se muestra arriba.
export function useProcesarReportes(procesarArchivo = procesarConMotor) {
  const [items, setItems] = useState([]);
  const siguienteId = useRef(0);

  const actualizar = useCallback((id, cambios) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...cambios } : it)));
  }, []);

  const procesarUno = useCallback(async (archivo) => {
    const id = ++siguienteId.current;
    setItems((prev) => [{ id, nombre: archivo.name, estado: 'procesando' }, ...prev]);
    try {
      const resultado = await procesarArchivo(await archivo.arrayBuffer(), archivo.name);
      actualizar(id, { estado: 'listo', resultado });
    } catch (err) {
      actualizar(id, { estado: 'error', error: err.message || String(err) });
    }
  }, [procesarArchivo, actualizar]);

  const procesar = useCallback(async (archivos) => {
    for (const a of archivos) await procesarUno(a);
  }, [procesarUno]);

  return { items, procesar };
}
