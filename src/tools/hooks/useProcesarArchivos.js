import { useCallback, useRef, useState } from 'react';

// Estado de la lista de archivos procesados por una herramienta.
// procesarArchivo(arrayBuffer, nombre) -> Promise<resultado>; si falla, el error se muestra en la lista.
// Cada ítem: { id, nombre, estado: 'procesando' | 'listo' | 'error', resultado?, error? }
// Los archivos se procesan de a uno, en el orden en que se eligieron, y el más reciente se muestra arriba.
export function useProcesarArchivos(procesarArchivo) {
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
