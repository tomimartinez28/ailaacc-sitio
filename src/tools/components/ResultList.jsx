import { memo } from 'react';
import { descargar } from '../lib/descargar.js';

// Lista de archivos procesados, común a todas las herramientas.
// Cada herramienta define cómo se resume su resultado:
//   describir(resultado) -> { meta: 'texto', chips: [{ clase, texto }] }
//   nombreSalida(nombreArchivo) -> nombre del Excel a descargar
// (pasar funciones definidas fuera del componente, para que la memoización funcione)

// Un archivo de la lista. Memoizado: al procesar uno nuevo, los ya listos no se vuelven a renderizar.
export const ResultItem = memo(function ResultItem({ item, describir, nombreSalida }) {
  const { nombre, estado, resultado, error } = item;

  if (estado === 'procesando') {
    return <li className="item"><h2>{nombre}</h2><p className="meta">Procesando…</p></li>;
  }
  if (estado === 'error') {
    return <li className="item"><h2>{nombre}</h2><p className="meta err">{error}</p></li>;
  }

  const { meta, chips } = describir(resultado);
  return (
    <li className="item">
      <h2>{nombre}</h2>
      <p className="meta">{meta}</p>
      <div className="chips">
        {chips.map((c) => <span key={c.clase} className={`chip ${c.clase}`}>{c.texto}</span>)}
      </div>
      <button type="button" onClick={() => descargar(nombreSalida(nombre), resultado.buffer)}>Descargar Excel</button>
    </li>
  );
});

export function ResultList({ items, describir, nombreSalida }) {
  return (
    <ul id="lista" aria-live="polite">
      {items.map((it) => <ResultItem key={it.id} item={it} describir={describir} nombreSalida={nombreSalida} />)}
    </ul>
  );
}
