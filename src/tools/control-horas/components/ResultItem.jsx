import { memo } from 'react';
import { descargar, nombreDeSalida } from '../descargar.js';

// Un reporte de la lista. Memoizado: al procesar un archivo nuevo, los ya listos no se vuelven a renderizar.
export const ResultItem = memo(function ResultItem({ item }) {
  const { nombre, estado, resultado, error } = item;

  if (estado === 'procesando') {
    return <li className="item"><h2>{nombre}</h2><p className="meta">Procesando…</p></li>;
  }
  if (estado === 'error') {
    return <li className="item"><h2>{nombre}</h2><p className="meta err">{error}</p></li>;
  }

  const e = resultado.estadisticas;
  return (
    <li className="item">
      <h2>{nombre}</h2>
      <p className="meta">{`${resultado.formato} · ${e.personas} personas · ${e.marcas} marcas`}</p>
      <div className="chips">
        <span className="chip impar">{`${e.diasImpares} días a completar`}</span>
        <span className="chip dup">{`${e.marcasDuplicadas} marcas duplicadas`}</span>
      </div>
      <button type="button" onClick={() => descargar(nombreDeSalida(nombre), resultado.buffer)}>Descargar Excel</button>
    </li>
  );
});

export function ResultList({ items }) {
  return (
    <ul id="lista" aria-live="polite">
      {items.map((it) => <ResultItem key={it.id} item={it} />)}
    </ul>
  );
}
